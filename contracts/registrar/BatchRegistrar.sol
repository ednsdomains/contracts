//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "./interfaces/IBaseRegistrarController.sol";

contract BatchRegistrar {
  function register(
    IBaseRegistrarController controller,
    bytes[] memory names,
    bytes[] memory tlds,
    address owner,
    uint64[] memory expires
  ) public {
    require(names.length == tlds.length && tlds.length == expires.length, "INVALID_SIZE");
    for (uint256 i = 0; i < names.length; i++) {
      controller.register(names[i], tlds[i], owner, expires[i]);
    }
  }

  function register(
    IBaseRegistrarController controller,
    bytes[] memory names,
    bytes[] memory tlds,
    address owner,
    uint64[] memory expires,
    uint256[] memory prices,
    bytes[] memory signatures
  ) public {
    require(names.length == tlds.length && tlds.length == expires.length && expires.length == prices.length && prices.length == signatures.length, "INVALID_SIZE");
    for (uint256 i = 0; i < names.length; i++) {
      controller.register(names[i], tlds[i], owner, expires[i], prices[i], signatures[i]);
    }
  }

  function renew(
    IBaseRegistrarController controller,
    bytes[] memory names,
    bytes[] memory tlds,
    uint64[] memory expires
  ) public {
    require(names.length == tlds.length && tlds.length == expires.length, "INVALID_SIZE");
    for (uint256 i = 0; i < names.length; i++) {
      controller.renew(names[i], tlds[i], expires[i]);
    }
  }

  function renew(
    IBaseRegistrarController controller,
    bytes[] memory names,
    bytes[] memory tlds,
    uint64[] memory expires,
    uint256[] memory prices,
    bytes[] memory signatures
  ) public {
    require(names.length == tlds.length && tlds.length == expires.length && expires.length == prices.length && prices.length == signatures.length, "INVALID_SIZE");
    for (uint256 i = 0; i < names.length; i++) {
      controller.renew(names[i], tlds[i], expires[i], prices[i], signatures[i]);
    }
  }
}
