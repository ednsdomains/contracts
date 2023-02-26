// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "../../lib/Chain.sol";
import "../../lib/SyncAction.sol";
import "../../lib/CrossChainProvider.sol";

interface ISynchronizer {
  event LowLevelError(bytes reason);
  event SynchronizerApplicationError(SyncAction.SyncAction action, string reason);
  event PortalError(SyncAction.SyncAction action, string reason);
  event PanicError(uint256 code);

  function estimateSyncFee(
    SyncAction.SyncAction action,
    CrossChainProvider.CrossChainProvider provider,
    Chain.Chain[] memory dstChains,
    bytes memory ews
  ) external view returns (uint256);

  function sync(
    address payable sender,
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
