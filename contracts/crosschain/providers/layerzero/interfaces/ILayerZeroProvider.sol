// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "../../../../lib/Chain.sol";

interface ILayerZeroProvider {
  event MessageSent(address indexed sender, uint16 indexed dstChainId, bytes indexed payload, uint64 nonce);
  event MessageReceived(uint16 indexed srcChainId, bytes indexed srcAddress, bytes32 ref, bytes indexed payload, uint64 nonce);
  event MessageDelivered(bytes32 ref);
  event MessageDeliverFailed(bytes32 ref, string reason);
  event SetTrustedRemote(uint16 srcChainId, bytes srcAddress);

  function estimateFee(Chain _dstChain, bytes memory _payload) external view returns (uint256);

  function send_(address payable _from, Chain _dstChain, bytes memory _payload) external payable;

  function getChainId(Chain chain) external returns (uint16);

  function setChainId(Chain chain, uint16 chainId) external;

  function setTrustedRemote(uint16 _srcChainId, bytes calldata _srcAddress) external;

  function isTrustedRemote(uint16 _srcChainId, bytes calldata _srcAddress) external view returns (bool);

  function setV1AdaptorParameters(uint256 dstGasLimit) external;

  function lzReceive(uint16 _srcChainId, bytes calldata _srcAddress, uint64 _nonce, bytes calldata _payload) external;

  function receive_(bytes calldata _payload) external;

  function setEndpoint(address lzEndpoint_) external;

  function getEndpoint() external view returns (address);

  function forceResume(uint16 _srcChainId, bytes calldata _srcAddress) external;
}
