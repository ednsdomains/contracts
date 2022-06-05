// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IPhoneNumberResolver {
  event SetPhoneNumber(bytes fqdn, bytes host, bytes domain, bytes tld, bytes payload, bytes signature);

  function setPhoneNumber(
    string memory host,
    string memory domain,
    string memory tld,
    bytes memory payload,
    bytes memory signature
  ) external;

  function phoneNumber(
    string memory host,
    string memory domain,
    string memory tld
  ) external view returns (bytes memory);

  function phoneNumber(string memory fqdn) external view returns (bytes memory);

  function phoneNumber(bytes32 fqdn) external view returns (bytes memory);
}
