// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "../../lib/Chain.sol";
import "../../lib/SyncAction.sol";
import "../../lib/CrossChainProvider.sol";

interface ISynchronizer {
  event ApplicationError(SyncAction action, string reason);

  event IncomingSync(SyncAction action, address target);
  event OutgoingSync(SyncAction action, CrossChainProvider provider, Chain[] dstChains);

  function estimateSyncFee(
    SyncAction action,
    CrossChainProvider provider,
    Chain[] memory dstChains,
    bytes memory ews
  ) external view returns (uint256);

  function sync(
    address payable sender,
    SyncAction action,
    CrossChainProvider provider,
    Chain[] memory dstChains,
    bytes memory ews
  ) external payable;

  function getRemoteSynchronizer(Chain chain) external view returns (address);

  function setRemoteSynchronizer(Chain chain, address target) external;

  function getUserDefaultProvider(address user) external view returns (CrossChainProvider);

  function setUserDefaultProvider(address user, CrossChainProvider provider) external;
}
