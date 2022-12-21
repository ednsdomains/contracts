// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.9;

import "./HostRecord.sol";
import "./UserRecord.sol";

library DomainRecord {
  struct DomainRecord {
    bytes name; // The name of the name name, if the FQDN is `edns.meta`, then this will be `bytes('edns')`
    address owner; // The owner of the name
    address resolver; //  The contract address of the resolver, it used the `PublicResolver` as default
    uint64 expires; // The expiry unix timestamp of the name
    UserRecord.UserRecord user;
    mapping(address => bool) operators;
    mapping(bytes32 => HostRecord.HostRecord) hosts;
  }
}
