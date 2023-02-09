// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "./interfaces/IBaseRegistrarController.sol";

contract BatchRegistrarController is ContextUpgradeable {
  function register(
    IBaseRegistrarController controller,
    bytes[] memory names,
    bytes[] memory tlds,
    address owner,
    uint64[] memory expiry
  ) public {
    require(names.length == tlds.length && tlds.length == expiry.length, "INVALID_SIZE");
    for (uint256 i = 0; i < names.length; i++) {
      controller.register(names[i], tlds[i], owner, expiry[i]);
    }
  }

  function register(
    IBaseRegistrarController controller,
    bytes[] memory names,
    bytes[] memory tlds,
    address[] memory owners,
    uint64[] memory expiry,
    uint256[] memory prices,
    bytes[] memory signatures
  ) public {
    require(
      names.length == tlds.length && tlds.length == owners.length && owners.length == expiry.length && expiry.length == prices.length && prices.length == signatures.length,
      "INVALID_SIZE"
    );
    for (uint256 i = 0; i < names.length; i++) {
      controller.register(names[i], tlds[i], owners[i], expiry[i], prices[i], signatures[i]);
    }
  }

  function renew(
    IBaseRegistrarController controller,
    bytes[] memory names,
    bytes[] memory tlds,
    uint64[] memory expiry
  ) public {
    require(names.length == tlds.length && tlds.length == expiry.length, "INVALID_SIZE");
    for (uint256 i = 0; i < names.length; i++) {
      controller.renew(names[i], tlds[i], expiry[i]);
    }
  }

  function renew(
    IBaseRegistrarController controller,
    bytes[] memory names,
    bytes[] memory tlds,
    uint64[] memory expiry,
    uint256[] memory prices,
    bytes[] memory signatures
  ) public {
    require(names.length == tlds.length && tlds.length == expiry.length && expiry.length == prices.length && prices.length == signatures.length, "INVALID_SIZE");
    for (uint256 i = 0; i < names.length; i++) {
      controller.renew(names[i], tlds[i], expiry[i], prices[i], signatures[i]);
    }
  }
}
