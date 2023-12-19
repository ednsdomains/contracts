// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "../../lib/CrossChainProvider.sol";
import "../../lib/Chain.sol";

interface IPortal {
  event PacketSent(address indexed sender, Chain dstChain, CrossChainProvider provider);
  event PacketReceived(CrossChainProvider provider);

  event ReceiverError(bytes32 id, address indexed receiver, string resaon);
  event ProviderError(CrossChainProvider provider, string reason);

  // EVM compatible send
  function send_(
    address payable sender,
    Chain dstChain,
    CrossChainProvider provider,
    bytes calldata payload
  ) external payable;

  function receive_(CrossChainProvider provider, bytes calldata payload) external;

  function estimateFee(
    Chain dstChain,
    CrossChainProvider provider,
    bytes calldata payload
  ) external view returns (uint256);

  function getProvider(CrossChainProvider provider) external view returns (address);

  function setProvider(CrossChainProvider, address address_) external;

  // function callback() external;
}
