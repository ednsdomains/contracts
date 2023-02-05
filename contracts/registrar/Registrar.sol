//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "../utils/Helper.sol";
import "../registry/interfaces/IRegistry.sol";
import "../resolver/interfaces/IPublicResolver.sol";
import "./interfaces/IRegistrar.sol";

contract Registrar is IRegistrar, AccessControlUpgradeable, UUPSUpgradeable, Helper {
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant ROOT_ROLE = keccak256("ROOT_ROLE");

  mapping(address => mapping(bytes32 => bool)) public controllers;

  IRegistry private _registry;
  IPublicResolver private _resolver;

  function initialize(IRegistry registry_, IPublicResolver resolver_) public initializer {
    __BaseRegistrar_init(registry_, resolver_);
  }

  function __BaseRegistrar_init(IRegistry registry_, IPublicResolver resolver_) internal onlyInitializing {
    __BaseRegistrar_init_unchained(registry_, resolver_);
    __AccessControl_init();
  }

  function __BaseRegistrar_init_unchained(IRegistry registry_, IPublicResolver resolver_) internal onlyInitializing {
    _registry = registry_;
    _resolver = resolver_;
    _setRoleAdmin(ADMIN_ROLE, DEFAULT_ADMIN_ROLE);
    _setRoleAdmin(ROOT_ROLE, DEFAULT_ADMIN_ROLE);
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _grantRole(ADMIN_ROLE, _msgSender());
  }

  modifier onlyController(bytes32 tld) {
    require(controllers[_msgSender()][tld], "ONLY_CONTROLLER");
    _;
  }

  function getExpiry(bytes memory name, bytes memory tld) public view virtual returns (uint256) {
    return _registry.getExpiry(keccak256(name), keccak256(tld));
  }

  function isAvailable(bytes memory tld) public view virtual returns (bool) {
    return isExists(keccak256(tld)) && _registry.isEnable(keccak256(tld));
  }

  function isAvailable(bytes memory name, bytes memory tld) public view virtual returns (bool) {
    return getExpiry(name, tld) + _registry.getGracePeriod() < block.timestamp;
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

  function setControllerApproval(
    bytes32 tld,
    address controller,
    bool approved
  ) external onlyRole(ROOT_ROLE) {
    controllers[controller][tld] = approved;
    emit SetController(tld, controller, approved);
  }

  function register(
    bytes memory name,
    bytes memory tld,
    address owner,
    uint64 expiry
  ) external onlyController((keccak256(tld))) {
    require(valid(name), "INVALID_DOMAIN_NAME");
    require(isAvailable(name, tld), "DOMAIN_NOT_AVAILABLE");
    require(expiry + _registry.getGracePeriod() > block.timestamp + _registry.getGracePeriod(), "DURATION_TOO_SHORT");
    _registry.setRecord(name, tld, owner, address(0), expiry);
    emit DomainRegistered(name, tld, owner, expiry);
  }

  function renew(
    bytes memory name,
    bytes memory tld,
    uint64 expiry
  ) external onlyController(keccak256(tld)) {
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

  function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}

  function supportsInterface(bytes4 interfaceID) public view override(AccessControlUpgradeable) returns (bool) {
    return super.supportsInterface(interfaceID);
  }
}
