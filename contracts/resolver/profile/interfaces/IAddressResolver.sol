// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IAddressResolver {
  event SetAddress(bytes host, bytes domain, bytes tld, uint256 coin, bytes address_);

  function setAddr(
    bytes memory host,
    bytes memory domain,
    bytes memory tld,
    uint256 coin,
    bytes memory address_
  ) external;

  function setAddr_SYNC(
    bytes memory host,
    bytes memory domain,
    bytes memory tld,
    uint256 coin,
    bytes memory address_
  ) external;

  function addr(
    bytes memory host,
    bytes memory domain,
    bytes memory tld,
    uint256 coin
  ) external view returns (bytes memory);

  function addr(bytes memory fqdn, uint256 coin) external view returns (bytes memory);

  function addr(bytes32 fqdn, uint256 coin) external view returns (bytes memory);
}
