// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "../../../lib/TldClass.sol";
import "../../../lib/TokenRecord.sol";
import "../../../lib/TldRecord.sol";
import "../../../lib/DomainRecord.sol";
import "../../../lib/HostRecord.sol";
import "../../../lib/WrapperRecord.sol";

interface IDomainRecordFacet {
  /* ========== Event ==========*/
  event NewDomain(bytes name, bytes tld, address owner, uint64 expiry);

  event SetResolver(bytes fqdn, address newResolver);
  event SetOperator(bytes fqdn, address operator, bool approved);
  event SetUser(bytes fqdn, address newUser, uint64 expiry);
  event SetOwner(bytes fqdn, address owner);
  event SetExpiry(bytes fqdn, uint64 expiry);
}
