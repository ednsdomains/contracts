//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "./interfaces/IRoot.sol";
import "../registry/IRegistry.sol";
import "../registrar/interfaces/ISingletonRegistrar.sol";
import "../registrar/interfaces/IOmniRegistrar.sol";
import "../utils/Synchronizer.sol";

contract Root is IRoot, AccessControlUpgradeable, Synchronizer {
  IRegistry private _registry;
  ISingletonRegistrar private _singletonRegistrar;
  IOmniRegistrar private _omniRegistrar;

  function initialize(
    IRegistry registry_,
    ISingletonRegistrar singletonRegistrar_,
    IOmniRegistrar omniRegistrar_,
    address _lzEndpoint,
    uint16 chainId_,
    uint16[] memory chainIds_
  ) public initializer {
    __Root_init(registry_, singletonRegistrar_, omniRegistrar_);
    __Synchronizer_init(chainId_, chainIds_, _lzEndpoint);
  }

  function __Root_init(
    IRegistry registry_,
    ISingletonRegistrar singletonRegistrar_,
    IOmniRegistrar omniRegistrar_
  ) internal onlyInitializing {
    __Root_init_unchained(registry_, singletonRegistrar_, omniRegistrar_);
  }

  function __Root_init_unchained(
    IRegistry registry_,
    ISingletonRegistrar singletonRegistrar_,
    IOmniRegistrar omniRegistrar_
  ) internal onlyInitializing {
    _registry = registry_;
    _singletonRegistrar = singletonRegistrar_;
    _omniRegistrar = omniRegistrar_;
    _setRoleAdmin(ADMIN_ROLE, DEFAULT_ADMIN_ROLE);
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(ADMIN_ROLE, _msgSender());
  }

  function register(
    bytes calldata tld,
    address resolver_,
    bool enable_,
    bool omni_
  )  public onlyAdmin payable {
    require(!_registry.exists(keccak256(tld)), "TLD_EXISTS");
    _register(tld, resolver_, enable_, omni_);
    if (omni_) {
      _sync(abi.encodeWithSignature("register_SYNC(bytes,address,bool,bool)", tld, resolver_, enable_, true));
    }
  }

  function register_SYNC(
    bytes calldata tld,
    address resolver_,
    bool enable_,
    bool omni_
  ) external onlySelf {
    _register(tld, resolver_, enable_, omni_);
  }

  function _register(
    bytes calldata tld,
    address resolver_,
    bool enable_,
    bool omni_
  ) internal {
    _registry.setRecord(tld, address(this), resolver_, enable_, omni_);
  }

  // TODO:
  function transfer(bytes calldata tld) public onlyAdmin {}

  // TODO: Omni
  function reclaim(bytes calldata tld) public onlyAdmin {
    _registry.setOwner(keccak256(bytes(tld)), address(this));
  }

  function setEnable(bytes calldata tld, bool enable_) public onlyAdmin {
    _setEnable(tld, enable_);
    if (_registry.omni(keccak256(tld))) _sync(abi.encodeWithSignature("_setEnable(bytes,bool)", tld, enable_));
  }

  function _setEnable(bytes calldata tld, bool enable_) internal {
    _registry.setEnable(keccak256(tld), enable_);
  }

  function setResolver(bytes calldata tld, address resolver_) public onlyAdmin {
    _setResolver(tld, resolver_);
    if (_registry.omni(keccak256(tld))) _sync(abi.encodeWithSignature("_setResolver(bytes,bool)", tld, resolver_));
  }

  function _setResolver(bytes calldata tld, address resolver_) internal {
    _registry.setResolver(keccak256(tld), resolver_);
  }

  function setControllerApproval(
    bytes calldata tld,
    address controller,
    bool approved
  ) public onlyAdmin {
    // require(_registry.exists(keccak256(tld)), "TLD_NOT_EXISTS");
    if (_registry.omni(keccak256(tld))) {
      _omniRegistrar.setControllerApproval(tld, controller, approved);
    } else {
      _singletonRegistrar.setControllerApproval(tld, controller, approved);
    }
  }

  function enable(bytes calldata tld) public view returns (bool) {
    return _registry.enable(keccak256(tld));
  }

  function omni(bytes calldata tld) public view returns (bool) {
    return _registry.omni(keccak256(tld));
  }

  function resolver(bytes calldata tld) public view returns (address) {
    return _registry.resolver(keccak256(tld));
  }

  function supportsInterface(bytes4 interfaceID) public view override(AccessControlUpgradeable, Synchronizer) returns (bool) {
    return interfaceID == type(IRoot).interfaceId || super.supportsInterface(interfaceID);
  }
}
