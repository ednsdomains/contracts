//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/utils/MulticallUpgradeable.sol";
import "../IRegistry.sol";
import "./BaseResolver.sol";

contract Resolver is MulticallUpgradeable {
  IRegistry public registry;

  function initialize(IRegistry registry_) public initializer {
    __Resolver_init(registry_);
  }

  function __Resolver_init(IRegistry registry_) internal onlyInitializing {
    __Resolver_init_unchained(registry_);
    __Multicall_init_unchained();
  }

  function __Resolver_init_unchained(IRegistry registry_) internal onlyInitializing {
    registry = registry_;
  }
}
