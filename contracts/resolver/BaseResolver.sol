// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "../utils/Helper.sol";
import "../registry/interfaces/IRegistry.sol";
import "./interfaces/IPublicResolverSynchronizer.sol";

abstract contract BaseResolver is Helper, ContextUpgradeable, AccessControlUpgradeable, UUPSUpgradeable {
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

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

  function __BaseResolver_init(IRegistry registry_) internal onlyInitializing {
    __AccessControl_init();
    __UUPSUpgradeable_init();
    __BaseResolver_init_unchained(registry_);
  }

  function __BaseResolver_init_unchained(IRegistry registry_) internal onlyInitializing {
    _registry = registry_;
    _setRoleAdmin(ADMIN_ROLE, DEFAULT_ADMIN_ROLE);
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _grantRole(ADMIN_ROLE, _msgSender());
  }

  function _isAuthorised(
    bytes memory host,
    bytes memory name,
    bytes memory tld
  ) internal view returns (bool) {
    bytes32 host_ = keccak256(host);
    bytes32 domain_ = keccak256(name);
    bytes32 tld_ = keccak256(tld);

    if (_registry.getUser(host_, domain_, tld_) == _registry.getOwner(domain_, tld_)) {
      return
        _msgSender() == _registry.getUser(host_, domain_, tld_) || _registry.isOperator(domain_, tld_, _msgSender()) || _registry.isOperator(host_, domain_, tld_, _msgSender());
    } else {
      return _msgSender() == _registry.getUser(host_, domain_, tld_) || _registry.isOperator(host_, domain_, tld_, _msgSender());
    }

    if (host_ == AT) {
      return _registry.getUser(domain_, tld_) == _msgSender() || _registry.isOperator(domain_, tld_, _msgSender());
    } else {
      if (!_registry.isExists(host_, domain_, tld_)) {
        return _registry.getUser(domain_, tld_) == _msgSender() || _registry.isOperator(domain_, tld_, _msgSender());
      } else {
        return _registry.getUser(host_, domain_, tld_) == _msgSender() || _registry.isOperator(host_, domain_, tld_, _msgSender());
      }
    }
  }

  function _isLive(bytes memory name, bytes memory tld) internal view returns (bool) {
    bytes32 domain_ = keccak256(name);
    bytes32 tld_ = keccak256(tld);
    return _registry.isLive(domain_, tld_);
  }
}
