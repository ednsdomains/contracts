// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../BaseResolver.sol";
import "./interfaces/INFTResolver.sol";

contract NFTResolver is INFTResolver, BaseResolver {
  mapping(bytes32 => mapping(uint256 => NFT)) private _nfts;

  function setNFT(
    string memory host,
    string memory domain,
    string memory tld,
    uint256 chainId,
    address contractAddress,
    uint256 tokenId
  ) public onlyLive(domain, tld) onlyAuthorised(host, domain, tld) {
    _setHostRecord(host, domain, tld);
    if (keccak256(bytes(host)) == keccak256("@")) {
      bytes32 fqdn = keccak256(abi.encodePacked(domain, ".", tld));
      _nfts[fqdn][chainId] = NFT({ contractAddress: contractAddress, tokenId: tokenId });
      emit SetNFT(abi.encodePacked(domain, ".", tld), bytes(host), bytes(domain), bytes(tld), chainId, contractAddress, tokenId);
    } else {
      bytes32 fqdn = keccak256(abi.encodePacked(host, ".", domain, ".", tld));
      _nfts[fqdn][chainId] = NFT({ contractAddress: contractAddress, tokenId: tokenId });
      emit SetNFT(abi.encodePacked(host, ".", domain, ".", tld), bytes(host), bytes(domain), bytes(tld), chainId, contractAddress, tokenId);
    }
  }

  function nft(
    string memory host,
    string memory domain,
    string memory tld,
    uint256 chainId
  ) public view returns (NFT memory) {
    bytes32 fqdn = keccak256(abi.encodePacked(host, ".", domain, ".", tld));
    return _nfts[fqdn][chainId];
  }

  function nft(string memory fqdn, uint256 chainId) public view returns (NFT memory) {
    bytes32 fqdn_ = keccak256(bytes(fqdn));
    return _nfts[fqdn_][chainId];
  }

  function nft(bytes32 fqdn, uint256 chainId) public view returns (NFT memory) {
    return _nfts[fqdn][chainId];
  }

  function supportsInterface(bytes4 interfaceID) public view virtual override returns (bool) {
    return interfaceID == type(INFTResolver).interfaceId || super.supportsInterface(interfaceID);
  }
}
