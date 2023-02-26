// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "../registrar/interfaces/IRegistrar.sol";
import "../resolver/interfaces/IPublicResolver.sol";
import "../lib/SyncAction.sol";
import "./interfaces/ISynchronizer.sol";
import "./interfaces/IPortal.sol";
import "./interfaces/IReceiver.sol";
import "./interfaces/ISynchronizerApplication.sol";

contract Synchronizer is ISynchronizer, IReceiver, UUPSUpgradeable, AccessControlUpgradeable, PausableUpgradeable {
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
  bytes32 public constant REQUESTOR_ROLE = keccak256("REQUESTOR_ROLE");

  Chain.Chain private _selfChain;

  IRegistrar private _registrar;
  IPortal private _portal;
  IPublicResolver private _resolver;

  mapping(Chain.Chain => address) private _remoteSynchronizers;
  mapping(address => CrossChainProvider.CrossChainProvider) private _userDefaultProviders;

  function initialize(
    Chain.Chain selfChain,
    IRegistrar registrar_,
    IPortal portal_
  ) public initializer {
    __Synchronizer_init(selfChain, registrar_, portal_);
  }

  function __Synchronizer_init(
    Chain.Chain selfChain,
    IRegistrar registrar_,
    IPortal portal_
  ) internal onlyInitializing {
    __Synchronizer_init_unchained(selfChain, registrar_, portal_);
  }

  function __Synchronizer_init_unchained(
    Chain.Chain selfChain,
    IRegistrar registrar_,
    IPortal portal_
  ) internal onlyInitializing {
    _registrar = registrar_;
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
      if (dstChain != _selfChain) {
        address dstSynchronizer = getRemoteSynchronizer(dstChain);
        bytes memory ctx = _packContext(action, ews);
        bytes memory payload = _packPayload(dstSynchronizer, ctx);
        fee += _portal.estimateFee(dstChain, provider, payload);
      }
    }
    return fee;
  }

  function sync(
    address payable sender,
    SyncAction.SyncAction action,
    CrossChainProvider.CrossChainProvider provider,
    Chain.Chain[] memory dstChains,
    bytes memory ews
  ) external payable onlyRole(REQUESTOR_ROLE) {
    _sync(sender, action, provider, dstChains, ews);
  }

  function _sync(
    address payable sender,
    SyncAction.SyncAction action,
    CrossChainProvider.CrossChainProvider provider,
    Chain.Chain[] memory dstChains,
    bytes memory ews
  ) private {
    bytes memory ctx = _packContext(action, ews);
    for (uint256 i = 0; i < dstChains.length; i++) {
      Chain.Chain dstChain = dstChains[i];
      if (dstChain != _selfChain) {
        address dstSynchronizer = getRemoteSynchronizer(dstChain);
        bytes memory payload = _packPayload(dstSynchronizer, ctx);
        uint256 fee = _portal.estimateFee(dstChain, provider, payload);
        _portal.send_{ value: fee }(sender, dstChain, provider, payload);
      }
    }
    emit OutgoingSync(action, provider, dstChains);
  }

  function receive_(bytes memory ctx) external {
    (SyncAction.SyncAction action, bytes memory ews) = _unpackContext(ctx);
    address app;
    if (action == SyncAction.SyncAction.REGISTRAR) {
      app = address(_registrar);
    } else if (action == SyncAction.SyncAction.RESOLVER) {
      app = address(_resolver);
    }

    if (app != address(0)) {
      try ISynchronizerApplication(app).receiveSync(ews) {
        emit IncomingSync(action, address(app));
      } catch Error(string memory reason) {
        emit ApplicationError(action, reason);
      }
    }
  }

  function getRemoteSynchronizer(Chain.Chain chain) public view returns (address) {
    return _remoteSynchronizers[chain];
  }

  function setRemoteSynchronizer(Chain.Chain chain, address target) public {
    _remoteSynchronizers[chain] = target;
  }

  function getUserDefaultProvider(address user) public view returns (CrossChainProvider.CrossChainProvider) {
    return _userDefaultProviders[user];
  }

  function setUserDefaultProvider(address user, CrossChainProvider.CrossChainProvider provider) public {
    require(user == _msgSender(), "ONLY_SELF");
    _userDefaultProviders[user] = provider;
  }

  function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}

  uint256[50] private __gap;
}
