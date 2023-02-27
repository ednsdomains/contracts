// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.13;

import "./WrapperRecord.sol";
import "./TldClass.sol";
import "./DomainRecord.sol";
import "./Chain.sol";

struct TldRecord {
  Chain[] chains;
  bytes name; // The name of the TLD - '.meta' or '.ass'
  address owner; // The owner of thr TLD, it should always be the `Root` contract address
  address resolver; // The contract address of the resolver, it used the `PublicResolver` as default
  bool enable; // Is this TLD enable to register new name
  uint64 expiry;
  WrapperRecord wrapper;
  TldClass class_;
  mapping(bytes32 => DomainRecord) domains;
}
