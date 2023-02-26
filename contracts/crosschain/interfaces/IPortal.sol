// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "../../lib/CrossChainProvider.sol";
import "../../lib/Chain.sol";

interface IPortal {
  event PacketSent(address indexed sender, Chain.Chain dstChain, CrossChainProvider.CrossChainProvider provider);
  event PacketReceived(CrossChainProvider.CrossChainProvider provider);

  event ReceiverError(bytes32 id, address indexed receiver, string resaon);
  event ProviderError(CrossChainProvider.CrossChainProvider provider, string reason);

  // EVM compatible send
  function send_(
    address payable sender,
    Chain.Chain dstChain,
    CrossChainProvider.CrossChainProvider provider,
    bytes calldata payload
  ) external payable;

  function receive_(CrossChainProvider.CrossChainProvider provider, bytes calldata payload) external;

  function estimateFee(
    Chain.Chain dstChain,
    CrossChainProvider.CrossChainProvider provider,
    bytes calldata payload
  ) external view returns (uint256);

  function getProvider(CrossChainProvider.CrossChainProvider provider) external view returns (address);

  function setProvider(CrossChainProvider.CrossChainProvider, address address_) external;

  // function callback() external;
}
