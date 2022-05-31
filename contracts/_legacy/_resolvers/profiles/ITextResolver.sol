// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface ITextResolver {
  event TextChanged(bytes32 indexed node, string indexed indexedKey, string key);

  /**
   * Returns the text data associated with an EDNS node and key.
   * @param node The EDNS node to query.
   * @param key The text data key to query.
   * @return The associated text data.
   */
  function text(bytes32 node, string calldata key) external view returns (string memory);
}
