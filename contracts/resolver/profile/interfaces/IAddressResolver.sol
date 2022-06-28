// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IAddressResolver {
  event SetAddress(bytes host, bytes domain, bytes tld, uint256 coin, bytes address_);

  function setAddr(
    bytes calldata host,
    bytes calldata domain,
    bytes calldata tld,
    uint256 coin,
    bytes calldata address_
  ) external;

  function setAddr_SYNC(
    bytes calldata host,
    bytes calldata domain,
    bytes calldata tld,
    uint256 coin,
    bytes calldata address_
  ) external;

  function addr(
    bytes calldata host,
    bytes calldata domain,
    bytes calldata tld,
    uint256 coin
  ) external view returns (bytes memory);

  function addr(bytes calldata fqdn, uint256 coin) external view returns (bytes memory);

  function addr(bytes32 fqdn, uint256 coin) external view returns (bytes memory);
}
