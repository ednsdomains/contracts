//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IBaseRegistrarController {
  function available(string memory domain, string memory tld) external returns (bool);

  function available(string memory tld) external returns (bool);

  function price(
    string memory domain,
    string memory tld,
    uint256 durations
  ) external returns (uint256);

  function commit(
    string memory domain,
    string memory tld,
    address owner,
    uint256 durations
  ) external;

  function makeCommitment(
    string memory domain,
    string memory tld,
    address owner,
    uint256 durations
  ) external view returns (bytes32);

  function register(
    string memory domain,
    string memory tld,
    address owner,
    uint256 durations,
    bytes32 commitment
  ) external;

  function renew(
    string memory domain,
    string memory tld,
    uint256 durations
  ) external;
}
