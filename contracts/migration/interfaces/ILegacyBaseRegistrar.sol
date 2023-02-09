// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

interface ILegacyBaseRegistrar {
  function nameExpiry(uint256 id) external view returns (uint256);

  function deregister(uint256 id) external;

  function ownerOf(uint256 id) external view returns (address);
}
