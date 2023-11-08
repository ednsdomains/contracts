// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/utils/MulticallUpgradeable.sol";
import "../registry/interfaces/IRegistry.sol";
import "./BaseResolver.sol";
import "./interfaces/IPublicResolver.sol";
import "./profile/AddressResolver.sol";
import "./profile/MultiCoinAddressResolver.sol";
import "./profile/NFTResolver.sol";
import "./profile/TextResolver.sol";
import "./profile/TypedTextResolver.sol";

contract PublicResolver is IPublicResolver, AddressResolver, MultiCoinAddressResolver, NFTResolver, TextResolver, TypedTextResolver {
  function initialize(IRegistry registry_) public initializer {
    __PublicResolver_init(registry_);
  }

  function __PublicResolver_init(IRegistry registry_) internal onlyInitializing {
    __PublicResolver_init_unchained();
    __BaseResolver_init(registry_);
  }

  function __PublicResolver_init_unchained() internal onlyInitializing {}

  function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}

  function supportsInterface(bytes4 interfaceID) public view override(AddressResolver, MultiCoinAddressResolver, NFTResolver, TextResolver, TypedTextResolver) returns (bool) {
    return interfaceID == type(IPublicResolver).interfaceId || super.supportsInterface(interfaceID);
  }

  uint256[50] private __gap;
}
