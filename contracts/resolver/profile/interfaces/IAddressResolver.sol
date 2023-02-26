// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

interface IAddressResolver {
  event SetAddress(bytes host, bytes name, bytes tld, address address_);
  event SetReverseAddress(bytes host, bytes name, bytes tld, address address_);

  function setAddress(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    address address_
  ) external payable;

  function getAddress(
    bytes memory host,
    bytes memory name,
    bytes memory tld
  ) external returns (address);

  function setReverseAddress(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    address address_
  ) external payable;

  function getReverseAddress(address address_) external returns (string memory);
}
