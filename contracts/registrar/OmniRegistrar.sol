//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./BaseRegistrar.sol";
import "../utils/Synchronizer.sol";

contract OmniRegistrar is BaseRegistrar, Synchronizer {
  function initialize(
    IRegistry registry_,
    address _lzEndpoint,
    uint16 _lzChainId,
    uint16[] memory _lzChainIds
  ) public initializer {
    __BaseRegistrar_init(registry_);
    __Synchronizer_init(_lzChainId, _lzChainIds, _lzEndpoint);
  }

  function available(bytes memory tld) public view override returns (bool) {
    return super.available(tld) && _registry.omni(keccak256(tld));
  }

  function available(bytes memory domain, bytes memory tld) public view override returns (bool) {
    return super.available(domain, tld) && _registry.omni(keccak256(tld));
  }

  function register(
    bytes calldata domain,
    bytes calldata tld,
    address owner,
    uint256 durations
  ) external onlyController(keccak256(tld)) {
    _register(domain, tld, owner, durations);
    _sync(abi.encode("_register(bytes,bytes,address,uint256)", domain, tld, owner, durations));
  }

  function renew(
    bytes calldata domain,
    bytes calldata tld,
    uint256 durations
  ) external onlyController(keccak256(tld)) {
    _renew(domain, tld, durations);
    _sync(abi.encode("_renew(bytes,bytes,uint256)", domain, tld, durations));
  }

  function reclaim(
    bytes calldata domain,
    bytes calldata tld,
    address owner
  ) external onlyController(keccak256(tld)) {
    _reclaim(domain, tld, owner);
    _sync(abi.encode("_reclaim(bytes,bytes,address)", domain, tld, owner));
  }
}
