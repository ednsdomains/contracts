// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "../../../lib/TokenRecord.sol";

interface IBaseRegistryFacet {
  event SetDefaultWrapper(address wrapper);
  event SetPublicResolver(address resolver);

  function getTokenRecord(uint256 tokenId) external view returns (TokenRecord memory);

  function getGracePeriod() external view returns (uint256);

  function getDefaultWrapper() external view returns (address);

  function getPublicResolver() external view returns (address);

  function setDefaultWrapper(address defaultWrapper) external;

  function setPublicResolver(address publicResolver) external;
}
