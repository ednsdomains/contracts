//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../../lib/CrossChainProvider.sol";

interface IPortal {
  event Sent(CrossChainProvider.CrossChainProvider to, bytes32 ref);
  event Received(CrossChainProvider.CrossChainProvider from, bytes32 ref);

  // EVM compatible send
  function send(
    CrossChainProvider.CrossChainProvider provider,
    uint16 chainId,
    address target,
    bytes calldata payload
  ) external payable;

  function receive_(CrossChainProvider.CrossChainProvider provider, bytes memory payload) external;

  function getProvider(CrossChainProvider.CrossChainProvider provider) external view returns (address);

  function setProvider(CrossChainProvider.CrossChainProvider, address address_) external;

  // function callback() external;
}
