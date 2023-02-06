//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../../lib/CrossChainProvider.sol";
import "../../lib/Chain.sol";

interface IPortal {
  event Sent(address indexed sender, Chain.Chain dstChain, CrossChainProvider.CrossChainProvider provider, bytes payload);
  event Received(CrossChainProvider.CrossChainProvider provider, bytes payload);
  event ReceiverError(bytes32 id, address indexed receiver, bytes resaon);

  // EVM compatible send
  function send(
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
