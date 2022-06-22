// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./LayerZeroApp.sol";
import "hardhat/console.sol";
/*
 * the default LayerZero messaging behaviour is blocking, i.e. any failed message will block the channel
 * this abstract class try-catch all fail messages and store locally for future retry. hence, non-blocking
 * NOTE: if the srcAddress is not configured properly, it will still block the message pathway from (srcChainId, srcAddress)
 */
abstract contract NonBlockingLayerZeroApp is LayerZeroApp {
  // constructor(address _endpoint) LayerZeroApp(_endpoint) {}

  //  function initialize(address _endpoint) public override initializer {
  //    __NonBlockingLayerZeroApp_init(_endpoint);
  //  }
  //  function initialize(address _endpoint) public override initializer {
  //    __NonBlockingLayerZeroApp_init(_endpoint);
  //  }

  function __NonBlockingLayerZeroApp_init(address _endpoint) internal onlyInitializing {
    __NonBlockingLayerZeroApp_init_unchained();
    __LayerZeroApp_init_unchained(_endpoint);
  }

  function __NonBlockingLayerZeroApp_init_unchained() internal onlyInitializing {}

  mapping(uint16 => mapping(bytes => mapping(uint64 => bytes32))) public failedMessages;

  event MessageFailed(uint16 _srcChainId, bytes _srcAddress, uint64 _nonce, bytes _payload);

  // overriding the virtual function in LzReceiver
  function _blockingLzReceive(
    uint16 _srcChainId,
    bytes memory _srcAddress,
    uint64 _nonce,
    bytes memory _payload
  ) internal virtual override {
    // try-catch all errors/exceptions
    try this.nonblockingLzReceive(_srcChainId, _srcAddress, _nonce, _payload) {
      // do nothing
    } catch {
      // error / exception
      failedMessages[_srcChainId][_srcAddress][_nonce] = keccak256(_payload);
      emit MessageFailed(_srcChainId, _srcAddress, _nonce, _payload);
    }
  }

  function nonblockingLzReceive(
    uint16 _srcChainId,
    bytes memory _srcAddress,
    uint64 _nonce,
    bytes calldata _payload
  ) public virtual {
    // only internal transaction
    require(_msgSender() == address(this), "NonblockingLzApp: caller must be LzApp");
    console.log("nonblockingLzReceive _payload %s",string(_payload));
    _nonblockingLzReceive(_srcChainId, _srcAddress, _nonce, _payload);
  }

  //@notice override this function
  function _nonblockingLzReceive(
    uint16 _srcChainId,
    bytes memory _srcAddress,
    uint64 _nonce,
    bytes memory _payload
  ) internal virtual;

  function retryMessage(
    uint16 _srcChainId,
    bytes memory _srcAddress,
    uint64 _nonce,
    bytes memory _payload
  ) public payable virtual {
    // assert there is message to retry
    bytes32 payloadHash = failedMessages[_srcChainId][_srcAddress][_nonce];
    require(payloadHash != bytes32(0), "NonblockingLzApp: no stored message");
    require(keccak256(_payload) == payloadHash, "NonblockingLzApp: invalid payload");
    // clear the stored message
    failedMessages[_srcChainId][_srcAddress][_nonce] = bytes32(0);
    // execute the message. revert if it fails again
    _nonblockingLzReceive(_srcChainId, _srcAddress, _nonce, _payload);
  }
}
