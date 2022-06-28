// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./interfaces/ILayerZeroEndpoint.sol";
import "./interfaces/ILayerZeroApp.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

abstract contract LayerZeroApp is ILayerZeroApp, OwnableUpgradeable {
  ILayerZeroEndpoint public lzEndpoint;

  mapping(uint16 => bytes) public trustedRemoteLookup;
  mapping(uint16 => mapping(bytes => mapping(uint64 => bytes32))) public failedMessages;

  event SetTrustedRemote(uint16 _srcChainId, bytes _srcAddress);
  event MessageFailed(uint16 _srcChainId, bytes _srcAddress, uint64 _nonce, bytes _payload);

  function __LayerZeroApp_init(address _endpoint) internal onlyInitializing {
    __LayerZeroApp_init_unchained(_endpoint);
  }

  function __LayerZeroApp_init_unchained(address _endpoint) internal onlyInitializing {
    __Ownable_init_unchained();
    lzEndpoint = ILayerZeroEndpoint(_endpoint);
  }

  function lzReceive(
    uint16 _srcChainId,
    bytes calldata _srcAddress,
    uint64 _nonce,
    bytes calldata _payload
  ) external virtual override {
    require(_msgSender() == address(lzEndpoint), "ONLY_ENDPOINT");
    bytes memory trustedRemote = trustedRemoteLookup[_srcChainId];
    require(_srcAddress.length == trustedRemote.length && keccak256(_srcAddress) == keccak256(trustedRemote), "ONLY_TRUST_REMOTE");
    try this.tryLzReceive(_srcChainId, _srcAddress, _nonce, _payload) {} catch {
      failedMessages[_srcChainId][_srcAddress][_nonce] = keccak256(_payload);
      emit MessageFailed(_srcChainId, _srcAddress, _nonce, _payload);
    }
  }

  function tryLzReceive(
    uint16 _srcChainId,
    bytes calldata _srcAddress,
    uint64 _nonce,
    bytes calldata _payload
  ) external {
    require(_msgSender() == address(this), "ONLY_SELF");
    _lzReceive(_srcChainId, _srcAddress, _nonce, _payload);
  }

  function _lzReceive(
    uint16 _srcChainId,
    bytes calldata _srcAddress,
    uint64 _nonce,
    bytes calldata _payload
  ) internal virtual {}

  function _lzSend(
    uint16 _dstChainId,
    bytes memory _payload,
    address payable _refundAddress,
    address _zroPaymentAddress,
    bytes memory _adapterParams
  ) internal virtual {
    bytes memory trustedRemote = trustedRemoteLookup[_dstChainId];
    require(trustedRemote.length != 0, "NOT_TRUST_REMOTE");
    lzEndpoint.send{ value: msg.value }(_dstChainId, trustedRemote, _payload, _refundAddress, _zroPaymentAddress, _adapterParams);
  }

  //---------------------------UserApplication config----------------------------------------
  function getConfig(
    uint16 _version,
    uint16 _chainId,
    address,
    uint256 _configType
  ) external view returns (bytes memory) {
    return lzEndpoint.getConfig(_version, _chainId, address(this), _configType);
  }

  // generic config for LayerZero user Application
  function setConfig(
    uint16 _version,
    uint16 _chainId,
    uint256 _configType,
    bytes calldata _config
  ) external override onlyOwner {
    lzEndpoint.setConfig(_version, _chainId, _configType, _config);
  }

  function setSendVersion(uint16 _version) external override onlyOwner {
    lzEndpoint.setSendVersion(_version);
  }

  function setReceiveVersion(uint16 _version) external override onlyOwner {
    lzEndpoint.setReceiveVersion(_version);
  }

  function forceResumeReceive(uint16 _srcChainId, bytes calldata _srcAddress) external override onlyOwner {
    lzEndpoint.forceResumeReceive(_srcChainId, _srcAddress);
  }

  // allow owner to set it multiple times.
  function setTrustedRemote(uint16 _srcChainId, bytes calldata _srcAddress) external onlyOwner {
    trustedRemoteLookup[_srcChainId] = _srcAddress;
    emit SetTrustedRemote(_srcChainId, _srcAddress);
  }

  //--------------------------- VIEW FUNCTION ----------------------------------------

  function isTrustedRemote(uint16 _srcChainId, bytes calldata _srcAddress) external view returns (bool) {
    bytes memory trustedSource = trustedRemoteLookup[_srcChainId];
    return keccak256(trustedSource) == keccak256(_srcAddress);
  }
}
