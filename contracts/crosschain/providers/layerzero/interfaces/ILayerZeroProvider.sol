//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface ILayerZeroProvider {
  event Sent(address indexed sender, uint16 indexed dstChainId, bytes indexed payload, uint64 nonce);
  event Received(uint16 indexed srcChainId, bytes indexed srcAddress, bytes indexed payload, uint64 nonce);

  function estimateFees(
    uint16 _dstChainId,
    bytes memory _payload,
    bytes memory _adaptorParams
  ) external view returns (uint256);

  function send(
    address payable _from,
    uint16 _dstChainId,
    bytes memory _payload,
    bytes memory _adapterParams
  ) external payable;
}
