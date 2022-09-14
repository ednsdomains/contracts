//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IBaseRegistrarController {
  function isAvailable(bytes memory name, bytes memory tld) external returns (bool);

  function isAvailable(bytes memory tld) external returns (bool);

  function commit(
    bytes memory name,
    bytes memory tld,
    address owner,
    uint256 durations
  ) external;

  function makeCommitment(
    bytes memory name,
    bytes memory tld,
    address owner,
    uint256 durations
  ) external view returns (bytes32);

  function register(
    bytes memory name,
    bytes memory tld,
    address owner,
    uint256 durations,
    bytes32 commitment
  ) external;

  function renew(
    bytes memory name,
    bytes memory tld,
    uint256 durations
  ) external;
}
