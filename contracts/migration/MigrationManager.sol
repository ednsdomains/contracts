// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "../registrar/interfaces/IRegistrar.sol";
import "./interfaces/ILegacyBaseRegistrar.sol";

contract MigrationManager is ContextUpgradeable, AccessControlUpgradeable, UUPSUpgradeable {
  IRegistrar _registrar;
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

  event Migrated(address owwner, string name, string tld, uint256 oldTokenId);

  function initialize(IRegistrar registrar_) public initializer {
    __MigrationManager_init(registrar_);
  }

  function __MigrationManager_init(IRegistrar registrar_) internal onlyInitializing {
    __MigrationManager_init_unchained(registrar_);
    __AccessControl_init();
  }

  function __MigrationManager_init_unchained(IRegistrar registrar_) internal onlyInitializing {
    _registrar = registrar_;
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _grantRole(ADMIN_ROLE, _msgSender());
    _grantRole(OPERATOR_ROLE, _msgSender());
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
    require(_legacy.nameExpires(tokenId) > block.timestamp, "DOMAIN_EXPIRED");
    require(_legacy.ownerOf(genesisTokenId) == _msgSender(), "ONLY_OWNER");
    try _registrar.register(_msgSender(), bytes(name), bytes(tld), _msgSender(), uint64(_legacy.nameExpires(tokenId))) {
      //
    } catch Error(string memory reason) {
      revert(reason);
    }
    try _legacy.deregister(tokenId) {
      //
    } catch Error(string memory reason) {
      revert(reason);
    }
    emit Migrated(_msgSender(), name, tld, genesisTokenId);
  }

  function managed_migrate(
    address genesisContractAddress, // The `BaseRegistrarImplementation` contract address from Genesis
    uint256 genesisTokenId,
    string memory name,
    string memory tld,
    address owner,
    uint64 expiry
  ) public onlyRole(OPERATOR_ROLE) {
    ILegacyBaseRegistrar _legacy = ILegacyBaseRegistrar(genesisContractAddress);
    bytes32 ZERO;
    uint256 tokenId = uint256(keccak256(abi.encodePacked(name, keccak256(abi.encodePacked(ZERO, keccak256(bytes(tld)))))));

    if (expiry == 0) {
      expiry = uint64(_legacy.nameExpires(tokenId));
    }

    require(tokenId == genesisTokenId, "TOKEN_ID_MISMATCH");
    try _registrar.register(_msgSender(), bytes(name), bytes(tld), owner, uint64(expiry)) {
      //
    } catch Error(string memory reason) {
      revert(reason);
    }
    if (_legacy.nameExpires(tokenId) > 0) {
      try _legacy.deregister(tokenId) {
        //
      } catch Error(string memory reason) {
        revert(reason);
      }
    }

    emit Migrated(_msgSender(), name, tld, genesisTokenId);
  }

  function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}

  function supportsInterface(bytes4 interfaceID) public view override(AccessControlUpgradeable) returns (bool) {
    return super.supportsInterface(interfaceID);
  }

  uint256[50] private __gap;
}
