// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IAddressResolver {
  // event SetAddress(bytes fqdn, bytes domain, bytes tld, uint256 coin, bytes address_);
  event SetAddress(bytes fqdn, bytes host, bytes domain, bytes tld, uint256 coin, bytes address_);

  // function addr(
  //   string memory domain,
  //   string memory tld,
  //   uint256 coin
  // ) external view returns (bytes memory);

  function addr(
    string memory host,
    string memory domain,
    string memory tld,
    uint256 coin
  ) external view returns (bytes memory);

  function addr(string memory fqdn, uint256 coin) external view returns (bytes memory);

  function addr(bytes32 fqdn, uint256 coin) external view returns (bytes memory);
}
