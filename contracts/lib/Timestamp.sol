// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

library Timestamp {
  function isSecond(uint64 timestamp) internal pure returns (bool) {
    if (timestamp == 0) {
      return false;
    }
    uint8 length = 0;
    uint64 temp = timestamp;
    while (temp != 0) {
      temp /= 10;
      length++;
    }
    return length == 10;
  }

  function isMillisecond(uint64 timestamp) internal pure returns (bool) {
    if (timestamp == 0) {
      return false;
    }
    uint8 length = 0;
    uint64 temp = timestamp;
    while (temp != 0) {
      temp /= 10;
      length++;
    }
    return length == 13;
  }

  function toSecond(uint64 timestampInMs) internal pure returns (uint64) {
    require(isMillisecond(timestampInMs), "TIMESTAMP_NOT_IN_MILLIS");
    if (isSecond(timestampInMs)) return timestampInMs;
    return timestampInMs / 1000;
  }
}
