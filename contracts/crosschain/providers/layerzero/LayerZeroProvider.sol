//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "./NonblockingLayerZeroApp.sol";

contract LayerZeroProvider is NonblockingLayerZeroApp, AccessControlUpgradeable {
  uint256 public constant NO_EXTRA_GAS = 0;
  uint256 public constant FUNCTION_TYPE_SEND = 1;
  bool public useCustomAdapterParams;

  bytes32 public constant PORTAL_ROLE = keccak256("PORTAL_ROLE");

  event SetUseCustomAdapterParams(bool _useCustomAdapterParams);

  event SendToChain(address indexed _sender, uint16 indexed _dstChainId, bytes indexed payload, uint64 _nonce);

  event ReceiveFromChain(uint16 indexed _srcChainId, bytes indexed _srcAddress, bytes indexed payload, uint64 _nonce);

  function initialize(address _lzEndpoint) public initializer {
    __LayerZeroProvider_init(_lzEndpoint);
  }

  function __LayerZeroProvider_init(address _lzEndpoint) internal onlyInitializing {
    __Ownable_init();
    __LayerZeroProvider_init_unchained(_lzEndpoint);
  }

  function __LayerZeroProvider_init_unchained(address _lzEndpoint) internal onlyInitializing {
    __NonblockingLayerZeroApp_init_unchained(_lzEndpoint);
  }

  function estimateSendFee(
    uint16 _dstChainId,
    bytes memory _toAddress,
    uint256 _tokenId,
    bool _useZro,
    bytes memory _adapterParams
  ) public view returns (uint256 nativeFee, uint256 zroFee) {
    // mock the payload for send()
    bytes memory payload = abi.encode(_toAddress, _tokenId);
    return lzEndpoint.estimateFees(_dstChainId, address(this), payload, _useZro, _adapterParams);
  }

  function _nonblockingLzReceive(
    uint16 _srcChainId,
    bytes memory _srcAddress,
    uint64 _nonce,
    bytes memory _payload
  ) internal override {}

  function send(
    address _from,
    uint16 _dstChainId,
    bytes memory payload,
    address payable _refundAddress,
    address _zroPaymentAddress,
    bytes memory _adapterParams
  ) external {
    require(hasRole(_msgSender(), PORTAL_ROLE), "ONLY_PORTAL");
    _send(_from, _dstChainId, _payload, _refundAddress, _zroPaymentAddress, payload, _zroPaymentAddress);
  }

  function _send(
    address _from,
    uint16 _dstChainId,
    bytes memory payload,
    address payable _refundAddress,
    address _zroPaymentAddress,
    bytes memory _adapterParams
  ) internal {
    if (useCustomAdapterParams) {
      _checkGasLimit(_dstChainId, FUNCTION_TYPE_SEND, _adapterParams, NO_EXTRA_GAS);
    } else {
      require(_adapterParams.length == 0, "LzApp: _adapterParams must be empty.");
    }
    _lzSend(_dstChainId, payload, _refundAddress, _zroPaymentAddress, _adapterParams);
    uint64 nonce = lzEndpoint.getOutboundNonce(_dstChainId, address(this));
    emit SendToChain(_from, _dstChainId, payload, nonce);
  }
}
