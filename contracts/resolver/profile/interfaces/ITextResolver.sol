// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

interface ITextResolver {
  event SetText(bytes host, bytes name, bytes tld, string text);
  event UnsetText(bytes host, bytes name, bytes tld);

  function setText(bytes memory host, bytes memory name, bytes memory tld, string memory text) external payable;

  function unsetText(bytes memory host, bytes memory name, bytes memory tld) external payable;

  function getText(bytes memory host, bytes memory name, bytes memory tld) external view returns (string memory);
}
