// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "../lib/CrossChainProvider.sol";
import "./providers/layerzero/interfaces/ILayerZeroProvider.sol";
import "./interfaces/IPortal.sol";
import "./interfaces/IReceiver.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract Portal is IPortal, UUPSUpgradeable, AccessControlUpgradeable {
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
  bytes32 public constant SENDER_ROLE = keccak256("SENDER_ROLE");
  bytes32 public constant PROVIDER_ROLE = keccak256("PROVIDER_ROLE");

  mapping(CrossChainProvider.CrossChainProvider => address) private _providers;

  function initialize() public initializer {
    __Portal_init();
  }

  function __Portal_init() internal onlyInitializing {
    __Portal_init_unchained();
    __UUPSUpgradeable_init();
    __AccessControl_init();
    __ERC165_init();
  }

  function __Portal_init_unchained() internal onlyInitializing {
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _grantRole(ADMIN_ROLE, _msgSender());
    _grantRole(OPERATOR_ROLE, _msgSender());
  }

  function send_(
    address payable sender,
    Chain.Chain dstChain,
    CrossChainProvider.CrossChainProvider provider,
    bytes calldata payload
  ) external payable onlyRole(SENDER_ROLE) {
    if (provider == CrossChainProvider.CrossChainProvider.LAYERZERO && _providers[provider] != address(0)) {
      ILayerZeroProvider(_providers[provider]).send_{ value: msg.value }(sender, dstChain, payload);
    } else {
      revert("Empty provider");
    }

    emit Sent(sender, dstChain, provider, payload);
  }

  function receive_(CrossChainProvider.CrossChainProvider provider, bytes memory payload) external onlyRole(PROVIDER_ROLE) {
    emit Received(provider, payload);

    (address target, bytes memory ctx) = abi.decode(payload, (address, bytes));
    try IReceiver(target).receive_(ctx) {
      // do nothing
    } catch (bytes memory reason) {
      bytes32 id = keccak256(payload);
      emit ReceiverError(id, target, reason);
    }
  }

  function estimateFee(
    Chain.Chain dstChain,
    CrossChainProvider.CrossChainProvider provider,
    bytes calldata payload
  ) external view returns (uint256) {
    if (provider == CrossChainProvider.CrossChainProvider.LAYERZERO && _providers[provider] != address(0)) {
      return ILayerZeroProvider(_providers[provider]).estimateFee(dstChain, payload);
    } else {
      revert("Empty provider");
    }
  }

  function getProvider(CrossChainProvider.CrossChainProvider provider) external view returns (address) {
    return _providers[provider];
  }

  function setProvider(CrossChainProvider.CrossChainProvider provider, address address_) external onlyRole(OPERATOR_ROLE) {
    _providers[provider] = address_;
  }

  /* ========== UUPS ==========*/
  function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}

  uint256[50] private __gap;
}
