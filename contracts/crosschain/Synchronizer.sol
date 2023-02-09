// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "../registry/interfaces/IRegistry.sol";

import "../lib/SyncAction.sol";
import "./interfaces/ISynchronizer.sol";
import "./interfaces/IPortal.sol";
import "./interfaces/IReceiver.sol";

contract Synchronizer is ISynchronizer, IReceiver, UUPSUpgradeable, AccessControlUpgradeable, PausableUpgradeable {
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");
  bytes32 public constant PUBLIC_RESOLVER_ROLE = keccak256("PUBLIC_RESOLVER_ROLE");

  Chain.Chain private _selfChain;

  IRegistry private _registry;
  IPortal private _portal;

  mapping(Chain.Chain => address) private _remoteSynchronizers;

  function initialize(
    Chain.Chain selfChain,
    IRegistry registry_,
    IPortal portal_
  ) public initializer {
    __Synchronizer_init(selfChain, registry_, portal_);
  }

  function __Synchronizer_init(
    Chain.Chain selfChain,
    IRegistry registry_,
    IPortal portal_
  ) internal onlyInitializing {
    __Synchronizer_init_unchained(selfChain, registry_, portal_);
  }

  function __Synchronizer_init_unchained(
    Chain.Chain selfChain,
    IRegistry registry_,
    IPortal portal_
  ) internal onlyInitializing {
    _registry = registry_;
    _portal = portal_;
    _selfChain = selfChain;
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _grantRole(ADMIN_ROLE, _msgSender());
  }

  function pause() public onlyRole(ADMIN_ROLE) {
    _pause();
  }

  function unpause() public onlyRole(ADMIN_ROLE) {
    _unpause();
  }

  function _packPayload(
    address dstSynchronizer,
    SyncAction.SyncAction action,
    bytes memory ctx
  ) private pure returns (bytes memory) {
    return abi.encode(dstSynchronizer, action, ctx);
  }

  function _unpackPayload(bytes memory payload) private pure returns (SyncAction.SyncAction action, bytes memory ctx) {
    return abi.decode(payload, (SyncAction.SyncAction, bytes));
  }

  function _packSyncRegisterDomainContext(
    bytes memory name,
    bytes memory tld,
    address owner,
    uint64 expiry
  ) private pure returns (bytes memory) {
    return abi.encode(name, tld, owner, expiry);
  }

  function _unpackSyncRegisterDomainContext(bytes memory ctx)
    private
    pure
    returns (
      bytes memory name,
      bytes memory tld,
      address owner,
      uint64 expiry
    )
  {
    return abi.decode(ctx, (bytes, bytes, address, uint64));
  }

  function _packSyncRenewDomainContext(
    bytes32 name,
    bytes32 tld,
    uint64 expiry
  ) private pure returns (bytes memory) {
    return abi.encode(name, tld, expiry);
  }

  function _unpackSyncRenewDomainContext(bytes memory ctx)
    private
    pure
    returns (
      bytes32 name,
      bytes32 tld,
      uint64 expiry
    )
  {
    return abi.decode(ctx, (bytes32, bytes32, uint64));
  }

  function estimateSyncResolverRecordFee(
    CrossChainProvider.CrossChainProvider provider,
    Chain.Chain[] memory dstChains,
    bytes memory ctx
  ) public view returns (uint256) {
    uint256 fee = 0;
    for (uint256 i = 0; i < dstChains.length; i++) {
      Chain.Chain dstChain = dstChains[i];
      address dstSynchronizer = getRemoteSynchronizer(dstChain);
      bytes memory payload = _packPayload(dstSynchronizer, SyncAction.SyncAction.RESOLVER_RECORD, ctx);
      fee += _portal.estimateFee(dstChain, provider, payload);
    }
    return fee;
  }

  function estimateSyncRegisterDomainFee(
    CrossChainProvider.CrossChainProvider provider,
    Chain.Chain[] memory dstChains,
    bytes memory name,
    bytes memory tld,
    address owner,
    uint64 expiry
  ) public view returns (uint256) {
    uint256 fee = 0;
    bytes memory ctx = _packSyncRegisterDomainContext(name, tld, owner, expiry);
    for (uint256 i = 0; i < dstChains.length; i++) {
      Chain.Chain dstChain = dstChains[i];
      address dstSynchronizer = getRemoteSynchronizer(dstChain);
      bytes memory payload = _packPayload(dstSynchronizer, SyncAction.SyncAction.REGISTER_DOMAIN, ctx);
      fee += _portal.estimateFee(dstChain, provider, payload);
    }
    return fee;
  }

  function estimateSyncRenewDomainFee(
    CrossChainProvider.CrossChainProvider provider,
    Chain.Chain[] memory dstChains,
    bytes32 name,
    bytes32 tld,
    uint64 expiry
  ) public view returns (uint256) {
    uint256 fee = 0;
    bytes memory ctx = _packSyncRenewDomainContext(name, tld, expiry);
    for (uint256 i = 0; i < dstChains.length; i++) {
      Chain.Chain dstChain = dstChains[i];
      address dstSynchronizer = getRemoteSynchronizer(dstChain);
      bytes memory payload = _packPayload(dstSynchronizer, SyncAction.SyncAction.RENEW_DOMAIN, ctx);
      fee += _portal.estimateFee(dstChain, provider, payload);
    }
    return fee;
  }

  function _sync(
    CrossChainProvider.CrossChainProvider provider,
    Chain.Chain dstChain,
    bytes memory ctx
  ) private {
    address dstSynchronizer = getRemoteSynchronizer(dstChain);
    bytes memory payload = abi.encode(dstSynchronizer, ctx);
    uint256 fee = _portal.estimateFee(dstChain, provider, payload);
    _portal.send_{ value: fee }(payable(_msgSender()), dstChain, provider, payload);
  }

  function syncResolverRecord(
    CrossChainProvider.CrossChainProvider provider,
    Chain.Chain[] memory dstChains,
    bytes memory ctx
  ) external payable onlyRole(PUBLIC_RESOLVER_ROLE) {
    require(msg.value >= estimateSyncResolverRecordFee(provider, dstChains, ctx), "INSUFFICIENT_FUND");
    for (uint256 i = 0; i < dstChains.length; i++) {
      _sync(provider, dstChains[i], ctx);
    }
    emit SyncedResolverRecord(_msgSender(), provider, dstChains, ctx);
  }

  function syncRegisterDomain(
    CrossChainProvider.CrossChainProvider provider,
    Chain.Chain[] memory dstChains,
    bytes memory name,
    bytes memory tld,
    address owner,
    uint64 expiry
  ) external payable onlyRole(REGISTRAR_ROLE) {
    bytes memory ctx = _packSyncRegisterDomainContext(name, tld, owner, expiry);
    require(msg.value >= estimateSyncRegisterDomainFee(provider, dstChains, name, tld, owner, expiry), "INSUFFICIENT_FUND");
    for (uint256 i = 0; i < dstChains.length; i++) {
      _sync(provider, dstChains[i], ctx);
    }
    emit SyncedRegisterDomain(_msgSender(), provider, dstChains, name, tld, owner, expiry);
  }

  function syncRenewDomain(
    CrossChainProvider.CrossChainProvider provider,
    Chain.Chain[] memory dstChains,
    bytes32 name,
    bytes32 tld,
    uint64 expiry
  ) external payable onlyRole(REGISTRAR_ROLE) {
    bytes memory ctx = _packSyncRenewDomainContext(name, tld, expiry);
    require(msg.value >= estimateSyncRenewDomainFee(provider, dstChains, name, tld, expiry), "INSUFFICIENT_FUND");
    for (uint256 i = 0; i < dstChains.length; i++) {
      _sync(provider, dstChains[i], ctx);
    }
    emit SyncedRenewDomain(_msgSender(), provider, dstChains, name, tld, expiry);
  }

  function receive_(bytes memory payload) external {}

  function getRemoteSynchronizer(Chain.Chain chain) public view returns (address) {
    return _remoteSynchronizers[chain];
  }

  function setRemoteSynchronizer(Chain.Chain chain, address target) public {
    _remoteSynchronizers[chain] = target;
  }

  function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}

  uint256[50] private __gap;
}
