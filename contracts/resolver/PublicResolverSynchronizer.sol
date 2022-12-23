// //SPDX-License-Identifier: MIT
// pragma solidity ^0.8.9;

// import "./interfaces/IPublicResolverSynchronizer.sol";
// import "./interfaces/IPublicResolver.sol";
// import "../utils/Synchronizer.sol";

// contract PublicResolverSynchronizer is IPublicResolverSynchronizer, Synchronizer {
//   function initialize(
//     address _lzEndpoint,
//     uint16 _lzChainId,
//     uint16[] memory _lzChainIds
//   ) public initializer {
//     //    __Synchronizer_init(_lzChainId, _lzChainIds, _lzEndpoint);
//     __Synchronizer_init(_lzChainId, _lzEndpoint);
//   }

//   function setResolver(IPublicResolver resolver_) public onlyRole(ADMIN_ROLE) {
//     _setTarget(address(resolver_));
//   }

//   function supportsInterface(bytes4 interfaceID) public view override returns (bool) {
//     return interfaceID == type(IPublicResolverSynchronizer).interfaceId || super.supportsInterface(interfaceID);
//   }
// }
