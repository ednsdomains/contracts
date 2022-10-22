// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface ITextResolver {
  event SetText(bytes host, bytes name, bytes tld, string text);

  function setText(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    //    bytes32 type_,
    string memory text
  ) external;

  function setText_SYNC(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    //    bytes32 type_,
    string memory text
  ) external;

  function getText(
    bytes memory host,
    bytes memory name,
    bytes memory tld
  )
    external
    view
    returns (
      //    bytes32 type_
      string memory
    );
}
