// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "./interfaces/IRegistrar.sol";
import "./interfaces/IUniversalRegistrarController.sol";
import "./BaseRegistrarController.sol";
import "../root/interfaces/IRoot.sol";

contract UniversalRegistrarController is IUniversalRegistrarController, BaseRegistrarController {
  using SafeERC20Upgradeable for IERC20Upgradeable;

  function initialize(
    IERC20Upgradeable token_,
    IRegistrar registrar_,
    IRoot root_,
    uint256 coinId
  ) public initializer {
    __BaseRegistrarController_init(token_, registrar_, root_, coinId);
    __UniversalRegistrarController_init();
  }

  function __UniversalRegistrarController_init() internal onlyInitializing {
    __UniversalRegistrarController_init_unchained();
  }

  function __UniversalRegistrarController_init_unchained() internal onlyInitializing {}

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
  ) public payable onlyRole(OPERATOR_ROLE) {
    _registrar.register(_msgSender(), name, tld, owner, expiry);
  }

  function register(
    bytes memory,
    bytes memory,
    address,
    uint64,
    uint256,
    bytes calldata
  ) public payable {
    revert("FORBIDDEN");
  }

  function renew(
    bytes memory name,
    bytes memory tld,
    uint64 expiry
  ) public payable onlyRole(OPERATOR_ROLE) {
    _registrar.renew(_msgSender(), name, tld, expiry);
  }

  function renew(
    bytes memory,
    bytes memory,
    uint64,
    uint256,
    bytes calldata
  ) public payable {
    revert("FORBIDDEN");
  }

  uint256[50] private __gap;
}
