// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "../../../lib/TldClass.sol";
import "../../../lib/TldRecord.sol";
import "../../../lib/WrapperRecord.sol";

interface ITldRecordFacet {
  /* ========== Event ==========*/
  event NewTld(TldClass class_, bytes tld, address owner);
  event SetTldResolver(bytes32 tld, address resolver);
  event SetTldOwner(bytes32 tld, address owner);
  event SetTldEnable(bytes32 tld, bool enable);
  event SetTldExpiry(bytes32 tld, uint64 expiry);
  event SetTldWrapper(bytes32 tld, address wrapper, bool enable);
  event RemoveTld(bytes32 tld);

  /* ========== Mutative ==========*/
  function setRecord(
    Chain[] memory chains,
    bytes memory tld,
    address owner,
    address resolver,
    uint64 expiry,
    bool enable,
    TldClass class_
  ) external;

  function setResolver(bytes32 tld, address resolver) external;

  function setOwner(bytes32 tld, address newOwner) external;

  function setEnable(bytes32 tld, bool enable) external;

  function setWrapper(
    bytes32 tld,
    bool enable_,
    address wrapper
  ) external;

  function setExpiry(bytes32 tld, uint64 expiry) external;

  /* ========== Query - Genereal ==========*/
  function getOwner(bytes32 tld) external view returns (address);

  function getResolver(bytes32 tld) external view returns (address);

  function getExpiry(bytes32 tld) external view returns (uint64);

  function getClass(bytes32 tld) external view returns (TldClass);

  function getChains(bytes32 tld) external view returns (Chain[] memory);

  function getWrapper(bytes32 tld) external view returns (WrapperRecord memory);

  /* ========== Query - Boolean ==========*/
  function isExists(bytes32 tld) external view returns (bool);

  function isEnable(bytes32 tld) external view returns (bool);

  /* ========== Utils ==========*/
  function getTokenId(bytes memory tld) external returns (uint256);
}
