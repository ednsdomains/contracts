//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./interfaces/IClassicalRegistrarController.sol";
import "./BaseRegistrarController.sol";

contract ClassicalRegistrarController is IClassicalRegistrarController, BaseRegistrarController {
  function initialize(
    IERC20 token_,
    IRegistrar registrar_,
    IRoot root_,
    uint256 coinId
  ) public initializer {
    __BaseRegistrarController_init(token_, registrar_, root_, coinId);
    __ClassicalRegistrarController_init();
  }

  function __ClassicalRegistrarController_init() internal onlyInitializing {
    __ClassicalRegistrarController_init_unchained();
  }

  function __ClassicalRegistrarController_init_unchained() internal onlyInitializing {}

  function isAvailable(bytes memory tld) public view returns (bool) {
    return _registrar.isAvailable(tld) && _registrar.isControllerApproved(keccak256(tld), address(this));
  }

  function isAvailable(bytes memory name, bytes memory tld) public view returns (bool) {
    return _registrar.isAvailable(name, tld);
  }

  function register(
    bytes memory name,
    bytes memory tld,
    address owner,
    uint64 expiry
  ) public onlyRole(OPERATOR_ROLE) {
    _registrar.register(name, tld, owner, expiry);
  }

  function register(
    bytes memory name,
    bytes memory tld,
    address owner,
    uint64 expiry,
    uint256 price,
    bytes calldata signature
  ) public {
    require(_verify(keccak256(abi.encodePacked(name, tld, expiry, price)), signature, _root.getAuthorizer()), "INVALID_SIGNATURE");
    require(_token.allowance(_msgSender(), address(this)) >= price, "INSUFFICIENT_BALANCE");
    _registrar.register(name, tld, owner, expiry);
    _token.transferFrom(_msgSender(), address(_root), price);
  }

  function renew(
    bytes memory name,
    bytes memory tld,
    uint64 expiry
  ) public onlyRole(OPERATOR_ROLE) {
    _registrar.renew(name, tld, expiry);
  }

  function renew(
    bytes memory name,
    bytes memory tld,
    uint64 expiry,
    uint256 price,
    bytes calldata signature
  ) public {
    require(_verify(keccak256(abi.encodePacked(name, tld, expiry, price)), signature, _root.getAuthorizer()), "INVALID_SIGNATURE");
    require(_token.allowance(_msgSender(), address(this)) >= price, "INSUFFICIENT_BALANCE");
    _registrar.renew(name, tld, expiry);
    _token.transferFrom(_msgSender(), address(_root), price);
  }

  uint256[50] private __gap;
}
