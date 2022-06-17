// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol";
import "../utils/LabelValidator.sol";
import "../registry/IRegistry.sol";

abstract contract BaseResolver is ERC165Upgradeable, LabelValidator, ContextUpgradeable {
  bytes32 internal constant AT_SIGN = keccak256(bytes("@"));

  IRegistry internal _registry;

  modifier onlyAuthorised(
    string memory host,
    string memory domain,
    string memory tld
  ) {
    require(_isAuthorised(host, domain, tld), "FORBIDDEN");
    _;
  }

  modifier onlyLive(string memory domain, string memory tld) {
    require(_isLive(domain, tld), "DOMAIN_EXPIRED");
    _;
  }

  function _isAuthorised(
    string memory host,
    string memory domain,
    string memory tld
  ) internal view returns (bool) {
    bytes32 host_ = keccak256(bytes(host));
    bytes32 domain_ = keccak256(bytes(domain));
    bytes32 tld_ = keccak256(bytes(tld));
    return _registry.owner(domain_, tld_) == _msgSender() || _registry.operator(domain_, tld_, _msgSender()) || _registry.operator(host_, domain_, tld_, _msgSender());
  }

  function _isLive(string memory domain, string memory tld) internal view returns (bool) {
    bytes32 domain_ = keccak256(bytes(domain));
    bytes32 tld_ = keccak256(bytes(tld));
    return _registry.live(domain_, tld_);
  }

  function _setHostRecord(
    string memory host,
    string memory domain,
    string memory tld
  ) internal {
    bytes32 host_ = keccak256(bytes(host));
    bytes32 domain_ = keccak256(bytes(domain));
    bytes32 tld_ = keccak256(bytes(tld));
    if (!_registry.exists(host_, domain_, tld_)) _registry.setRecord(host, domain, tld);
  }
}
