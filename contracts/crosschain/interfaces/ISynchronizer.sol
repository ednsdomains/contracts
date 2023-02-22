// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "../../lib/Chain.sol";
import "../../lib/SyncAction.sol";
import "../../lib/CrossChainProvider.sol";

interface ISynchronizer {
  event SyncResolver(address indexed sender, CrossChainProvider.CrossChainProvider indexed provider, Chain.Chain[] indexed dstChains, bytes ctx);
  event SyncRegistrar(address indexed sender, CrossChainProvider.CrossChainProvider indexed provider, Chain.Chain[] indexed dstChains, bytes ctx);

  function estimateSyncFee(
    SyncAction.SyncAction action,
    CrossChainProvider.CrossChainProvider provider,
    Chain.Chain[] memory dstChains,
    bytes memory ews
  ) external view returns (uint256);

  function sync(
    SyncAction.SyncAction action,
    CrossChainProvider.CrossChainProvider provider,
    Chain.Chain[] memory dstChains,
    bytes memory ews
  ) external payable;

  function getRemoteSynchronizer(Chain.Chain chain) external view returns (address);

  function setRemoteSynchronizer(Chain.Chain chain, address target) external;

  function getUserDefaultProvider(address user) external view returns (CrossChainProvider.CrossChainProvider);

  function setUserDefaultProvider(address user, CrossChainProvider.CrossChainProvider provider) external;
}
