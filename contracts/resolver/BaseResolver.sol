// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "../utils/Helper.sol";
import "../registry/interfaces/IRegistry.sol";
import "./interfaces/IBaseResolver.sol";
import "../lib/CrossChainProvider.sol";
import "../lib/Chain.sol";

abstract contract BaseResolver is IBaseResolver, Helper, ContextUpgradeable, AccessControlUpgradeable, UUPSUpgradeable {
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  bytes32 internal constant AT = keccak256(bytes("@"));

  IRegistry internal _registry;

  ISynchronizer private _synchronizer;

  mapping(address => CrossChainProvider.CrossChainProvider) private _synchronizerProviders;

  modifier onlyAuthorised(
    bytes memory host,
    bytes memory name,
    bytes memory tld
  ) {
    require(_isAuthorised(host, name, tld), "FORBIDDEN");
    _;
  }

  modifier onlyLive(bytes memory name, bytes memory tld) {
    require(_isLive(name, tld), "DOMAIN_EXPIRED");
    _;
  }

  function __BaseResolver_init(IRegistry registry_) internal onlyInitializing {
    __AccessControl_init();
    __UUPSUpgradeable_init();
    __BaseResolver_init_unchained(registry_);
  }

  function __BaseResolver_init_unchained(IRegistry registry_) internal onlyInitializing {
    _registry = registry_;
    _setRoleAdmin(ADMIN_ROLE, DEFAULT_ADMIN_ROLE);
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _grantRole(ADMIN_ROLE, _msgSender());
  }

  function _isAuthorised(
    bytes memory host,
    bytes memory name,
    bytes memory tld
  ) internal view returns (bool) {
    bytes32 host_ = keccak256(host);
    bytes32 name_ = keccak256(name);
    bytes32 tld_ = keccak256(tld);
    bool isAuthorizedUser = (_registry.getUser(host_, name_, tld_) == _msgSender() || _registry.isOperator(host_, name_, tld_, _msgSender())) &&
      _registry.getUserExpiry(host_, name_, tld_) >= block.timestamp;
    bool isSelfAuthorized = _msgSender() == address(this);
    return isAuthorizedUser || isSelfAuthorized;
  }

  function _isLive(bytes memory name, bytes memory tld) internal view returns (bool) {
    bytes32 domain_ = keccak256(name);
    bytes32 tld_ = keccak256(tld);
    return _registry.isLive(domain_, tld_);
  }

  function _getUser(
    bytes memory host,
    bytes memory name,
    bytes memory tld
  ) internal view returns (address) {
    return _registry.getUser(keccak256(host), keccak256(name), keccak256(tld));
  }

  function _getFqdn(
    bytes memory host,
    bytes memory name,
    bytes memory tld
  ) internal pure returns (bytes32) {
    bytes32 fqdn;
    if (keccak256(bytes(host)) == AT) {
      fqdn = keccak256(_join(name, tld));
    } else {
      require(valid(bytes(host)), "INVALID_HOST");
      fqdn = keccak256(_join(host, name, tld));
    }
    return fqdn;
  }

  function _afterSet(bytes32 tld, bytes memory ews) internal {
    if (_registry.getTldClass(tld) == TldClass.TldClass.OMNI && _registry.getTldChains(tld).length > 0) {
      _requestSync(_registry.getTldChains(tld), ews);
    }
  }

  function _requestSync(Chain.Chain[] memory dstChains, bytes memory ews) internal {
    CrossChainProvider.CrossChainProvider provider = getSynchronizerProvider();
    try _synchronizer.sync(SyncAction.SyncAction.RESOLVER, provider, dstChains, ews) {
      emit OutgoingSync(ews);
    } catch (bytes memory reason) {
      emit OutgoingSyncError(ews, reason);
    }
  }

  function receiveSync(bytes memory ews) external {
    require(_msgSender() == address(_synchronizer), "ONLY_SYNCHRONIZER");
    (bool success, ) = address(this).call(ews);
    // if (!success) emit IncomingSyncError(ews);
    emit IncomingSync(success, ews);
  }

  function setSynchronizer(ISynchronizer synchronizer_) external onlyRole(ADMIN_ROLE) {
    _synchronizer = synchronizer_;
  }

  function getSynchronizerProvider() public view returns (CrossChainProvider.CrossChainProvider) {
    return _synchronizerProviders[_msgSender()];
  }

  function setSynchronizerProvider(CrossChainProvider.CrossChainProvider provider) external {
    _synchronizerProviders[_msgSender()] = provider;
  }

  uint256[50] private __gap;
}
