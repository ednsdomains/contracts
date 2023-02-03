//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../../lib/CrossChainProvider.sol";

interface IPortal {
  event Sent(CrossChainProvider.CrossChainProvider provider, address indexed sender, uint16 dstChainId, bytes payload);
  event Received(CrossChainProvider.CrossChainProvider provider, bytes payload);

  // EVM compatible send
  function send(
    CrossChainProvider.CrossChainProvider provider,
    address payable sender,
    uint16 dstChainId,
    bytes calldata payload
  ) external payable;

  function receive_(CrossChainProvider.CrossChainProvider provider, bytes calldata payload) external;

  function getProvider(CrossChainProvider.CrossChainProvider provider) external view returns (address);

  function setProvider(CrossChainProvider.CrossChainProvider, address address_) external;

  // function callback() external;
}
