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

  function getExpires(bytes memory name, bytes memory tld) public view virtual returns (uint256) {
    return _registry.getExpires(keccak256(name), keccak256(tld));
  }

  function isAvailable(bytes memory tld) public view virtual returns (bool) {
    return isExists(keccak256(tld)) && _registry.isEnable(keccak256(tld));
  }

  function isAvailable(bytes memory name, bytes memory tld) public view virtual returns (bool) {
    return getExpires(name, tld) + _registry.getGracePeriod() < block.timestamp;
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
    bytes memory tld,
    address controller,
    bool approved
  ) external onlyRole(ROOT_ROLE) {
    controllers[controller][keccak256(tld)] = approved;
    emit SetController(tld, controller, approved);
  }

  function register(
    bytes memory name,
    bytes memory tld,
    address owner,
    uint64 expires
  ) external onlyController((keccak256(tld))) {
    require(valid(name), "INVALID_DOMAIN_NAME");
    require(isAvailable(name, tld), "DOMAIN_NOT_AVAILABLE");
    require(expires + _registry.getGracePeriod() > block.timestamp + _registry.getGracePeriod(), "DURATION_TOO_SHORT");
    _registry.setRecord(name, tld, owner, address(0), expires);
    emit DomainRegistered(name, tld, owner, expires);
  }

  function renew(
    bytes memory name,
    bytes memory tld,
    uint64 expires
  ) external onlyController(keccak256(tld)) {
    bytes32 _domain = keccak256(name);
    bytes32 _tld = keccak256(tld);
    uint64 expires_ = _registry.getExpires(_domain, _tld);
    require(expires_ + _registry.getGracePeriod() >= block.timestamp, "DOMAIN_EXPIRED");
    require(expires_ + expires + _registry.getGracePeriod() >= expires + _registry.getGracePeriod(), "DURATION_TOO_SHORT");
    _registry.setExpires(_domain, _tld, expires_ + expires);
    emit DomainRenewed(name, tld, expires_ + expires);
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