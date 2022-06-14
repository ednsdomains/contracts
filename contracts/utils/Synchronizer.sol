//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "../layerzero/NonBlockingLayerZeroApp.sol";

abstract contract Synchronizer is NonBlockingLayerZeroApp {
  event TransactionIn(uint16 srcChainId, address srcAddress, uint64 nonce);
  event Fulfilled(bytes32 reqId);
  event Callback(uint16 dstChainId, bytes32 reqId);
  event Synchronize(address sender_, bytes32 reqId, uint64[] nonces);

  uint16 public chainId; // The chain ID in LZ, the current deployed blochchain
  uint16[] public chainIds; // The chain IDs in LZ, all of the chain ID will be included

  mapping(bytes32 => mapping(uint16 => bool)) internal _reqs;
  mapping(bytes32 => uint256) internal _history; // The record of the sync request created at timestamp

  modifier onlyLayerZeroOracle() {
    require(_msgSender() == address(lzEndpoint), "FORBIDDEN_ACCESS");
    _;
  }


  function exists(bytes32 reqId)  public virtual view returns (bool) {
    return _history[reqId] == 0;
  }

  function _sync(bytes memory payload) internal returns (bytes32) {
    // Create a unique request ID by composite the block number, the current timestamp, and the entire payload by hashing it
    bytes32 _reqId = keccak256(abi.encodePacked(block.number, block.timestamp, payload));
    bytes memory payload_ = abi.encode(_reqId, payload);
    // Set the request ID in the requests record history
    _history[_reqId] = block.timestamp;
    uint64[] memory _nonces = new uint64[](chainIds.length);
    // Start looping through the chains
    for (uint256 i = 0; i < chainIds.length; i++) {
      // Ensure the transaction will not send again to itself
      if (chainIds[i] != chainId) {
        _lzSend(chainIds[i], payload_, payable(_msgSender()), address(0x0), "");
        // Collect the nonce
        uint64 nonce = lzEndpoint.getOutboundNonce(chainIds[i], address(this));
        _nonces[i] = nonce;
        // Record the fulfillment state
        _reqs[_reqId][chainIds[i]] = false;
      }
    }
    emit Synchronize(_msgSender(), _reqId, _nonces);
    return _reqId;
  }

  function estimateSyncFee(bytes memory payload) public view returns (uint256) {
    uint256 fee_ = 0;
    for (uint256 i = 0; i < chainIds.length; i++) {
      if (chainIds[i] != chainId) {
        (uint256 nativeFee, uint256 zroFee) = lzEndpoint.estimateFees(chainIds[i], address(this), payload, false, "");
        fee_ += nativeFee;
      }
    }
    return fee_;
  }

  function _callback(uint16 dstChainId, bytes32 reqId) internal {
    emit Callback(dstChainId, reqId);
    bytes memory payload = abi.encode("_fullfill(uint16, bytes32)", chainId, reqId);
    _lzSend(dstChainId, payload, payable(_msgSender()), address(0x0), "");
  }

  function _fulfill(uint16 srcChainId, bytes32 reqId) internal {
    emit Fulfilled(reqId);
    _reqs[reqId][srcChainId] = true;
  }

  function fulfill(bytes32 reqId, uint16 chainId_) public view returns (bool) {
    require(exists(reqId), "REQUEST_NOT_EXISTS");
    return _reqs[reqId][chainId_];
  }

  function _nonblockingLzReceive(
    uint16 srcChainId,
    bytes memory srcAddress, // srcAddress
    uint64 nonce,
    bytes memory payload_
  ) internal virtual override {
    address _srcAddress;
    assembly {
      _srcAddress := mload(add(srcAddress, 20))
    }
    emit TransactionIn(srcChainId, _srcAddress, nonce);
    (bytes32 reqId, bytes memory payload) = abi.decode(payload_, (bytes32, bytes));
    address(this).call(payload);
    _callback(srcChainId, reqId);
  }
}
