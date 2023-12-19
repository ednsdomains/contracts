// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "../structs/RegistryStorage.sol";

contract RegistryStorageFacet {
  function registryStorage() internal pure returns (RegistryStorage storage ds) {
    bytes32 position = keccak256("diamond.registry.diamond.storage");
    assembly {
      ds.slot := position
    }
  }
}
