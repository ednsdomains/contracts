// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@routerprotocol/router-crosstalk/contracts/RouterCrossTalkUpgradeable.sol";
import "./interfaces/IRouterProtocolV1Provider.sol";

// import "@routerprotocol/router-crosstalk/contracts/nonupgradeable/RouterCrossTalk.sol";

contract RouterProtocolV1Provider is IRouterProtocolV1Provider, RouterCrossTalkUpgradeable, AccessControlUpgradeable, UUPSUpgradeable {
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
  bytes32 public constant TERMINATOR_ROLE = keccak256("TERMINATOR_ROLE");

  function initialize(address _handler) public initializer {
    __RouterProtocolV1Provider_init(_handler);
  }

  function __RouterProtocolV1Provider_init(address _handler) internal onlyInitializing {
    __RouterProtocolV1Provider_init_unchained();
    __RouterCrossTalkUpgradeable_init_unchained(_handler);
  }

  function __RouterProtocolV1Provider_init_unchained() internal onlyInitializing {
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _grantRole(ADMIN_ROLE, _msgSender());
    _grantRole(OPERATOR_ROLE, _msgSender());
  }

  function supportsInterface(bytes4 interfaceID) public view override(AccessControlUpgradeable, ERC165Upgradeable, IERC165Upgradeable) returns (bool) {
    return interfaceID == type(IRouterProtocolV1Provider).interfaceId || super.supportsInterface(interfaceID);
  }

  /* ========== UUPS ==========*/
  function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}

  uint256[50] private __gap;
}
