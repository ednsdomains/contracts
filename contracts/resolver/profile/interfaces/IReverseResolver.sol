// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IReverseResolver {
  event SetReverseRecord(bytes host, bytes domain, bytes tld, bytes address_);

  function setReverseRecord(
    bytes memory host,
    bytes memory domain,
    bytes memory tld,
    bytes memory address_
  ) external;

  function setReverseRecord_SYNC(
    bytes memory host,
    bytes memory domain,
    bytes memory tld,
    bytes memory address_
  ) external;

  function reverse(bytes memory address_) external view returns (bytes memory);
}
