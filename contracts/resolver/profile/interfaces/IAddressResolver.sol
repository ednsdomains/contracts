// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IAddressResolver {
  event SetAddress(bytes host, bytes name, bytes tld, address address_);
  event SetReverseAddress(bytes host, bytes name, bytes tld, address address_);

  function setAddress(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    address address_
  ) external;

  function setAddress_SYNC(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    address address_
  ) external;

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
  ) external;

  function setReverseAddress_SYNC(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    address address_
  ) external;

  function getReverseAddress(address address_) external returns (bytes memory);
}
