// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.13;

import "./UserRecord.sol";

struct HostRecord {
  bytes name;
  uint16 ttl;
  UserRecord user;
  mapping(address => mapping(address => bool)) operators;
}
