//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IReceiver {
  function receive_(bytes memory payload) external;
}
