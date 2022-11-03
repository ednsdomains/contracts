//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts-upgradeable/access/IAccessControlUpgradeable.sol";

interface IBaseRegistrarController is IAccessControlUpgradeable {
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

  function register(
    bytes memory name,
    bytes memory tld,
    address owner,
    uint64 expires,
    uint256 price,
    bytes calldata signature
  ) external;

  function renew(
    bytes memory name,
    bytes memory tld,
    uint64 expires,
    uint256 price,
    bytes calldata signature
  ) external;
}
