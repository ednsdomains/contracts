//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface ISynchronizer {
  function sync(uint16[] memory lzChainIds, bytes memory payload) external payable;

  function estimateSyncFee(uint16[] memory lzChainIds, bytes memory payload) external returns (uint256);
}
