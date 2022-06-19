// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface INFTResolver {
  event SetNFT(bytes fqdn, bytes host, bytes domain, bytes tld, uint256 chainId, address contractAddress, uint256 tokenId);

  struct NFT {
    address contract_;
    uint256 tokenId;
  }

  function setNFT(
    bytes calldata host,
    bytes calldata domain,
    bytes calldata tld,
    uint256 chainId,
    address contract_,
    uint256 tokenId
  ) external;

  function setNFT_SYNC(
    bytes calldata host,
    bytes calldata domain,
    bytes calldata tld,
    uint256 chainId,
    address contract_,
    uint256 tokenId
  ) external;

  function nft(
    bytes calldata host,
    bytes calldata domain,
    bytes calldata tld,
    uint256 chainId
  ) external view returns (NFT calldata);

  function nft(bytes calldata fqdn, uint256 chainId) external view returns (NFT memory);

  function nft(bytes32 fqdn, uint256 chainId) external view returns (NFT memory);
}
