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

  function isAvailable(bytes memory tld) public view override returns (bool) {
    return super.isAvailable(tld) && _registry.isOmni(keccak256(tld));
  }

  function isAvailable(bytes memory name, bytes memory tld) public view override returns (bool) {
    return super.isAvailable(name, tld) && _registry.isOmni(keccak256(tld));
  }

  modifier onlySynchronizer() {
    require(_msgSender() == address(_synchronizer), "ONLY_SYNCHRONIZER");
    _;
  }

  function register(
    bytes memory name,
    bytes memory tld,
    address owner,
    uint256 durations
  ) external onlyController(keccak256(tld)) {
    require(isAvailable(name, tld), "NOT_AVAILABLE");
    _register(name, tld, owner, durations);
    uint16[] memory lzChainIds_ = _registry.getLzChainIds(keccak256(tld));
    _synchronizer.sync(lzChainIds_, abi.encodeWithSignature("register_SYNC(bytes,bytes,address,uint256)", name, tld, owner, durations));
  }

  function register_SYNC(
    bytes memory name,
    bytes memory tld,
    address owner,
    uint256 durations
  ) external onlySynchronizer {
    _register(name, tld, owner, durations);
  }

  function renew(
    bytes memory name,
    bytes memory tld,
    uint256 durations
  ) external onlyController(keccak256(tld)) {
    _renew(name, tld, durations);
    uint16[] memory lzChainIds_ = _registry.getLzChainIds(keccak256(tld));
    _synchronizer.sync(lzChainIds_, abi.encodeWithSignature("renew_SYNC(bytes, bytes, uint256)", name, tld, durations));
  }

  function renew_SYNC(
    bytes memory name,
    bytes memory tld,
    uint256 durations
  ) external onlySynchronizer {
    _renew(name, tld, durations);
  }

  function reclaim(
    bytes memory name,
    bytes memory tld,
    address owner
  ) external onlyController(keccak256(tld)) {
    _reclaim(name, tld, owner);
    uint16[] memory lzChainIds_ = _registry.getLzChainIds(keccak256(tld));
    _synchronizer.sync(lzChainIds_, abi.encodeWithSignature("reclaim_SYNC(bytes, bytes, address)", name, tld, owner));
  }

  function reclaim_SYNC(
    bytes memory name,
    bytes memory tld,
    address owner
  ) external onlySynchronizer {
    _reclaim(name, tld, owner);
  }
}
