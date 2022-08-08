// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

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
    string memory domain,
    string memory tld,
    bytes memory hash
  ) external;

  function setContentHash_SYNC(
    string memory host,
    string memory domain,
    string memory tld,
    bytes memory hash
  ) external;

  function getContentHash(
    bytes memory host,
    bytes memory domain,
    bytes memory tld
  ) external view returns (bytes memory);

  function setTypedContentHash(
    string memory host,
    string memory domain,
    string memory tld,
    ContentHashProtocol type_,
    bytes memory hash
  ) external;

  function setTypedContentHash_SYNC(
    string memory host,
    string memory domain,
    string memory tld,
    ContentHashProtocol type_,
    bytes memory hash
  ) external;

  function getTypedContentHash(
    bytes memory host,
    bytes memory domain,
    bytes memory tld,
    ContentHashProtocol type_
  ) external view returns (bytes memory);
}
