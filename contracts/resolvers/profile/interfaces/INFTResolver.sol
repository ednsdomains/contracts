// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface INFTResolver {
  event SetNFT(bytes fqdn, bytes host, bytes domain, bytes tld, uint256 chainId, address contractAddress, uint256 tokenId);

  function setNFT(
    string memory host,
    string memory domain,
    string memory tld,
    uint256 chainId,
    address contractAddress,
    uint256 tokenId
  ) external;

  function nft(
    string memory host,
    string memory domain,
    string memory tld,
    uint256 chainId
  ) external view returns (bytes memory);

  function nft(string memory fqdn, uint256 chainId,) external view returns (bytes memory);

  function nft(bytes32 fqdn, uint256 chainId,) external view returns (bytes memory);
}
