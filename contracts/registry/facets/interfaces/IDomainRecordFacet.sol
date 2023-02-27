// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "../../../lib/DomainRecord.sol";
import "../../../lib/Chain.sol";

interface IDomainRecordFacet {
  /* ========== Event ==========*/
  event NewDomain(bytes name, bytes tld, address owner, uint64 expiry);

  event SetDomainResolver(bytes32 name, bytes32 tld, address newResolver);
  event SetDomainOperator(bytes32 name, bytes32 tld, address operator, bool approved);
  event SetDomainUser(bytes32 name, bytes32 tld, address newUser, uint64 expiry);
  event SetDomainOwner(bytes32 name, bytes32 tld, address owner);
  event SetDomainExpiry(bytes32 name, bytes32 tld, uint64 expiry);

  event DomainBridged(bytes32 name, bytes32 tld, Chain dstChain);

  event RemoveDomain(bytes32 name, bytes32 tld);

  /* ========== Mutative ==========*/
  function setRecord(
    bytes memory name,
    bytes memory tld,
    address owner,
    address resolver,
    uint64 expiry
  ) external;

  function setResolver(
    bytes32 name,
    bytes32 tld,
    address resolver
  ) external;

  function setOwner(
    bytes32 name,
    bytes32 tld,
    address newOwner
  ) external;

  function setOperator(
    bytes32 name,
    bytes32 tld,
    address operator,
    bool approved
  ) external;

  function setUser(
    bytes32 name,
    bytes32 tld,
    address user,
    uint64 expiry
  ) external;

  function setExpiry(
    bytes32 name,
    bytes32 tld,
    uint64 expiry
  ) external;

  function bridge(bytes32 name, bytes32 tld) external;

  /* ========== Query - Genereal ==========*/

  function getOwner(bytes32 name, bytes32 tld) external view returns (address);

  function getResolver(bytes32 name, bytes32 tld) external view returns (address);

  function getExpiry(bytes32 name, bytes32 tld) external view returns (uint64);

  function getUser(bytes32 name, bytes32 tld) external view returns (address);

  function getUserExpiry(bytes32 name, bytes32 tld) external view returns (uint64);

  /* ========== Query - Boolean ==========*/

  function isExists(bytes32 name, bytes32 tld) external view returns (bool);

  function isOperator(
    bytes32 name,
    bytes32 tld,
    address _operator
  ) external view returns (bool);

  function isLive(bytes32 name, bytes32 tld) external view returns (bool);

  function getTokenId(bytes memory name, bytes memory tld) external returns (uint256);
}
