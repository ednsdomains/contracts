// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

interface IMortgage {
  event Deposit(bytes32 name, bytes32 tld, address owner, uint256 amount);
  event Withdraw(bytes32 name, bytes32 tld, address to, uint256 amount);

  function deposit(bytes32 name, bytes32 tld, address owner, address spender, uint256 amount) external;

  function withdraw(bytes32 name, bytes32 tld, address recipient, uint256 amount) external;

  function setRequirement(bytes32 name, bytes32 tld, uint256 amount) external;

  function getRequirement(bytes32 name, bytes32 tld) external view returns (uint256);

  function isFulfill(bytes32 name, bytes32 tld) external view returns (bool);

  function isExists(bytes32 name, bytes32 tld) external view returns (bool);
}
