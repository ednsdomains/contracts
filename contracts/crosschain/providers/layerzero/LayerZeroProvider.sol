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

  function estimateFees(
    uint16 _dstChainId,
    bytes calldata payload,
    bytes calldata _adapterParams
  ) public view returns (uint256) {
    (uint256 nativeFee, uint256 zroFee) = lzEndpoint.estimateFees(_dstChainId, address(this), payload, false, _adapterParams);
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
    uint16 _dstChainId,
    bytes calldata _payload,
    bytes calldata _adapterParams
  ) external payable {
    require(_msgSender() == address(_portal), "ONLY_PORTAL");
    _send(_from, _dstChainId, _payload, _adapterParams);
  }

  function _send(
    address payable _from,
    uint16 _dstChainId,
    bytes calldata payload,
    bytes calldata _adapterParams
  ) internal {
    if (useCustomAdapterParams) {
      _checkGasLimit(_dstChainId, FUNCTION_TYPE_SEND, _adapterParams, NO_EXTRA_GAS);
    } else {
      require(_adapterParams.length == 0, "LzApp: _adapterParams must be empty.");
    }
    _lzSend(_dstChainId, payload, _from, _from, _adapterParams);
    uint64 nonce = lzEndpoint.getOutboundNonce(_dstChainId, address(this));
    emit Sent(_from, _dstChainId, payload, nonce);
  }

  /* ========== UUPS ==========*/
  function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}
}
