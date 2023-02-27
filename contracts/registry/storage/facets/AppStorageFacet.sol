// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { LibDiamond } from "../../../diamond/libraries/LibDiamond.sol";
import "../structs/AppStorage.sol";

contract AppStorageFacet {
  AppStorage internal s;

  function appStorage() internal pure returns (AppStorage storage ds) {
    assembly {
      ds.slot := 0
    }
  }
}
