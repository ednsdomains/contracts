//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "./IRoot.sol";
import "../registry/IRegistry.sol";
import "../registrar/ISingletonRegistrar.sol";

contract Root is IRoot, AccessControlUpgradeable {
  IRegistry private _registry;
  IRegistrar private _registrar;

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  modifier requireAdmin() {
    require(hasRole(ADMIN_ROLE, _msgSender()), "FORBIDDEN_ACCESS");
    _;
  }

  function initialize(IRegistry registry_, IRegistrar registrar_) public initializer {
    __Root_init(registry_, registrar_);
  }

  function __Root_init(IRegistry registry_, IRegistrar registrar_) internal onlyInitializing {
    __Root_init_unchained(registry_, registrar_);
  }

  function __Root_init_unchained(IRegistry registry_, IRegistrar registrar_) internal onlyInitializing {
    _registry = registry_;
    _registrar = registrar_;
    _setRoleAdmin(ADMIN_ROLE, DEFAULT_ADMIN_ROLE);
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(ADMIN_ROLE, _msgSender());
  }

  function _register(string memory tld, address resolver_) internal {
    _registry.setRecord(tld, address(this), resolver_, true);
  }

  function register(string memory tld, address resolver_) public requireAdmin {
    _register(tld, resolver_);
  }

  function _transfer(string memory tld) internal {}

  function transfer(string memory tld) public requireAdmin {}

  function _reclaim(string memory tld) internal {
    _registry.setOwner(keccak256(abi.encodePacked(tld)), address(this));
  }

  function reclaim(string memory tld) public requireAdmin {
    _reclaim(tld);
  }

  function _setEnable(string memory tld, bool enable) internal {
    _registry.setEnable(keccak256(abi.encodePacked(tld)), enable);
  }

  function setEnable(string memory tld, bool enable) public requireAdmin {
    _setEnable(tld, enable);
  }

  function _setResolver(string memory tld, address resolver_) internal {
    _registry.setResolver(keccak256(abi.encodePacked(tld)), resolver_);
  }

  function setResolver(string memory tld, address resolver_) public requireAdmin {
    _setResolver(tld, resolver_);
  }

  function _setControllerApproval(
    string memory tld,
    address controller,
    bool approved
  ) internal {
    _registrar.setControllerApproval(tld, controller, approved);
  }

  function setControllerApproval(
    string memory tld,
    address controller,
    bool approved
  ) public requireAdmin {
    _setControllerApproval(tld, controller, approved);
  }

  function enable(string memory tld) public view returns (bool) {
    return _registry.enable(keccak256(abi.encodePacked(tld)));
  }

  function resolver(string memory tld) public view returns (address) {
    return _registry.resolver(keccak256(abi.encodePacked(tld)));
  }
}
