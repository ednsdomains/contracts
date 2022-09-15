// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface ITextResolver {
  event SetText(bytes32 indexed node, bytes text);

  function setText(
    string memory host,
    string memory name,
    string memory tld,
    bytes32 type_,
    bytes memory text
  ) external;

  function setText_SYNC(
    string memory host,
    string memory name,
    string memory tld,
    bytes32 type_,
    bytes memory text
  ) external;

  function getText(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    bytes32 type_
  ) external view returns (bytes memory);
}
