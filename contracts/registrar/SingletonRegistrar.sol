//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./BaseRegistrar.sol";

contract SingletonRegistrar is BaseRegistrar {
  function initialize(IRegistry registry_) public initializer {
    __BaseRegistrar_init(registry_);
    __ERC721_init("Omni Name Service", "OMNS");
    __AccessControl_init();
  }

  function available(bytes memory tld) public view override returns (bool) {
    return super.available(tld) && !_registry.isOmni(keccak256(tld));
  }

  function available(bytes memory domain, bytes memory tld) public view override returns (bool) {
    return super.available(domain, tld) && !_registry.isOmni(keccak256(tld));
  }

  function register(
    bytes memory domain,
    bytes memory tld,
    address owner,
    uint256 durations
  ) external onlyController(keccak256(tld)) {
    _register(domain, tld, owner, durations);
  }

  function renew(
    bytes memory domain,
    bytes memory tld,
    uint256 durations
  ) external onlyController(keccak256(tld)) {
    _renew(domain, tld, durations);
  }

  function reclaim(
    bytes memory domain,
    bytes memory tld,
    address owner
  ) external onlyController(keccak256(tld)) {
    _reclaim(domain, tld, owner);
  }
}
