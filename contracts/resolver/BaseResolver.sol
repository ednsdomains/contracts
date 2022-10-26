// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol";
import "../utils/LabelOperator.sol";
import "../registry/interfaces/IRegistry.sol";
import "./interfaces/IPublicResolverSynchronizer.sol";
import "hardhat/console.sol";

abstract contract BaseResolver is ERC165Upgradeable, LabelOperator, ContextUpgradeable {
  bytes32 internal constant AT = keccak256(bytes("@"));

  IRegistry internal _registry;

  IPublicResolverSynchronizer internal _synchronizer;

  modifier onlyAuthorised(
    bytes memory host,
    bytes memory name,
    bytes memory tld
  ) {
    require(_isAuthorised(host, name, tld), "FORBIDDEN");
    _;
  }

  modifier onlyLive(bytes memory name, bytes memory tld) {
    require(_isLive(name, tld), "DOMAIN_EXPIRED");
    _;
  }

  modifier onlySynchronizer() {
    require(_msgSender() == address(_synchronizer), "ONLY_SYNCHRONIZER");
    _;
  }

  function __BaseResolver_init_unchained(IRegistry registry_, IPublicResolverSynchronizer synchronizer_) internal onlyInitializing {
    _synchronizer = synchronizer_;
    _registry = registry_;
  }

  function _isAuthorised(
    bytes memory host,
    bytes memory name,
    bytes memory tld
  ) internal view returns (bool) {
    bytes32 host_ = keccak256(host);
    bytes32 domain_ = keccak256(name);
    bytes32 tld_ = keccak256(tld);

    //Domain
    if (host_ == AT) {
//      console.log(_registry.userOf(uint256(keccak256(_join(name, tld)))));
      return
      //    _registry.getOwner(domain_, tld_) == _msgSender() ||
      _registry.userOf(uint256(keccak256(_join(name, tld)))) == _msgSender()||
      _registry.isOperator(domain_, tld_, _msgSender());
    }else{
      //Sub Domain

      return
      _registry.userOf(uint256(keccak256(_join(host, name, tld)))) == _msgSender()||
      _registry.isOperator(host_, domain_, tld_, _msgSender());
    }

  }

  function _isLive(bytes memory name, bytes memory tld) internal view returns (bool) {
    bytes32 domain_ = keccak256(name);
    bytes32 tld_ = keccak256(tld);
    return _registry.isLive(domain_, tld_);
  }

  function _setHostRecord(
    bytes memory host,
    bytes memory name,
    bytes memory tld
  ) internal {
    bytes32 host_ = keccak256(host);
    bytes32 domain_ = keccak256(name);
    bytes32 tld_ = keccak256(tld);
    console.log(string (host));
    if (!_registry.isExists(host_, domain_, tld_)) _registry.setRecord(host, name, tld);
  }
}
