// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "../utils/Helper.sol";
import "./interfaces/IBaseRegistrarController.sol";
import "./interfaces/IRegistrar.sol";
import "../root/interfaces/IRoot.sol";

abstract contract BaseRegistrarController is IBaseRegistrarController, AccessControlUpgradeable, UUPSUpgradeable, PausableUpgradeable, Helper {
  using ECDSAUpgradeable for bytes32;
  using SafeERC20Upgradeable for IERC20Upgradeable;

  IERC20Upgradeable internal _token;
  IRegistrar internal _registrar;
  IRoot internal _root;
  uint256 internal COIN_ID;

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

  function __BaseRegistrarController_init(IERC20Upgradeable token_, IRegistrar registrar_, IRoot root_, uint256 coinId) internal onlyInitializing {
    __Pausable_init();
    __BaseRegistrarController_init_unchained(token_, registrar_, root_, coinId);
  }

  function __BaseRegistrarController_init_unchained(IERC20Upgradeable token_, IRegistrar registrar_, IRoot root_, uint256 coinId) internal onlyInitializing {
    _token = token_;
    _registrar = registrar_;
    _root = root_;
    COIN_ID = coinId;
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _grantRole(ADMIN_ROLE, _msgSender());
    _grantRole(OPERATOR_ROLE, _msgSender());
  }

  function _verify(bytes32 payload, bytes calldata signature, address signer) internal pure returns (bool) {
    return payload.toEthSignedMessageHash().recover(signature) == signer;
  }

  function pause() public onlyRole(ADMIN_ROLE) {
    _pause();
  }

  function unpause() public onlyRole(ADMIN_ROLE) {
    _unpause();
  }

  function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}

  uint256[50] private __gap;
}
