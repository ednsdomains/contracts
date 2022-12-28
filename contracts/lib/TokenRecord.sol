// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.13;

import "./RecordType.sol";

library TokenRecord {
  struct TokenRecord {
    RecordType.RecordType type_;
    bytes32 tld;
    bytes32 domain;
    bytes32 host;
  }
}
