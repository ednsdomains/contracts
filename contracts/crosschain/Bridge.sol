//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../registry/interfaces/IRegistry.sol";
import "./interfaces/IBridge.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract Bridge is IBridge, PausableUpgradeable, AccessControlUpgradeable {
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  IRegistry private _registry;

  function initialize(IRegistry registry_) public initializer {
    __Bridge_init(registry_);
  }

  function __Bridge_init(IRegistry registry_) internal onlyInitializing {
    __Bridge_init_unchained(registry_);
  }

  function __Bridge_init_unchained(IRegistry registry_) internal onlyInitializing {
    _registry = registry_;
    _setRoleAdmin(ADMIN_ROLE, DEFAULT_ADMIN_ROLE);
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(ADMIN_ROLE, _msgSender());
  }

  function pause() public {
    require(hasRole(ADMIN_ROLE, _msgSender()), "ONLY_ADMIN");
    _pause();
  }

  function unpause() public {
    require(hasRole(ADMIN_ROLE, _msgSender()), "ONLY_ADMIN");
    _unpause();
  }

  function bridge(
    Chain.Chain chain,
    CrossChainProvider.CrossChainProvider provider,
    bytes32 name,
    bytes32 tld,
    address owner,
    uint256 expires
  ) public whenNotPaused {}
}
