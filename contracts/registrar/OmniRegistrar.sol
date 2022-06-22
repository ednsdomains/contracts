//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "./BaseRegistrar.sol";
import "./interfaces/IOmniRegistrarSynchronizer.sol";
import "hardhat/console.sol";

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

  function available(bytes calldata tld) public view override returns (bool) {
    return super.available(tld) && _registry.omni(keccak256(tld));
  }

  function available(bytes calldata domain, bytes calldata tld) public view override returns (bool) {
    return super.available(domain,tld) && _registry.omni(keccak256(tld));
  }

  modifier onlySynchronizer() {
    require(_msgSender() == address(_synchronizer), "ONLY_SYNCHRONIZER");
    _;
  }

  function register(
    bytes calldata domain,
    bytes calldata tld,
    address owner,
    uint256 durations
  ) external onlyController(keccak256(tld)) {
    require(available(domain,tld),"Domain/TLD not available");
    console.log(owner);
    _register(domain, tld, owner, durations);
    console.log("ABI at Register %s",string(abi.encodeWithSignature("register_SYNC(bytes,bytes,address,uint256)",domain,tld,owner,durations)));
    _synchronizer.sync(abi.encodeWithSignature("register_SYNC(bytes,bytes,address,uint256)",domain,tld,owner,durations));
  }

  function register_SYNC(
    bytes calldata domain,
    bytes calldata tld,
    address owner,
    uint256 durations
  ) external onlySynchronizer {
    _register(domain, tld, owner, durations);
  }

  function renew(
    bytes calldata domain,
    bytes calldata tld,
    uint256 durations
  ) external onlyController(keccak256(tld)) {
    _renew(domain, tld, durations);
    _synchronizer.sync(abi.encodeWithSignature("renew_SYNC(bytes, bytes, uint256)", domain, tld, durations));
  }

  function renew_SYNC(
    bytes calldata domain,
    bytes calldata tld,
    uint256 durations
  ) external onlySynchronizer {
    _renew(domain, tld,durations);
  }

  function reclaim(
    bytes calldata domain,
    bytes calldata tld,
    address owner
  ) external onlyController(keccak256(tld)) {
    _reclaim(domain, tld, owner);
    _synchronizer.sync(abi.encodeWithSignature("reclaim_SYNC(bytes, bytes, address)", domain, tld, owner));
  }

  function reclaim_SYNC(
    bytes calldata domain,
    bytes calldata tld,
    address owner
  ) external onlySynchronizer {
    _reclaim(domain, tld, owner);
  }
}
