//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/IERC721MetadataUpgradeable.sol";

interface IERC721Wrapper is IERC721Upgradeable, IERC721MetadataUpgradeable {
  function mint(address to, uint256 tokenId_) external;

  function burn(uint256 tokenId_) external;

  function setName(string memory name) external;

  function setSymbol(string memory symbol) external;
}
