//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/utils/MulticallUpgradeable.sol";
import "../registry/interfaces/IRegistry.sol";
import "./BaseResolver.sol";
import "./interfaces/IPublicResolver.sol";
import "./profile/AddressResolver.sol";
import "./profile/MultiCoinAddressResolver.sol";
import "./profile/NFTResolver.sol";
import "./profile/TextResolver.sol";
import "./profile/TypedTextResolver.sol";

contract PublicResolver is IPublicResolver, MulticallUpgradeable, AddressResolver, MultiCoinAddressResolver, NFTResolver, TextResolver, TypedTextResolver {
  function initialize(IRegistry registry_) public initializer {
    __PublicResolver_init(registry_);
  }

  function __PublicResolver_init(IRegistry registry_) internal onlyInitializing {
    __PublicResolver_init_unchained(registry_);
    __Multicall_init_unchained();
  }

  function __PublicResolver_init_unchained(IRegistry registry_) internal onlyInitializing {
    __BaseResolver_init_unchained(registry_);
  }

  function supportsInterface(bytes4 interfaceID) public view override(AddressResolver, MultiCoinAddressResolver, NFTResolver, TextResolver, TypedTextResolver) returns (bool) {
    return interfaceID == type(IPublicResolver).interfaceId || super.supportsInterface(interfaceID);
  }
}
