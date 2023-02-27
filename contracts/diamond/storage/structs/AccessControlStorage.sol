// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

struct RoleData {
  mapping(address => bool) members;
  bytes32 adminRole;
}

struct AccessControlStorage {
  mapping(bytes32 => RoleData) roles;
}
