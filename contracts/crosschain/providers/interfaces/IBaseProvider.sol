// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "../../../lib/Chain.sol";

interface IBaseProvider {
  event MessageSent(bytes indexed sender, bytes indexed receiver, bytes indexed dstChainId, bytes payload);
  event MessageReceived(bytes32 indexed ref, bytes indexed sender, bytes indexed srcChainId, bytes payload);

  function send_(address payable _sender, Chain _dstChain, bytes memory _payload) external payable;

  function receive_(bytes calldata _payload) external;
}
