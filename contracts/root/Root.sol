//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "./interfaces/IRoot.sol";
import "../registry/IRegistry.sol";
import "../registrar/interfaces/ISingletonRegistrar.sol";

contract Root is IRoot, AccessControlUpgradeable {
  IRegistry private _registry;
  ISingletonRegistrar private _singletonRegistrar;

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  modifier onlyAdmin() {
    require(hasRole(ADMIN_ROLE, _msgSender()), "FORBIDDEN");
    _;
  }

  function initialize(IRegistry registry_, ISingletonRegistrar singletonRegistrar_) public initializer {
    __Root_init(registry_, singletonRegistrar_);
  }

  function __Root_init(IRegistry registry_, ISingletonRegistrar singletonRegistrar_) internal onlyInitializing {
    __Root_init_unchained(registry_, singletonRegistrar_);
  }

  function __Root_init_unchained(IRegistry registry_, ISingletonRegistrar singletonRegistrar_) internal onlyInitializing {
    _registry = registry_;
    _singletonRegistrar = singletonRegistrar_;
    _setRoleAdmin(ADMIN_ROLE, DEFAULT_ADMIN_ROLE);
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(ADMIN_ROLE, _msgSender());
  }

  function register(
    string memory tld,
    address resolver_,
    bool enable_,
    bool omni_
  ) public onlyAdmin {
    if (omni_) {} else {
      _registry.setRecord(tld, address(this), resolver_, enable_, omni_);
    }
  }

  function transfer(string memory tld) public onlyAdmin {}

  function reclaim(string memory tld) public onlyAdmin {
    _registry.setOwner(keccak256(bytes(tld)), address(this));
  }

  function setEnable(string memory tld, bool enable_) public onlyAdmin {
    _registry.setEnable(keccak256(bytes(tld)), enable_);
  }

  function setResolver(string memory tld, address resolver_) public onlyAdmin {
    _registry.setResolver(keccak256(bytes(tld)), resolver_);
  }

  function setControllerApproval(
    string memory tld,
    address controller,
    bool approved
  ) public onlyAdmin {
    if (_singletonRegistrar.exists(keccak256(bytes(tld)))) {
      _singletonRegistrar.setControllerApproval(bytes(tld), controller, approved);
    } else {
      revert("TLD_NOT_EXISTS");
    }
  }

  function enable(string memory tld) public view returns (bool) {
    return _registry.enable(keccak256(bytes(tld)));
  }

  function omni(string memory tld) public view returns (bool) {
    return _registry.omni(keccak256(bytes(tld)));
  }

  function resolver(string memory tld) public view returns (address) {
    return _registry.resolver(keccak256(bytes(tld)));
  }
}
