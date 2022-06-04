//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/utils/MulticallUpgradeable.sol";
import "../registry/IRegistry.sol";
import "./BaseResolver.sol";
import "./profile/AddressResolver.sol";
import "./profile/NFTResolver.sol";

contract PublicResolver is MulticallUpgradeable, AddressResolver, NFTResolver {
  function initialize(IRegistry registry_) public initializer {
    __PublicResolver_init(registry_);
  }

  function __PublicResolver_init(IRegistry registry_) internal onlyInitializing {
    __PublicResolver_init_unchained(registry_);
    __Multicall_init_unchained();
  }

  function __PublicResolver_init_unchained(IRegistry registry_) internal onlyInitializing {
    _registry = registry_;
  }

  function supportsInterface(bytes4 interfaceID) public view override(AddressResolver, NFTResolver) returns (bool) {
    return super.supportsInterface(interfaceID);
  }
}
