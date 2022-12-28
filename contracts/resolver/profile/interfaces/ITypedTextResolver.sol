// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface ITypedTextResolver {
  event SetTypedText(bytes host, bytes name, bytes tld, bytes type_, string text);

  function setTypedText(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    bytes memory type_,
    string memory text
  ) external;

  function getTypedText(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    bytes memory type_
  ) external view returns (string memory);
}
