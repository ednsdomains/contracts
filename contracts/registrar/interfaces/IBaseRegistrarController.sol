//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IBaseRegistrarController {
  function register(
    bytes memory name,
    bytes memory tld,
    address owner,
    uint64 expires
  ) external;

  function renew(
    bytes memory name,
    bytes memory tld,
    uint64 expires
  ) external;
}
