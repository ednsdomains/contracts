//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./interfaces/IBaseRegistrarController.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "../utils/LabelOperator.sol";

abstract contract BaseRegistrarController is IBaseRegistrarController, AccessControlUpgradeable, LabelOperator {
  using ECDSAUpgradeable for bytes32;

  bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

  modifier onlyOperator() {
    require(hasRole(OPERATOR_ROLE, _msgSender()), "ONLY_OPERATOR");
    _;
  }

  function __BaseRegistrarController_init_unchained() internal onlyInitializing {
    _setRoleAdmin(OPERATOR_ROLE, DEFAULT_ADMIN_ROLE);
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(OPERATOR_ROLE, _msgSender());
  }

  function _verify(
    bytes32 payload,
    bytes calldata signature,
    address signer
  ) internal pure returns (bool) {
    return payload.toEthSignedMessageHash().recover(signature) == signer;
  }
}
