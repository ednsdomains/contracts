// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IReverseResolver {
  event SetReverseRecord(bytes host, bytes domain, bytes tld, bytes address_);

  function setReverseRecord(
    bytes calldata host,
    bytes calldata domain,
    bytes calldata tld,
    bytes calldata address_
  ) external;

  function setReverseRecord_SYNC(
    bytes calldata host,
    bytes calldata domain,
    bytes calldata tld,
    bytes calldata address_
  ) external;

  function reverse(bytes calldata address_) external view returns (bytes memory);
}
