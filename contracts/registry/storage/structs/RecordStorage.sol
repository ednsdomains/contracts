// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../../lib/TldRecord.sol";

struct RecordStorage {
  mapping(bytes32 => TldRecord.TldRecord) _records;
}
