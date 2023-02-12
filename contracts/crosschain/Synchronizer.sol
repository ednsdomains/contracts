// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "../registry/interfaces/IRegistry.sol";
import "../resolver/interfaces/IPublicResolver.sol";
import "../lib/SyncAction.sol";
import "./interfaces/ISynchronizer.sol";
import "./interfaces/IPortal.sol";
import "./interfaces/IReceiver.sol";

contract Synchronizer is ISynchronizer, IReceiver, UUPSUpgradeable, AccessControlUpgradeable, PausableUpgradeable {
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
  bytes32 public constant REQUESTOR_ROLE = keccak256("REQUESTOR_ROLE");

  Chain.Chain private _selfChain;

  IRegistry private _registry;
  IPortal private _portal;
  IPublicResolver private _resolver;

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
    _grantRole(OPERATOR_ROLE, _msgSender());
  }

  function pause() public onlyRole(OPERATOR_ROLE) {
    _pause();
  }

  function unpause() public onlyRole(OPERATOR_ROLE) {
    _unpause();
  }

  function _packPayload(address dstSynchronizer, bytes memory ctx) private pure returns (bytes memory) {
    return abi.encode(dstSynchronizer, ctx);
  }

  function _packContext(SyncAction.SyncAction action, bytes memory ews) private pure returns (bytes memory) {
    return abi.encode(action, ews);
  }

  function _unpackContext(bytes memory ctx) private pure returns (SyncAction.SyncAction action, bytes memory ews) {
    return abi.decode(ctx, (SyncAction.SyncAction, bytes));
  }

  function estimateSyncFee(
    SyncAction.SyncAction action,
    CrossChainProvider.CrossChainProvider provider,
    Chain.Chain[] memory dstChains,
    bytes memory ews
  ) public view returns (uint256) {
    uint256 fee = 0;
    for (uint256 i = 0; i < dstChains.length; i++) {
      Chain.Chain dstChain = dstChains[i];
      address dstSynchronizer = getRemoteSynchronizer(dstChain);
      bytes memory ctx = _packContext(action, ews);
      bytes memory payload = _packPayload(dstSynchronizer, ctx);
      fee += _portal.estimateFee(dstChain, provider, payload);
    }
    return fee;
  }

  function sync(
    SyncAction.SyncAction action,
    CrossChainProvider.CrossChainProvider provider,
    Chain.Chain[] memory dstChains,
    bytes memory ews
  ) external payable onlyRole(REQUESTOR_ROLE) {
    require(msg.value >= estimateSyncFee(action, provider, dstChains, ews), "INSUFFICIENT_FEE");
    _sync(action, provider, dstChains, ews);
  }

  function _sync(
    SyncAction.SyncAction action,
    CrossChainProvider.CrossChainProvider provider,
    Chain.Chain[] memory dstChains,
    bytes memory ews
  ) private {
    for (uint256 i = 0; i < dstChains.length; i++) {
      Chain.Chain dstChain = dstChains[i];
      address dstSynchronizer = getRemoteSynchronizer(dstChain);
      bytes memory ctx = _packContext(action, ews);
      bytes memory payload = _packPayload(dstSynchronizer, ctx);
      uint256 fee = _portal.estimateFee(dstChain, provider, payload);
      _portal.send_{ value: fee }(payable(_msgSender()), dstChain, provider, payload);
    }
  }

  function receive_(bytes memory ctx) external {
    // TODO:
    (SyncAction.SyncAction action, bytes memory ews) = _unpackContext(ctx);
    if (action == SyncAction.SyncAction.REGISTRY) {
      address(_registry).call(ews);
    } else if (action == SyncAction.SyncAction.RESOLVER) {
      address(_resolver).call(ews);
    }
  }

  function getRemoteSynchronizer(Chain.Chain chain) public view returns (address) {
    return _remoteSynchronizers[chain];
  }

  function setRemoteSynchronizer(Chain.Chain chain, address target) public {
    _remoteSynchronizers[chain] = target;
  }

  function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}

  uint256[50] private __gap;
}
