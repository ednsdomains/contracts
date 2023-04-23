// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "../BaseResolver.sol";
import "./interfaces/INFTResolver.sol";

abstract contract NFTResolver is INFTResolver, BaseResolver {
  mapping(address => mapping(bytes32 => mapping(uint256 => NFT))) private _nfts;

  function setNFT(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    uint256 chainId,
    address contract_,
    uint256 tokenId
  ) public payable onlyLive(host, name, tld) onlyAuthorised(host, name, tld) {
    _setNFT(host, name, tld, chainId, contract_, tokenId);
    _afterExec(keccak256(tld), abi.encodeWithSignature("setNFT(bytes,bytes,bytes,uint256,address,uint256)", host, name, tld, chainId, contract_, tokenId));
  }

  function _setNFT(bytes memory host, bytes memory name, bytes memory tld, uint256 chainId, address contract_, uint256 tokenId) internal {
    bytes32 fqdn = _getFqdn(host, name, tld);
    _nfts[_getUser(host, name, tld)][fqdn][chainId] = NFT({ contract_: contract_, tokenId: tokenId });
    emit SetNFT(host, name, tld, chainId, contract_, tokenId);
  }

  function unsetNFT(bytes memory host, bytes memory name, bytes memory tld, uint256 chainId) public payable onlyLive(host, name, tld) onlyAuthorised(host, name, tld) {
    _unsetNFT(host, name, tld, chainId);
    _afterExec(keccak256(tld), abi.encodeWithSignature("unsetNFT(bytes,bytes,bytes,uint256)", host, name, tld, chainId));
  }

  function _unsetNFT(bytes memory host, bytes memory name, bytes memory tld, uint256 chainId) internal {
    bytes32 fqdn = _getFqdn(host, name, tld);
    delete _nfts[_getUser(host, name, tld)][fqdn][chainId];
    emit UnsetNFT(host, name, tld, chainId);
  }

  function getNFT(bytes memory host, bytes memory name, bytes memory tld, uint256 chainId) public view returns (NFT memory) {
    bytes32 fqdn = _getFqdn(host, name, tld);
    return _nfts[_getUser(host, name, tld)][fqdn][chainId];
  }

  function supportsInterface(bytes4 interfaceID) public view virtual override returns (bool) {
    return interfaceID == type(INFTResolver).interfaceId || super.supportsInterface(interfaceID);
  }

  uint256[50] private __gap;
}
