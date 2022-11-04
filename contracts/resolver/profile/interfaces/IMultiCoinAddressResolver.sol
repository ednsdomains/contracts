// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IMultiCoinAddressResolver {
  event SetMultiCoinAddress(bytes host, bytes name, bytes tld, uint256 coin, bytes address_);

  function setMultiCoinAddress(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    uint256 coin,
    bytes memory address_
  ) external;

  // function setMultiCoinAddress_SYNC(
  //   bytes memory host,
  //   bytes memory name,
  //   bytes memory tld,
  //   uint256 coin,
  //   bytes memory address_
  // ) external;

  function getMultiCoinAddress(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    uint256 coin
  ) external view returns (bytes memory);
}
