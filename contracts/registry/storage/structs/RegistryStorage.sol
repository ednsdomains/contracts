// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../../lib/TldRecord.sol";
import "../../../lib/TokenRecord.sol";

struct RegistryStorage {
  address defaultWrapper;
  address publicResolver;
  mapping(bytes32 => TldRecord) records;
  mapping(uint256 => TokenRecord) tokenRecords;
  mapping(bytes32 => mapping(bytes32 => uint256)) unsyncHostUser;
}
