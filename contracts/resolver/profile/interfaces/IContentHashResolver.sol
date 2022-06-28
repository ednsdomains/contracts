// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IContentHashResolver {
  event SetContentHash(bytes32 indexed node, bytes hash);

  function setContenthash(
    string memory host,
    string memory domain,
    string memory tld,
    bytes32 type_,
    bytes memory hash
  ) external;

  function contenthash(
    string memory host,
    string memory domain,
    string memory tld,
    bytes32 type_
  ) external view returns (bytes memory);

  function contenthash(string memory fqdn, bytes32 type_) external view returns (bytes memory);

  function contenthash(bytes32 fqdn, bytes32 type_) external view returns (bytes memory);
}
