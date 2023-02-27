// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./interfaces/ILayerZeroProvider.sol";
import "./interfaces/ILayerZeroEndpoint.sol";
import "../../interfaces/IPortal.sol";

contract LayerZeroProvider is ILayerZeroProvider, UUPSUpgradeable, AccessControlUpgradeable {
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

  IPortal private _portal;
  ILayerZeroEndpoint private _lzEndpoint;

  mapping(Chain => uint16) private _chainIds;
  mapping(uint16 => bytes) public trustedRemotes;

  bytes public v1AdaptorParameters;

  function initialize(address lzEndpoint_, IPortal portal) public initializer {
    __LayerZeroProvider_init(lzEndpoint_, portal);
  }

  function __LayerZeroProvider_init(address lzEndpoint_, IPortal portal) internal onlyInitializing {
    __LayerZeroProvider_init_unchained(lzEndpoint_, portal);
  }

  function __LayerZeroProvider_init_unchained(address lzEndpoint_, IPortal portal) internal onlyInitializing {
    _portal = portal;
    _lzEndpoint = ILayerZeroEndpoint(lzEndpoint_);
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _grantRole(ADMIN_ROLE, _msgSender());
    _grantRole(OPERATOR_ROLE, _msgSender());
  }

  function estimateFee(Chain _dstChain, bytes calldata payload) public view returns (uint256) {
    uint16 _dstChainId = getChainId(_dstChain);
    (uint256 nativeFee, ) = _lzEndpoint.estimateFees(_dstChainId, address(this), payload, false, v1AdaptorParameters);
    return nativeFee;
  }

  function send_(
    address payable _from,
    Chain _dstChain,
    bytes calldata _payload
  ) external payable {
    require(_msgSender() == address(_portal), "ONLY_PORTAL");
    uint16 _dstChainId = getChainId(_dstChain);
    _send(_from, _dstChainId, _payload);
  }

  function _send(
    address payable _sender,
    uint16 _dstChainId,
    bytes calldata _payload
  ) internal {
    bytes memory trustedRemote = trustedRemotes[_dstChainId];
    require(trustedRemote.length != 0, "UNTRUST_REMOTE");
    _lzEndpoint.send{ value: msg.value }(_dstChainId, trustedRemote, _payload, _sender, _sender, v1AdaptorParameters);
    uint64 nonce = _lzEndpoint.getOutboundNonce(_dstChainId, address(this));
    emit MessageSent(_sender, _dstChainId, _payload, nonce);
  }

  function lzReceive(
    uint16 _srcChainId,
    bytes calldata _srcAddress,
    uint64 _nonce,
    bytes calldata _payload
  ) public {
    require(_msgSender() == address(_lzEndpoint), "INVALID_ENDPOINT");
    bytes memory trustedRemote = trustedRemotes[_srcChainId];
    require(_srcAddress.length == trustedRemote.length && keccak256(_srcAddress) == keccak256(trustedRemote), "IINVALID_SOURCE");
    bytes32 ref = keccak256(abi.encodePacked(_nonce, _payload));
    emit MessageReceived(_srcChainId, _srcAddress, ref, _payload, _nonce);
    try this.receive_(_payload) {
      emit MessageDelivered(ref);
    } catch Error(string memory reason) {
      emit MessageDeliverFailed(ref, reason);
    }
  }

  function receive_(bytes calldata _payload) public {
    require(_msgSender() == address(this), "ONLY_SELF");
    _receive(_payload);
  }

  function _receive(bytes calldata _payload) internal {
    _portal.receive_(CrossChainProvider.LAYERZERO, _payload);
  }

  function getChainId(Chain chain) public view returns (uint16) {
    return _chainIds[chain];
  }

  function setChainId(Chain chain, uint16 chainId) public onlyRole(OPERATOR_ROLE) {
    _chainIds[chain] = chainId;
  }

  function setTrustedRemote(uint16 _srcChainId, bytes calldata _srcAddress) external onlyRole(OPERATOR_ROLE) {
    trustedRemotes[_srcChainId] = _srcAddress;
    emit SetTrustedRemote(_srcChainId, _srcAddress);
  }

  function isTrustedRemote(uint16 _srcChainId, bytes calldata _srcAddress) external view returns (bool) {
    bytes memory trustedSource = trustedRemotes[_srcChainId];
    return keccak256(trustedSource) == keccak256(_srcAddress);
  }

  function setV1AdaptorParameters(uint256 dstGasLimit) external onlyRole(OPERATOR_ROLE) {
    uint16 version = 1;
    v1AdaptorParameters = abi.encodePacked(version, dstGasLimit);
  }

  /* ========== UUPS ==========*/
  function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}

  uint256[50] private __gap;
}
