//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IBaseRegistrar.sol";
import "./interfaces/IUniversalRegistrarController.sol";
import "./BaseRegistrarController.sol";
import "../root/interfaces/IRoot.sol";

contract UniversalRegistrarController is IUniversalRegistrarController, BaseRegistrarController {
  IERC20 private _token;
  IBaseRegistrar private _registrar;
  IRoot private _root;

  uint256 private COIN_ID;

  function initialize(
    IERC20 token_,
    IBaseRegistrar registrar_,
    IRoot root_,
    uint256 coinId
  ) public initializer {
    __UniversalRegistrarController_init(token_, registrar_, root_, coinId);
  }

  function __UniversalRegistrarController_init(
    IERC20 token_,
    IBaseRegistrar registrar_,
    IRoot root_,
    uint256 coinId
  ) internal onlyInitializing {
    __BaseRegistrarController_init_unchained();
    __UniversalRegistrarController_init_unchained(token_, registrar_, root_, coinId);
    __AccessControl_init();
  }

  function __UniversalRegistrarController_init_unchained(
    IERC20 token_,
    IBaseRegistrar registrar_,
    IRoot root_,
    uint256 coinId
  ) internal onlyInitializing {
    _token = token_;
    _registrar = registrar_;
    _root = root_;
    COIN_ID = coinId;
  }

  function isAvailable(bytes memory tld) public view returns (bool) {
    return _registrar.isAvailable(tld) && _registrar.isControllerApproved(keccak256(tld), address(this));
  }

  function isAvailable(bytes memory name, bytes memory tld) public view returns (bool) {
    // return valid(name, tld) && _registrar.isAvailable(name, tld);
    _registrar.isAvailable(name, tld);
  }

  function register(
    bytes memory name,
    bytes memory tld,
    address owner,
    uint64 expires
  ) public onlyOperator {
    _registrar.register(name, tld, owner, expires);
  }

  function register(
    bytes memory,
    bytes memory,
    address,
    uint64,
    uint256,
    bytes calldata
  ) public pure {
    revert("FORBIDDEN");
  }

  function renew(
    bytes memory name,
    bytes memory tld,
    uint64 expires
  ) public onlyOperator {
    _registrar.renew(name, tld, expires);
  }

  function renew(
    bytes memory,
    bytes memory,
    uint64,
    uint256,
    bytes calldata
  ) public pure {
    revert("FORBIDDEN");
  }
}
