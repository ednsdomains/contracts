// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

interface IContentHashResolver {
  event SetContentHash(bytes32 indexed node, bytes hash);

  enum ContentHashProtocol {
    IPFS,
    BZZ,
    BTFS,
    ARWEAVE,
    DEDRIVE
  }

  function setContentHash(
    string memory host,
    string memory name,
    string memory tld,
    bytes memory hash
  ) external payable;

  function getContentHash(
    bytes memory host,
    bytes memory name,
    bytes memory tld
  ) external view returns (bytes memory);

  function setTypedContentHash(
    string memory host,
    string memory name,
    string memory tld,
    ContentHashProtocol type_,
    bytes memory hash
  ) external payable;

  function getTypedContentHash(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    ContentHashProtocol type_
  ) external view returns (bytes memory);
}
