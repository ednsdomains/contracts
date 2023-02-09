// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "../../lib/Chain.sol";
import "../../lib/SyncAction.sol";
import "../../lib/CrossChainProvider.sol";

interface ISynchronizer {
  event SyncedResolverRecord(address indexed sender, CrossChainProvider.CrossChainProvider indexed provider, Chain.Chain[] indexed dstChains, bytes ctx);
  event SyncedRegisterDomain(
    address indexed sender,
    CrossChainProvider.CrossChainProvider indexed provider,
    Chain.Chain[] indexed dstChains,
    bytes name,
    bytes tld,
    address owner,
    uint64 expiry
  );
  event SyncedRenewDomain(
    address indexed sender,
    CrossChainProvider.CrossChainProvider indexed provider,
    Chain.Chain[] indexed dstChains,
    bytes32 name,
    bytes32 tld,
    uint64 expiry
  );

  function estimateSyncResolverRecordFee(
    CrossChainProvider.CrossChainProvider provider,
    Chain.Chain[] memory dstChains,
    bytes memory payload
  ) external view returns (uint256);

  function estimateSyncRegisterDomainFee(
    CrossChainProvider.CrossChainProvider provider,
    Chain.Chain[] memory dstChains,
    bytes memory name,
    bytes memory tld,
    address owner,
    uint64 expiry
  ) external view returns (uint256);

  function estimateSyncRenewDomainFee(
    CrossChainProvider.CrossChainProvider provider,
    Chain.Chain[] memory dstChains,
    bytes32 name,
    bytes32 tld,
    uint64 expiry
  ) external view returns (uint256);

  function syncResolverRecord(
    CrossChainProvider.CrossChainProvider provider,
    Chain.Chain[] memory dstChains,
    bytes memory payload
  ) external payable;

  function syncRegisterDomain(
    CrossChainProvider.CrossChainProvider provider,
    Chain.Chain[] memory dstChains,
    bytes memory name,
    bytes memory tld,
    address owner,
    uint64 expiry
  ) external payable;

  function syncRenewDomain(
    CrossChainProvider.CrossChainProvider provider,
    Chain.Chain[] memory dstChains,
    bytes32 name,
    bytes32 tld,
    uint64 expiry
  ) external payable;

  function getRemoteSynchronizer(Chain.Chain chain) external view returns (address);

  function setRemoteSynchronizer(Chain.Chain chain, address target) external;
}
