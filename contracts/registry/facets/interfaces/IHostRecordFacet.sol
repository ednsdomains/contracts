// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "../../../lib/HostRecord.sol";
import "../../../lib/Chain.sol";

interface IHostRecordFacet {
  /* ========== Event ==========*/

  event NewHost(bytes host, bytes name, bytes tld, uint16 ttl);
  event SetHostOperator(bytes32 host, bytes32 name, bytes32 tld, address operator, bool approved);
  event SetHostUser(bytes32 host, bytes32 name, bytes32 tld, address newUser, uint64 expiry);
  event RemoveHost(bytes32 host, bytes32 name, bytes32 tld);

  /* ========== Mutative ==========*/
  function setRecord(bytes memory host, bytes memory name, bytes memory tld, uint16 ttl) external;

  function setOperator(bytes32 host, bytes32 name, bytes32 tld, address operator, bool approved) external;

  function setUser(bytes32 host, bytes32 name, bytes32 tld, address user, uint64 expiry) external;

  function unsetRecord(bytes32 host, bytes32 name, bytes32 tld) external;

  /* ========== Query - Genereal ==========*/

  function getUser(bytes32 host, bytes32 name, bytes32 tld) external view returns (address);

  function getUserExpiry(bytes32 host, bytes32 name, bytes32 tld) external view returns (uint64);

  function getTtl(bytes32 host, bytes32 name, bytes32 tld) external view returns (uint16);

  /* ========== Query - Boolean ==========*/
  function isExists(bytes32 host, bytes32 name, bytes32 tld) external view returns (bool);

  function isOperator(bytes32 host, bytes32 name, bytes32 tld, address _operator) external view returns (bool);

  /* ========== Utils ==========*/
  function getTokenId(bytes memory host, bytes memory name, bytes memory tld) external returns (uint256);
}
