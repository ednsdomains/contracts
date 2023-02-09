// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

interface IMultichainAnyCallV6Provider {
  event Sent(address indexed sender, uint16 indexed dstChainId, bytes indexed payload);
  event Received(uint16 indexed srcChainId, bytes indexed srcAddress, bytes indexed payload);

  function estimateFees(uint16 _dstChainId, bytes memory _payload) external view returns (uint256);

  function send_(
    address payable from,
    uint16 _dstChainId,
    bytes memory payload
  ) external payable;
}
