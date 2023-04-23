// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

interface IMultiCoinAddressResolver {
  event SetMultiCoinAddress(bytes host, bytes name, bytes tld, uint256 coin, bytes address_);
  event UnsetMultiCoinAddress(bytes host, bytes name, bytes tld, uint256 coin);

  function setMultiCoinAddress(bytes memory host, bytes memory name, bytes memory tld, uint256 coin, bytes memory address_) external payable;

  function unsetMultiCoinAddress(bytes memory host, bytes memory name, bytes memory tld, uint256 coin) external payable;

  function getMultiCoinAddress(bytes memory host, bytes memory name, bytes memory tld, uint256 coin) external view returns (bytes memory);
}
