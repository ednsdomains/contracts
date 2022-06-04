// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IContentHashResolver {
  event ContenthashChanged(bytes32 indexed node, bytes hash);

  /**
   * Returns the contenthash associated with an EDNS node.
   * @param node The EDNS node to query.
   * @return The associated contenthash.
   */
  function contenthash(bytes32 node) external view returns (bytes memory);
}
