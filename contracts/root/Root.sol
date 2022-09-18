//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "./interfaces/IRoot.sol";
import "../registry/interfaces/IRegistry.sol";
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
    uint16 chainId_
  ) public initializer {
    __Root_init(registry_, singletonRegistrar_, omniRegistrar_);
    __Synchronizer_init(chainId_, _lzEndpoint);
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

  function _setPublicResolverAddress(address defaultResolver_) external onlyAdmin {
    setPublicResolverAddress(defaultResolver_);
  }

  function register(
    bytes memory tld,
    address resolver_,
    bool enable_,
    bool omni_,
    uint16[] memory lzChainIds
  ) public payable onlyAdmin {
    require(!_registry.isExists(keccak256(tld)), "TLD_EXISTS");
    _register(tld, resolver_, enable_, omni_, lzChainIds);
    if (omni_) {
      // console.log("Root Register Payload: ");
      // console.logBytes(abi.encodeWithSignature("register_SYNC(bytes,address,bool,bool)", tld, resolver_, enable_, true));
      //      uint16[] memory lzChainIds_ = _registry.getLzChainIds(keccak256(tld));

      _sync(lzChainIds, abi.encodeWithSignature("register_SYNC(bytes,address,bool,bool,uint16[])", tld, resolver_, enable_, true, lzChainIds), msg.value);
      //      register_SYNC( tld, resolver_, enable_, true,lzChainIds);
    }
  }

  function register_SYNC(
    bytes memory tld,
    address resolver_,
    bool enable_,
    bool omni_,
    uint16[] memory lzChainIds //  ) external onlySelf {
  ) public {
    _register(tld, defaultPublicResolver, enable_, omni_, lzChainIds);
  }

  function _register(
    bytes memory tld,
    address resolver_,
    bool enable_,
    bool omni_,
    uint16[] memory lzChainIds
  ) internal {
    // _registry.setRecord(tld, address(this), resolver_, enable_, omni_, lzChainIds);
  }

  // TODO:
  function transfer(bytes memory tld) public onlyAdmin {}

  // TODO: Omni
  function reclaim(bytes memory tld) public onlyAdmin {
    _registry.setOwner(keccak256(bytes(tld)), address(this));
  }

  function setEnable(bytes memory tld, bool enable_) public payable onlyAdmin {
    _setEnable(tld, enable_);
    // if (_registry.isOmni(keccak256(tld))) {
    //   uint16[] memory lzChainIds_ = _registry.getLzChainIds(keccak256(tld));
    //   _sync(lzChainIds_, abi.encodeWithSignature("_setEnable(bytes,bool)", tld, enable_), msg.value);
    // }
  }

  function _setEnable(bytes memory tld, bool enable_) internal {
    _registry.setEnable(keccak256(tld), enable_);
  }

  function setResolver(bytes memory tld, address resolver_) public payable onlyAdmin {
    _setResolver(tld, resolver_);
    // if (_registry.isOmni(keccak256(tld))) {
    //   uint16[] memory lzChainIds_ = _registry.getLzChainIds(keccak256(tld));
    //   _sync(lzChainIds_, abi.encodeWithSignature("_setResolver(bytes,bool)", tld, resolver_), msg.value);
    // }
  }

  function _setResolver(bytes memory tld, address resolver_) internal {
    _registry.setResolver(keccak256(tld), resolver_);
  }

  function setControllerApproval(
    bytes memory tld,
    address controller,
    bool approved
  ) public onlyAdmin {
    // require(_registry.exists(keccak256(tld)), "TLD_NOT_EXISTS");
    // if (_registry.isOmni(keccak256(tld))) {
    //   _omniRegistrar.setControllerApproval(tld, controller, approved);
    // } else {
    //   _singletonRegistrar.setControllerApproval(tld, controller, approved);
    // }
  }

  function isEnable(bytes memory tld) public view returns (bool) {
    return _registry.isEnable(keccak256(tld));
  }

  function isOmni(bytes memory tld) public view returns (bool) {
    // return _registry.isOmni(keccak256(tld));
    return true;
  }

  function getResolver(bytes memory tld) public view returns (address) {
    return _registry.getResolver(keccak256(tld));
  }

  function supportsInterface(bytes4 interfaceID) public view override(AccessControlUpgradeable, Synchronizer) returns (bool) {
    return interfaceID == type(IRoot).interfaceId || super.supportsInterface(interfaceID);
  }
}
