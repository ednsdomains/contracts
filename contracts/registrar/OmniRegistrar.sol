//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "./BaseRegistrar.sol";
import "./interfaces/IOmniRegistrarSynchronizer.sol";

contract OmniRegistrar is BaseRegistrar {
  IOmniRegistrarSynchronizer private _synchronizer;

  function initialize(IRegistry registry_, IOmniRegistrarSynchronizer synchronizer_) public initializer {
    __BaseRegistrar_init(registry_);
    __OmniRegistrar_init(synchronizer_);
  }

  function __OmniRegistrar_init(IOmniRegistrarSynchronizer synchronizer_) internal onlyInitializing {
    __OmniRegistrar_init_unchained(synchronizer_);
  }

  function __OmniRegistrar_init_unchained(IOmniRegistrarSynchronizer synchronizer_) internal onlyInitializing {
    _synchronizer = synchronizer_;
  }

  function available(bytes memory tld) public view override returns (bool) {
    return super.available(tld) && _registry.omni(keccak256(tld));
  }

  function available(bytes memory domain, bytes memory tld) public view override returns (bool) {
    return super.available(domain, tld) && _registry.omni(keccak256(tld));
  }

  modifier onlySynchronizer() {
    require(_msgSender() == address(_synchronizer), "ONLY_SYNCHRONIZER");
    _;
  }

  function register(
    bytes memory domain,
    bytes memory tld,
    address owner,
    uint256 durations
  ) external onlyController(keccak256(tld)) {
    require(available(domain, tld), "NOT_AVAILABLE");
    _register(domain, tld, owner, durations);
    _synchronizer.sync(abi.encodeWithSignature("register_SYNC(bytes,bytes,address,uint256)", domain, tld, owner, durations));
  }

  function register_SYNC(
    bytes memory domain,
    bytes memory tld,
    address owner,
    uint256 durations
  ) external onlySynchronizer {
    _register(domain, tld, owner, durations);
  }

  function renew(
    bytes memory domain,
    bytes memory tld,
    uint256 durations
  ) external onlyController(keccak256(tld)) {
    _renew(domain, tld, durations);
    _synchronizer.sync(abi.encodeWithSignature("renew_SYNC(bytes, bytes, uint256)", domain, tld, durations));
  }

  function renew_SYNC(
    bytes memory domain,
    bytes memory tld,
    uint256 durations
  ) external onlySynchronizer {
    _renew(domain, tld, durations);
  }

  function reclaim(
    bytes memory domain,
    bytes memory tld,
    address owner
  ) external onlyController(keccak256(tld)) {
    _reclaim(domain, tld, owner);
    _synchronizer.sync(abi.encodeWithSignature("reclaim_SYNC(bytes, bytes, address)", domain, tld, owner));
  }

  function reclaim_SYNC(
    bytes memory domain,
    bytes memory tld,
    address owner
  ) external onlySynchronizer {
    _reclaim(domain, tld, owner);
  }
}
