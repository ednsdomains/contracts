//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IBaseRegistrarController {
  function available(string calldata domain, string calldata tld) external returns (bool);

  function available(string calldata tld) external returns (bool);

  function price(
    string calldata domain,
    string calldata tld,
    uint256 durations
  ) external returns (uint256);

  function commit(
    string calldata domain,
    string calldata tld,
    address owner,
    uint256 durations
  ) external;

  function makeCommitment(
    string calldata domain,
    string calldata tld,
    address owner,
    uint256 durations
  ) external view returns (bytes32);

  function register(
    string calldata domain,
    string calldata tld,
    address owner,
    uint256 durations,
    bytes32 commitment
  ) external;

  function renew(
    string calldata domain,
    string calldata tld,
    uint256 durations
  ) external;
}
