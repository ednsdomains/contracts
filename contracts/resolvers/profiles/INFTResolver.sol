// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface INFTResolver {
    event NFTChanged(
        bytes32 indexed node,
        uint256 chainId,
        address contractAddress,
        uint256 tokenId
    );
    struct NFT {
        uint256 chainId;
        address contractAddress;
        uint256 tokenId;
    }

    function setNFT(
        bytes32 node,
        uint256 chainId,
        address contractAddress,
        uint256 tokenId
    ) external;

    function getNFT(bytes32 node,uint256 chainID) external returns (NFT memory);
}
