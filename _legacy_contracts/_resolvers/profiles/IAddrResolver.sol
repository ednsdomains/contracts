// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/**
 * Interface for the legacy (ETH-only) addr function.
 */
interface IAddrResolver {
  event AddrChanged(bytes32 indexed node, address a);

  /**
   * Returns the address associated with an EDNS node.
   * @param node The EDNS node to query.
   * @return The associated address.
   */
  function addr(bytes32 node) external view returns (address payable);
}
