// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.13;

import "./RecordKind.sol";

struct TokenRecord {
  RecordKind kind;
  bytes32 tld;
  bytes32 domain;
  bytes32 host;
}
