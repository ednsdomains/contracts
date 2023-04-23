// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "../utils/Helper.sol";
import "../registry/interfaces/IRegistry.sol";
import "./interfaces/IBaseResolver.sol";
import "../lib/Chain.sol";
import "../crosschain/SynchronizerApplication.sol";
import "../crosschain/interfaces/ISynchronizer.sol";

abstract contract BaseResolver is IBaseResolver, Helper, SynchronizerApplication, AccessControlUpgradeable, UUPSUpgradeable {
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  bytes32 internal constant AT = keccak256(bytes("@"));

  IRegistry internal _registry;

  modifier onlyAuthorised(
    bytes memory host,
    bytes memory name,
    bytes memory tld
  ) {
    require(_isAuthorised(host, name, tld), "FORBIDDEN");
    _;
  }

  modifier onlyLive(
    bytes memory host,
    bytes memory name,
    bytes memory tld
  ) {
    require(_isLive(host, name, tld), "DOMAIN_EXPIRED");
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

  function _isAuthorised(bytes memory host, bytes memory name, bytes memory tld) internal view returns (bool) {
    bytes32 host_ = keccak256(host);
    bytes32 name_ = keccak256(name);
    bytes32 tld_ = keccak256(tld);
    bool isAuthorizedUser = (_registry.getUser(host_, name_, tld_) == _msgSender() || _registry.isOperator(host_, name_, tld_, _msgSender())) &&
      _registry.getUserExpiry(host_, name_, tld_) >= block.timestamp;
    bool isSelfAuthorized = _msgSender() == address(this);
    return isAuthorizedUser || isSelfAuthorized;
  }

  function _isLive(bytes memory host, bytes memory name, bytes memory tld) internal view returns (bool) {
    bytes32 host_ = keccak256(host);
    bytes32 domain_ = keccak256(name);
    bytes32 tld_ = keccak256(tld);
    return _registry.isLive(domain_, tld_) && _registry.isExists(host_, domain_, tld_);
  }

  function _getUser(bytes memory host, bytes memory name, bytes memory tld) internal view returns (address) {
    return _registry.getUser(keccak256(host), keccak256(name), keccak256(tld));
  }

  function _getFqdn(bytes memory host, bytes memory name, bytes memory tld) internal pure returns (bytes32) {
    bytes32 fqdn;
    if (keccak256(bytes(host)) == AT) {
      fqdn = keccak256(_join(name, tld));
    } else {
      require(valid(bytes(host)), "INVALID_HOST");
      fqdn = keccak256(_join(host, name, tld));
    }
    return fqdn;
  }

  function _afterExec(bytes32 tld, bytes memory ews) internal {
    if (_msgSender() != address(this)) {
      if (_registry.getClass(tld) == TldClass.OMNI && _registry.getChains(tld).length > 0) {
        _requestSync(payable(_msgSender()), SyncAction.RESOLVER, _registry.getChains(tld), ews);
      }
    }
  }

  function setSynchronizer(ISynchronizer synchronizer_) public onlyRole(ADMIN_ROLE) {
    _setSynchronizer(synchronizer_);
  }

  uint256[50] private __gap;
}
