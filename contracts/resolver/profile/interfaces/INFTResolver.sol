// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface INFTResolver {
  event SetNFT(bytes fqdn, bytes host, bytes domain, bytes tld, uint256 chainId, address contractAddress, uint256 tokenId);

  struct NFT {
    address contract_;
    uint256 tokenId;
  }

  function setNFT(
    bytes memory host,
    bytes memory domain,
    bytes memory tld,
    uint256 chainId,
    address contract_,
    uint256 tokenId
  ) external;

  function setNFT_SYNC(
    bytes memory host,
    bytes memory domain,
    bytes memory tld,
    uint256 chainId,
    address contract_,
    uint256 tokenId
  ) external;

  function nft(
    bytes memory host,
    bytes memory domain,
    bytes memory tld,
    uint256 chainId
  ) external view returns (NFT memory);

  function nft(bytes memory fqdn, uint256 chainId) external view returns (NFT memory);

  function nft(bytes32 fqdn, uint256 chainId) external view returns (NFT memory);
}
