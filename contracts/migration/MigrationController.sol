// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "../registrar/interfaces/IRegistrar.sol";
import "./interfaces/ILegacyBaseRegistrar.sol";

contract MigrationController is ContextUpgradeable {
  IRegistrar _baseRegistrar;

  function initialize(IRegistrar registrar_) public initializer {
    __MigrationController_init(registrar_);
  }

  function __MigrationController_init(IRegistrar registrar_) internal onlyInitializing {
    __MigrationController_init_unchained(registrar_);
  }

  function __MigrationController_init_unchained(IRegistrar registrar_) internal onlyInitializing {
    _baseRegistrar = registrar_;
  }

  function migrate(
    address genesisContractAddress, // The `BaseRegistrarImplementation` contract address from Genesis
    uint256 genesisTokenId,
    string memory name,
    string memory tld
  ) public {
    ILegacyBaseRegistrar _legacy = ILegacyBaseRegistrar(genesisContractAddress);
    bytes32 ZERO;
    uint256 tokenId = uint256(keccak256(abi.encodePacked(name, keccak256(abi.encodePacked(ZERO, keccak256(bytes(tld)))))));
    require(tokenId == genesisTokenId, "TOKEN_ID_MISMATCH");
    require(_legacy.ownerOf(genesisTokenId) == _msgSender(), "ONLY_OWNER");
    _baseRegistrar.register(_msgSender(), bytes(name), bytes(tld), _msgSender(), uint64(_legacy.nameExpiry(tokenId)));
    _legacy.deregister(tokenId);
  }
}
