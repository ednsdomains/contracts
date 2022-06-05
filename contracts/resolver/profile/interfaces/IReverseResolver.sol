// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IReverseResolver {
  event SetReverseRecord(bytes fqdn, bytes host, bytes domain, bytes tld);

  function setReverseRecord(
    string memory host,
    string memory domain,
    string memory tld,
    uint256 coin,
    string memory address_
  ) external;

  function reverse(
    string memory host,
    string memory domain,
    string memory tld,
    uint256 coin
  ) external view returns (bytes memory);

  function reverse(string memory fqdn, uint256 coin) external view returns (bytes memory);

  function reverse(bytes32 fqdn, uint256 coin) external view returns (bytes memory);
}
