//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "./interfaces/IRoot.sol";
import "../registry/interfaces/IRegistry.sol";
import "../registrar/interfaces/IRegistrar.sol";
import "../lib/TldClass.sol";
import "../lib/WrapperRecord.sol";
import "../wrapper/Wrapper.sol";

contract Root is IRoot, AccessControlUpgradeable, UUPSUpgradeable {
  IRegistry private _registry;
  IRegistrar private _baseRegistrar;

  address internal _authorizer;

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  function initialize(IRegistry registry_, IRegistrar baseRegistrar_) public initializer {
    __Root_init(registry_, baseRegistrar_);
  }

  function __Root_init(IRegistry registry_, IRegistrar baseRegistrar_) internal onlyInitializing {
    __Root_init_unchained(registry_, baseRegistrar_);
  }

  function __Root_init_unchained(IRegistry registry_, IRegistrar baseRegistrar_) internal onlyInitializing {
    _registry = registry_;
    _baseRegistrar = baseRegistrar_;
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _grantRole(ADMIN_ROLE, _msgSender());
  }

  function register(
    bytes memory tld,
    address resolver,
    uint64 expires,
    bool enable,
    TldClass.TldClass class_
  ) public payable onlyRole(ADMIN_ROLE) {
    require(!_registry.isExists(keccak256(tld)), "TLD_EXISTS");
    _registry.setRecord(tld, address(this), resolver, expires, enable, class_);
  }

  // TODO:
  function transfer(bytes memory tld, address newOwner) public onlyRole(ADMIN_ROLE) {
    uint256 tokenId = _registry.getTokenId(tld);
    WrapperRecord.WrapperRecord memory _wrapper = _registry.getWrapper(keccak256(tld));
    Wrapper(_wrapper.address_).transferFrom(address(this), newOwner, tokenId);
  }

  function setEnable(bytes memory tld, bool enable_) public payable onlyRole(ADMIN_ROLE) {
    _registry.setEnable(keccak256(tld), enable_);
  }

  function setResolver(bytes memory tld, address resolver_) public payable onlyRole(ADMIN_ROLE) {
    _registry.setResolver(keccak256(tld), resolver_);
  }

  function setControllerApproval(
    bytes memory tld,
    address controller,
    bool approved
  ) public onlyRole(ADMIN_ROLE) {
    _baseRegistrar.setControllerApproval(tld, controller, approved);
  }

  function isEnable(bytes memory tld) public view returns (bool) {
    return _registry.isEnable(keccak256(tld));
  }

  function getResolver(bytes memory tld) public view returns (address) {
    return _registry.getResolver(keccak256(tld));
  }

  function getAuthorizer() public view returns (address) {
    return _authorizer;
  }

  function setAuthorizer(address address_) public onlyRole(ADMIN_ROLE) {
    _authorizer = address_;
    emit NewAuthorizer(address_);
  }

  function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}

  function supportsInterface(bytes4 interfaceID) public view override(AccessControlUpgradeable) returns (bool) {
    return interfaceID == type(IRoot).interfaceId || super.supportsInterface(interfaceID);
  }
}
