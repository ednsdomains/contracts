// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface ITextResolver {
  event SetText(bytes host, bytes name, bytes tld, string text);

  function setText(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    string memory text
  ) external;

  function getText(
    bytes memory host,
    bytes memory name,
    bytes memory tld
  ) external view returns (string memory);
}
