// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./interfaces/IMultichainAnyCallV6Provider.sol";

// https://docs.multichain.org/developer-guide/anycall-v6/context-verify-msg.sender
// https://docs.multichain.org/developer-guide/anycall-v6/fees-paid-on-source-chain
// https://docs.multichain.org/developer-guide/anycall-v6/how-to-integrate-anycall-v6#deploy-requirements

// contract MultichainV6Provider is IMultichainAnyCallV6Provider {
//   address private _endpoint;

//   function estimateFees(uint16 _dstChainId, bytes memory payload) public view returns (uint256) {
//     return 0;
//   }

//   function send_(
//     address payable _from,
//     uint16 _dstChainId,
//     bytes memory payload
//   ) external payable {}
// }
