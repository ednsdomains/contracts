// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

interface ISynchronizer {
  function sync(uint16[] memory lzChainIds, bytes memory payload) external payable;

  function estimateSyncFee(uint16[] memory lzChainIds, bytes memory payload) external returns (uint256);
}
