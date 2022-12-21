// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.9;

import "./WrapperRecord.sol";
import "./TldClass.sol";
import "./DomainRecord.sol";

library TldRecord {
  struct TldRecord {
    bytes name; // The name of the TLD - '.meta' or '.ass'
    address owner; // The owner of thr TLD, it should always be the `Root` contract address
    address resolver; // The contract address of the resolver, it used the `PublicResolver` as default
    bool enable; // Is this TLD enable to register new name
    WrapperRecord.WrapperRecord wrapper;
    TldClass.TldClass class_;
    mapping(bytes32 => DomainRecord.DomainRecord) domains;
  }
}
