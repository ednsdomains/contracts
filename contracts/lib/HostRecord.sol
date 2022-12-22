// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.9;

import "./UserRecord.sol";

library HostRecord {
  struct HostRecord {
    bytes name;
    uint16 ttl;
    UserRecord.UserRecord user;
    mapping(address => bool) operators;
  }
}
