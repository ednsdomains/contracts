// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "../utils/Helper.sol";
import "../registry/interfaces/IRegistry.sol";
import "../resolver/interfaces/IPublicResolver.sol";
import "./interfaces/IRegistrar.sol";
import "../crosschain/SynchronizerApplication.sol";
import "../crosschain/interfaces/ISynchronizer.sol";

contract Registrar is IRegistrar, SynchronizerApplication, AccessControlUpgradeable, UUPSUpgradeable, Helper {
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
  bytes32 public constant ROOT_ROLE = keccak256("ROOT_ROLE");
  bytes32 public constant BRIDGE_ROLE = keccak256("BRIDGE_ROLE");

  mapping(address => mapping(bytes32 => bool)) public controllers;

  IRegistry private _registry;
  IPublicResolver private _resolver;

  function initialize(IRegistry registry_, IPublicResolver resolver_) public initializer {
    __Registrar_init(registry_, resolver_);
  }

  function __Registrar_init(IRegistry registry_, IPublicResolver resolver_) internal onlyInitializing {
    __Registrar_init_unchained(registry_, resolver_);
    __AccessControl_init();
  }

  function __Registrar_init_unchained(IRegistry registry_, IPublicResolver resolver_) internal onlyInitializing {
    _registry = registry_;
    _resolver = resolver_;
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _grantRole(ADMIN_ROLE, _msgSender());
    _grantRole(OPERATOR_ROLE, _msgSender());
  }

  modifier onlyControllerOrBridge(bytes32 tld) {
    require(controllers[_msgSender()][tld] || hasRole(BRIDGE_ROLE, _msgSender()) || _msgSender() == address(this), "ONLY_CONTROLLER");
    _;
  }

  function getExpiry(bytes memory name, bytes memory tld) public view virtual returns (uint256) {
    return _registry.getExpiry(keccak256(name), keccak256(tld));
  }

  // Is avaliable to register a domain, not is available to register a TLD
  function isAvailable(bytes memory tld) public view virtual returns (bool) {
    return isExists(keccak256(tld)) && _registry.isEnable(keccak256(tld));
  }

  // Is avaliable to register a domain
  function isAvailable(bytes memory name, bytes memory tld) public view virtual returns (bool) {
    return isAvailable(tld) && getExpiry(name, tld) + _registry.getGracePeriod() < block.timestamp;
  }

  function isExists(bytes memory name, bytes memory tld) public view virtual returns (bool) {
    return _registry.getOwner(keccak256(name), keccak256(tld)) != address(0);
  }

  function isExists(bytes32 tld) public view virtual returns (bool) {
    return _registry.isExists(tld);
  }

  function isControllerApproved(bytes32 tld, address controller) public view virtual returns (bool) {
    return controllers[controller][tld];
  }

  function setControllerApproval(bytes32 tld, address controller, bool approved) external onlyRole(ROOT_ROLE) {
    controllers[controller][tld] = approved;
    emit SetController(tld, controller, approved);
  }

  function register(address sender, bytes memory name, bytes memory tld, address owner, uint64 expiry) external payable onlyControllerOrBridge((keccak256(tld))) {
    _register(name, tld, owner, expiry);
    if (_msgSender() != address(this)) {
      bytes32 _tld = keccak256(tld);
      if (_registry.getClass(_tld) == TldClass.OMNI && _registry.getChains(_tld).length > 0) {
        _requestSync(
          payable(sender),
          SyncAction.REGISTRAR,
          _registry.getChains(_tld),
          abi.encodeWithSignature("register(address,bytes,bytes,address,uint64)", sender, name, tld, owner, expiry)
        );
      }
    }
  }

  function _register(bytes memory name, bytes memory tld, address owner, uint64 expiry) private {
    require(valid(name), "INVALID_DOMAIN_NAME");
    require(isAvailable(name, tld), "DOMAIN_NOT_AVAILABLE");
    require(expiry + _registry.getGracePeriod() > block.timestamp + _registry.getGracePeriod(), "DURATION_TOO_SHORT");
    _registry.setRecord(name, tld, owner, address(0), expiry);
    emit DomainRegistered(name, tld, owner, expiry);
  }

  function renew(address sender, bytes memory name, bytes memory tld, uint64 expiry) external payable onlyControllerOrBridge(keccak256(tld)) {
    _renew(name, tld, expiry);
    if (_msgSender() != address(this)) {
      bytes32 _tld = keccak256(tld);
      if (_registry.getClass(_tld) == TldClass.OMNI && _registry.getChains(_tld).length > 0) {
        _requestSync(payable(sender), SyncAction.REGISTRAR, _registry.getChains(_tld), abi.encodeWithSignature("renew(bytes,bytes,uint64)", name, tld, expiry));
      }
    }
  }

  function _renew(bytes memory name, bytes memory tld, uint64 expiry) private {
    bytes32 _domain = keccak256(name);
    bytes32 _tld = keccak256(tld);
    uint64 expiry_ = _registry.getExpiry(_domain, _tld);
    require(expiry_ + _registry.getGracePeriod() >= block.timestamp, "DOMAIN_EXPIRED");
    require(expiry_ + expiry + _registry.getGracePeriod() >= expiry + _registry.getGracePeriod(), "DURATION_TOO_SHORT");
    _registry.setExpiry(_domain, _tld, expiry_ + expiry);
    emit DomainRenewed(name, tld, expiry_ + expiry);
  }

  // function _reclaim(
  //   bytes memory name,
  //   bytes memory tld,
  //   address owner
  // ) internal {
  //   uint256 id = uint256(keccak256(_join(name, tld)));
  //   require(_registry.ownerOf(id) == owner, "FORBIDDEN");
  //   bytes32 _domain = keccak256(name);
  //   bytes32 _tld = keccak256(tld);
  //   require(_registry.isLive(_domain, _tld), "DOMAIN_EXPIRED");
  //   _registry.setOwner(keccak256(name), keccak256(tld), owner);
  //   emit DomainReclaimed(name, tld, owner);
  // }

  function setSynchronizer(ISynchronizer synchronizer_) external onlyRole(ADMIN_ROLE) {
    _setSynchronizer(synchronizer_);
  }

  function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}

  function supportsInterface(bytes4 interfaceID) public view override(AccessControlUpgradeable) returns (bool) {
    return super.supportsInterface(interfaceID);
  }

  uint256[50] private __gap;
}
