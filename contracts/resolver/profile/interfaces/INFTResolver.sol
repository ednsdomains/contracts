// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

interface INFTResolver {
  event SetNFT(bytes host, bytes name, bytes tld, uint256 chainId, address contractAddress, uint256 tokenId);

  struct NFT {
    address contract_;
    uint256 tokenId;
  }

  function setNFT(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    uint256 chainId,
    address contract_,
    uint256 tokenId
  ) external payable;

  function getNFT(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    uint256 chainId
  ) external view returns (NFT memory);
}
