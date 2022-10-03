//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "./interfaces/IRoot.sol";
import "../registry/interfaces/IRegistry.sol";
import "../registrar/interfaces/IBaseRegistrar.sol";
import "../utils/Synchronizer.sol";
import "../registry/lib/TldClass.sol";

contract Root is IRoot, AccessControlUpgradeable {
  IRegistry private _registry;
  IBaseRegistrar private _baseRegistrar;

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  function initialize(IRegistry registry_, IBaseRegistrar baseRegistrar_) public initializer {
    __Root_init(registry_, baseRegistrar_);
  }

  function __Root_init(IRegistry registry_, IBaseRegistrar baseRegistrar_) internal onlyInitializing {
    __Root_init_unchained(registry_, baseRegistrar_);
  }

  function __Root_init_unchained(IRegistry registry_, IBaseRegistrar baseRegistrar_) internal onlyInitializing {
    _registry = registry_;
    _baseRegistrar = baseRegistrar_;
    _setRoleAdmin(ADMIN_ROLE, DEFAULT_ADMIN_ROLE);
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(ADMIN_ROLE, _msgSender());
  }

  modifier onlyAdmin() {
    require(hasRole(ADMIN_ROLE, _msgSender()), "ONLY_ADMIN");
    _;
  }

  // function _setPublicResolverAddress(address defaultResolver_) external onlyAdmin {
  //   setPublicResolverAddress(defaultResolver_);
  // }

  function register(
    bytes memory tld,
    address resolver_,
    bool enable_,
    TldClass.TldClass class_
  ) public payable onlyAdmin {
    require(!_registry.isExists(keccak256(tld)), "TLD_EXISTS");
    _registry.setRecord(tld, address(this), resolver_, enable_, class_);
  }

  // TODO:
  function transfer(bytes memory tld, address newOwner) public onlyAdmin {
    uint256 tokenId = _registry.getTokenId(tld);
    require(_registry.ownerOf(tokenId) == address(this), "ROOT_NOT_USER_OF_TLD");
    _registry.transferFrom(address(this), newOwner, tokenId);
  }

  function setEnable(bytes memory tld, bool enable_) public payable onlyAdmin {
    _registry.setEnable(keccak256(tld), enable_);
  }

  function setResolver(bytes memory tld, address resolver_) public payable onlyAdmin {
    _registry.setResolver(keccak256(tld), resolver_);
  }

  function setControllerApproval(
    bytes memory tld,
    address controller,
    bool approved
  ) public onlyAdmin {
    _baseRegistrar.setControllerApproval(tld, controller, approved);
  }

  function isEnable(bytes memory tld) public view returns (bool) {
    return _registry.isEnable(keccak256(tld));
  }

  function getResolver(bytes memory tld) public view returns (address) {
    return _registry.getResolver(keccak256(tld));
  }

  function supportsInterface(bytes4 interfaceID) public view override(AccessControlUpgradeable) returns (bool) {
    return interfaceID == type(IRoot).interfaceId || super.supportsInterface(interfaceID);
  }
}
