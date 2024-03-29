// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.13;

import "./HostRecord.sol";
import "./UserRecord.sol";

struct DomainRecord {
  bytes name; // The name of the name name, if the FQDN is `edns.meta`, then this will be `bytes('edns')`
  address owner; // The owner of the name
  address resolver; //  The contract address of the resolver, it used the `PublicResolver` as default
  uint64 expiry; // The expiry unix timestamp of the name
  UserRecord user;
  mapping(address => mapping(address => bool)) operators;
  mapping(bytes32 => HostRecord) hosts;
}
