//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./interfaces/ILayerZeroProvider.sol";
import "./NonblockingLayerZeroApp.sol";
import "../../interfaces/IPortal.sol";

contract LayerZeroProvider is ILayerZeroProvider, UUPSUpgradeable, NonblockingLayerZeroApp, AccessControlUpgradeable {
  uint256 public constant NO_EXTRA_GAS = 0;
  uint256 public constant FUNCTION_TYPE_SEND = 1;
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  bool public useCustomAdapterParams;

  IPortal private _portal;

  mapping(Chain.Chain => uint16) private _chainIds;

  function initialize(address _lzEndpoint, IPortal portal) public initializer {
    __LayerZeroProvider_init(_lzEndpoint, portal);
  }

  function __LayerZeroProvider_init(address _lzEndpoint, IPortal portal) internal onlyInitializing {
    __Ownable_init();
    __LayerZeroProvider_init_unchained(_lzEndpoint, portal);
  }

  function __LayerZeroProvider_init_unchained(address _lzEndpoint, IPortal portal) internal onlyInitializing {
    __NonblockingLayerZeroApp_init_unchained(_lzEndpoint);
    _portal = portal;
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _grantRole(ADMIN_ROLE, _msgSender());
  }

  function estimateFee(Chain.Chain _dstChain, bytes calldata payload) public view returns (uint256) {
    uint16 _dstChainId = getChainId(_dstChain);
    (uint256 nativeFee, uint256 zroFee) = lzEndpoint.estimateFees(_dstChainId, address(this), payload, false, new bytes(0));
    return nativeFee;
  }

  function _nonblockingLzReceive(
    uint16 _srcChainId,
    bytes calldata _srcAddress,
    uint64 _nonce,
    bytes calldata _payload
  ) internal override {
    emit Received(_srcChainId, _srcAddress, _payload, _nonce);
    _portal.receive_(CrossChainProvider.CrossChainProvider.LAYERZERO, _payload);
  }

  function send(
    address payable _from,
    Chain.Chain _dstChain,
    bytes calldata _payload
  ) external payable {
    require(_msgSender() == address(_portal), "ONLY_PORTAL");
    uint16 _dstChainId = getChainId(_dstChain);
    _send(_from, _dstChainId, _payload);
  }

  function _send(
    address payable _from,
    uint16 _dstChainId,
    bytes calldata payload
  ) internal {
    _lzSend(_dstChainId, payload, _from);
    uint64 nonce = lzEndpoint.getOutboundNonce(_dstChainId, address(this));
    emit Sent(_from, _dstChainId, payload, nonce);
  }

  function getChainId(Chain.Chain chain) public view returns (uint16) {
    return _chainIds[chain];
  }

  function setChainId(Chain.Chain chain, uint16 chainId) public onlyRole(ADMIN_ROLE) {
    _chainIds[chain] = chainId;
  }

  /* ========== UUPS ==========*/
  function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}
}
