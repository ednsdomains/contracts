//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface ISynchronizer {
  function sync(bytes calldata payload) external;

  function estimateSyncFee(bytes calldata payload) external returns (uint256);
}
