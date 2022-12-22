// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol";
import "../utils/LabelOperator.sol";
import "../registry/interfaces/IRegistry.sol";
import "./interfaces/IPublicResolverSynchronizer.sol";

abstract contract BaseResolver is ERC165Upgradeable, LabelOperator, ContextUpgradeable {
  bytes32 internal constant AT = keccak256(bytes("@"));

  IRegistry internal _registry;

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

  function __BaseResolver_init_unchained(IRegistry registry_) internal onlyInitializing {
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
      return _registry.getUser(domain_, tld_) == _msgSender() || _registry.isOperator(domain_, tld_, _msgSender()) || _msgSender() == address(_registry);
    } else {
      return _registry.getUser(host_, domain_, tld_) == _msgSender() || _registry.isOperator(host_, domain_, tld_, _msgSender()) || _msgSender() == address(_registry);
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
    if (!_registry.isExists(host_, domain_, tld_)) {
      _registry.setRecord(host, name, tld, 3600); // Default 1 hour
    }
  }
}
