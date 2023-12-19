// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;
import "@openzeppelin/contracts-upgradeable/access/IAccessControlUpgradeable.sol";

interface IBaseRegistrarController is IAccessControlUpgradeable {
  function register(
    bytes memory name,
    bytes memory tld,
    address owner,
    uint64 expiry
  ) external payable;

  function renew(
    bytes memory name,
    bytes memory tld,
    uint64 expiry
  ) external payable;

  function register(
    bytes memory name,
    bytes memory tld,
    address owner,
    uint64 expiry,
    uint256 price,
    bytes calldata signature
  ) external payable;

  function renew(
    bytes memory name,
    bytes memory tld,
    uint64 expiry,
    uint256 price,
    bytes calldata signature
  ) external payable;
}
