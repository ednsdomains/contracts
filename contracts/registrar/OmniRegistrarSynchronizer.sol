// //SPDX-License-Identifier: MIT
// pragma solidity ^0.8.9;

// import "./interfaces/IOmniRegistrar.sol";
// import "../utils/Synchronizer.sol";

// contract OmniRegistrarSynchronizer is Synchronizer {
//   function initialize(address _lzEndpoint, uint16 _lzChainId) public initializer {
//     __Synchronizer_init(_lzChainId, _lzEndpoint);
//   }

//   function setRegistrar(IOmniRegistrar registrar_) public onlyRole(ADMIN_ROLE) {
//     _setTarget(address(registrar_));
//   }
// }
