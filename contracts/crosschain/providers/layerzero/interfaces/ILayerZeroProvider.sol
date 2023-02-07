//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../../../../lib/Chain.sol";

interface ILayerZeroProvider {
  event Sent(address indexed sender, uint16 indexed dstChainId, bytes indexed payload, uint64 nonce);
  event MessageReceived(uint16 indexed srcChainId, bytes indexed srcAddress, bytes indexed payload, uint64 nonce);

  function estimateFee(Chain.Chain _dstChain, bytes memory _payload) external view returns (uint256);

  function send(
    address payable _from,
    Chain.Chain _dstChain,
    bytes memory _payload
  ) external payable;

  function getChainId(Chain.Chain chain) external returns (uint16);

  function setChainId(Chain.Chain chain, uint16 chainId) external;
}
