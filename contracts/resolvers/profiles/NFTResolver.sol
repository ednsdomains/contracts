// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "../ResolverBase.sol";
import "./INFTResolver.sol";

abstract contract NFTResolver is INFTResolver, ResolverBase {
    mapping(bytes32=>mapping(uint256=>NFT)) nfts;
    function setNFT(
        bytes32 node,
        uint256 chainId,
        address contractAddress,
        uint256 tokenId
    ) external virtual authorised(node) {
        nfts[node][chainId] = NFT({
            chainId: chainId,
            contractAddress: contractAddress,
            tokenId: tokenId
        });
        emit NFTChanged(node, chainId, contractAddress, tokenId);
    }

    function getNFT(bytes32 node,uint256 chainID) public view virtual returns (NFT memory) {
        return nfts[node][chainID];
    }

    function supportsInterface(bytes4 interfaceID)
        public
        pure
        virtual
        override
        returns (bool)
    {
        return
            interfaceID == type(INFTResolver).interfaceId ||
            super.supportsInterface(interfaceID);
    }
}
