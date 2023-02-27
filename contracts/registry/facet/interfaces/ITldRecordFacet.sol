// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "../../../lib/TldClass.sol";
import "../../../lib/TokenRecord.sol";
import "../../../lib/TldRecord.sol";
import "../../../lib/DomainRecord.sol";
import "../../../lib/HostRecord.sol";
import "../../../lib/WrapperRecord.sol";

interface ITldRecordFacet {
  /* ========== Event ==========*/
  event NewTld(TldClass.TldClass class, bytes tld, address owner);
  event SetResolver(bytes32 tld, address resolver);
  event SetWrapper(bytes32 tld, address wrapper, bool enable);
  event SetOwner(bytes32 tld, address owner);
  event SetEnable(bytes32 tld, bool enable);
  event SetExpiry(bytes32 tld, uint64 expiry);

  /* ========== Mutative ==========*/
  function setRecord(
    Chain.Chain[] memory chains,
    bytes memory tld,
    address owner,
    address resolver,
    uint64 expiry,
    bool enable,
    TldClass.TldClass class_
  ) external;

  function setResolver(bytes32 tld, address resolver) external;

  function setOwner(bytes32 tld, address newOwner) external;

  function setEnable(bytes32 tld, bool enable) external;

  function setWrapper(
    bytes32 tld,
    bool enable_,
    address wrapper_
  ) external;

  function setExpiry(bytes32 tld, uint64 expiry) external;

  /* ========== Query - Genereal ==========*/
  function getOwner(bytes32 tld) external view returns (address);

  function getResolver(bytes32 tld) external view returns (address);

  function getExpiry(bytes32 tld) external view returns (uint64);

  function getTldClass(bytes32 tld) external view returns (TldClass.TldClass);

  function getTldChains(bytes32 tld) external view returns (Chain.Chain[] memory);

  function getWrapper(bytes32 tld) external view returns (WrapperRecord.WrapperRecord memory);

  /* ========== Query - Boolean ==========*/
  function isExists(bytes32 tld) external view returns (bool);

  function isEnable(bytes32 tld) external view returns (bool);

  /* ========== Utils ==========*/
  function getTokenId(bytes memory tld) external returns (uint256);
}
