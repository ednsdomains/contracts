//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./interfaces/IOmniRegistrar.sol";
import "../utils/Synchronizer.sol";

contract OmniRegistrarSynchronizer is Synchronizer {
  function initialize(
    address _lzEndpoint,
    uint16 _lzChainId,
    uint16[] memory _lzChainIds
  ) public initializer {
    __Synchronizer_init(_lzChainId, _lzChainIds, _lzEndpoint);
  }

  function setRegistrar(IOmniRegistrar registrar_) public onlyAdmin {
    _setTarget(address(registrar_));
  }
}
