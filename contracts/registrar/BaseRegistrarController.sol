//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./interfaces/IBaseRegistrarController.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";

abstract contract BaseRegistrarController is IBaseRegistrarController {
  using ECDSAUpgradeable for bytes32;

  function _verify(
    bytes32 payload,
    bytes calldata signature,
    address signer
  ) internal pure returns (bool) {
    return payload.toEthSignedMessageHash().recover(signature) == signer;
  }
}
