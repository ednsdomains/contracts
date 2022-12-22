//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./IERC4907.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/IERC721MetadataUpgradeable.sol";

interface IWrapper is IERC721Upgradeable, IERC721MetadataUpgradeable, IERC4907 {
  function mint(address to, uint256 tokenId_) external;

  function burn(uint256 tokenId_) external;

  function setName(string memory name) external;

  function setSymbol(string memory symbol) external;
}
