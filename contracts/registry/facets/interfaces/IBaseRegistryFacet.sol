// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "../../../lib/TokenRecord.sol";

interface IBaseRegistryFacet {
  event SetDefaultWrapper(address wrapper);

  function getTokenRecord(uint256 tokenId) external view returns (TokenRecord memory);

  function getGracePeriod() external view returns (uint256);

  function setDefaultWrapper(address defaultWrapper) external;
}
