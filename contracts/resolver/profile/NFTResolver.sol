// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../BaseResolver.sol";
import "./interfaces/INFTResolver.sol";

abstract contract NFTResolver is INFTResolver, BaseResolver {
  mapping(bytes32 => mapping(uint256 => NFT)) private _nfts;

  function setNFT(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    uint256 chainId,
    address contract_,
    uint256 tokenId
  ) public onlyLive(name, tld) onlyAuthorised(host, name, tld) {
    _setNFT(host, name, tld, chainId, contract_, tokenId);
    if (_registry.isOmni(keccak256(tld))) {
      uint16[] memory lzChainIds = _registry.getLzChainIds(keccak256(tld));
      _synchronizer.sync(lzChainIds, abi.encodeWithSignature("setNFT_SYNC(bytes,bytes,bytes,uint256,address,uint256)", host, name, tld, chainId, contract_, tokenId));
    }
  }

  function setNFT_SYNC(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    uint256 chainId,
    address contract_,
    uint256 tokenId
  ) public onlySynchronizer {
    _setNFT(host, name, tld, chainId, contract_, tokenId);
  }

  function _setNFT(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    uint256 chainId,
    address contract_,
    uint256 tokenId
  ) internal {
    _setHostRecord(host, name, tld);
    bytes32 fqdn;
    if (keccak256(bytes(host)) == AT) {
      fqdn = keccak256(_join(name, tld));
    } else {
      require(_validHost(bytes(host)), "INVALID_HOST");
      fqdn = keccak256(_join(host, name, tld));
    }
    _nfts[fqdn][chainId] = NFT({ contract_: contract_, tokenId: tokenId });
    emit SetNFT(host, name, tld, chainId, contract_, tokenId);
  }

  function getNFT(bytes32 fqdn, uint256 chainId) public view returns (NFT memory) {
    return _nfts[fqdn][chainId];
  }

  function supportsInterface(bytes4 interfaceID) public view virtual override returns (bool) {
    return interfaceID == type(INFTResolver).interfaceId || super.supportsInterface(interfaceID);
  }
}
