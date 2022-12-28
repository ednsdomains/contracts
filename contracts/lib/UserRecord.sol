// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.13;

library UserRecord {
  struct UserRecord {
    address user;
    uint64 expires;
  }
}
