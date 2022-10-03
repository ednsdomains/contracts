//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";

contract MigrationController is ContextUpgradeable {
  function migrate(
    address genesisContractAddress, // The `BaseRegistrarImplementation` contract address from Genesis
    uint256 genesisTokenId,
    string memory name,
    string memory tld
  ) public {
    require(IERC721(genesisContractAddress).ownerOf(genesisTokenId) == _msgSender());
  }
}
