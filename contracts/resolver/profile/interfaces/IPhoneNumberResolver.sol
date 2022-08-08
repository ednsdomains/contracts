// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IEncryptedPhoneNumberResolver {
  event SetEncryptedPhoneNumber(bytes host, bytes domain, bytes tld, bytes payload, bytes signature);

  function setEncryptedPhoneNumber(
    string memory host,
    string memory domain,
    string memory tld,
    bytes memory payload,
    bytes memory signature
  ) external;

  function setEncryptedPhoneNumber_SYNC(
    string memory host,
    string memory domain,
    string memory tld,
    bytes memory payload,
    bytes memory signature
  ) external;

  function getEncryptedPhoneNumber(
    string memory host,
    string memory domain,
    string memory tld
  ) external view returns (bytes memory);
}
