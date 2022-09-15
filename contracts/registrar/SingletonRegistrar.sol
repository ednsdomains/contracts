//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./BaseRegistrar.sol";

contract SingletonRegistrar is BaseRegistrar {
  function initialize(IRegistry registry_) public initializer {
    __BaseRegistrar_init(registry_);
    __ERC721_init("Omni Name Service", "OMNS");
    __AccessControl_init();
  }

  function isAvailable(bytes memory tld) public view override returns (bool) {
    return super.isAvailable(tld) && !_registry.isOmni(keccak256(tld));
  }

  function isAvailable(bytes memory name, bytes memory tld) public view override returns (bool) {
    return super.isAvailable(name, tld) && !_registry.isOmni(keccak256(tld));
  }

  function register(
    bytes memory name,
    bytes memory tld,
    address owner,
    uint256 durations
  ) external onlyController(keccak256(tld)) {
    _register(name, tld, owner, durations);
  }

  function renew(
    bytes memory name,
    bytes memory tld,
    uint256 durations
  ) external onlyController(keccak256(tld)) {
    _renew(name, tld, durations);
  }

  function reclaim(
    bytes memory name,
    bytes memory tld,
    address owner
  ) external onlyController(keccak256(tld)) {
    _reclaim(name, tld, owner);
  }
}
