// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.13;

import "./Kind.sol";

library TokenRecord {
  struct TokenRecord {
    Kind.Kind kind;
    bytes32 tld;
    bytes32 domain;
    bytes32 host;
  }
}
