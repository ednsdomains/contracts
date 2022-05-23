// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IContentHashResolver {
  event SetContentHash(bytes32 indexed node, bytes hash);

  function contenthash(bytes32 node) external view returns (bytes memory);
}
