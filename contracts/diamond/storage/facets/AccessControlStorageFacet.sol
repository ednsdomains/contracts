// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import { LibDiamond } from "../../libraries/LibDiamond.sol";
import "../structs/AccessControlStorage.sol";

contract AccessControlStorageFacet {
  function accessControlStorage() internal pure returns (AccessControlStorage storage ds) {
    bytes32 position = keccak256("diamond.access_control.diamond.storage");
    assembly {
      ds.slot := position
    }
  }
}
