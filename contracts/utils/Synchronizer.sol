//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./interfaces/ISynchronizer.sol";
import "../layerzero/NonBlockingLayerZeroApp.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

 contract Synchronizer is ISynchronizer, NonBlockingLayerZeroApp, AccessControlUpgradeable {
  event TransactionIn(uint16 srcChainId, address srcAddress, uint64 nonce);
  event Fulfilled(bytes32 reqId);
  event Callback(uint16 dstChainId, bytes32 reqId);
  event Synchronize(address sender_, bytes32 reqId, uint64[] nonces);
  event SetTarget(address target);

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  uint16 public chainId; // The chain ID in LZ, the current deployed blochchain
  uint16[] public chainIds; // The chain IDs in LZ, all of the chain ID will be included

  address private _target;

  mapping(bytes32 => mapping(uint16 => bool)) internal _reqs;
  mapping(bytes32 => uint256) internal _history; // The record of the sync request created at timestamp

  modifier onlyLayerZeroOracle() {
    require(_msgSender() == address(lzEndpoint), "ONLY_LZ_ORACLE");
    _;
  }

  modifier onlyAdmin() {
    require(hasRole(ADMIN_ROLE, _msgSender()), "ONLY_ADMIN");
    _;
  }

  modifier onlyTarget() {
    require(_msgSender() == _target, "ONLY_TARGET");
    _;
  }

  function __Synchronizer_init(
    uint16 chainId_,
    uint16[] memory chainIds_,
    address _lzEndpoint
  ) internal onlyInitializing {
    __Synchronizer_init_unchained(chainId_, chainIds_);
    __NonBlockingLayerZeroApp_init(_lzEndpoint);
    __AccessControl_init();
    _transferOwnership(_msgSender());
  }

  function __Synchronizer_init_unchained(uint16 chainId_, uint16[] memory chainIds_) internal onlyInitializing {
    chainId = chainId_;
    chainIds = chainIds_;
    _setRoleAdmin(ADMIN_ROLE, DEFAULT_ADMIN_ROLE);
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(ADMIN_ROLE, _msgSender());
  }

  function _setTarget(address target_) internal {
    _target = target_;
    emit SetTarget(target_);
  }

  function _reqExists(bytes32 reqId) public view virtual returns (bool) {
    return _history[reqId] == 0;
  }

  function sync(bytes calldata payload) external onlyTarget {
    _sync(payload);
  }

  function _sync(bytes calldata payload) internal returns (bytes32) {
    require(_target != address(0), "TARGET_NOT_SET");
    // Create a unique request ID by composite the block number, the current timestamp, and the entire payload by hashing it
    bytes32 _reqId = keccak256(abi.encodePacked(block.number, block.timestamp, payload));
    bytes memory payload_ = abi.encodePacked(_reqId, payload);
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
      } else {
        _reqs[_reqId][chainIds[i]] = true;
      }
    }
    emit Synchronize(_msgSender(), _reqId, _nonces);
    return _reqId;
  }

  function estimateSyncFee(bytes memory payload) external view returns (uint256) {
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
    bytes memory payload = abi.encodeWithSignature("_fulfill(uint16, bytes32)", chainId, reqId);
    _lzSend(dstChainId, payload, payable(_msgSender()), address(0x0), "");
  }

  function _fulfill(uint16 srcChainId, bytes32 reqId) internal {
    emit Fulfilled(reqId);
    _reqs[reqId][srcChainId] = true;
  }

  function fulfill(bytes32 reqId, uint16 chainId_) public view returns (bool) {
    require(_reqExists(reqId), "REQUEST_NOT_EXISTS");
    return _reqs[reqId][chainId_];
  }

  function _nonblockingLzReceive(
    uint16 srcChainId,
    bytes memory srcAddress, // srcAddress
    uint64 nonce,
    bytes calldata payload_
  ) internal virtual override {
    address _srcAddress;
    assembly {
      _srcAddress := mload(add(srcAddress, 20))
    }
    emit TransactionIn(srcChainId, _srcAddress, nonce);
    bytes32 reqId = bytes32(payload_[0:32]);
    bytes4 sig = bytes4(payload_[32:36]);
    bytes calldata payload = payload_[32:];
    if (sig == bytes4(keccak256("_fulfill(uint16, bytes32)")) || _target == address(0)) {
      address(this).call(payload);
    } else {
      _target.call(payload);
      _callback(srcChainId, reqId);
    }
  }

  function supportsInterface(bytes4 interfaceID) public view virtual override returns (bool) {
    return interfaceID == type(ISynchronizer).interfaceId || super.supportsInterface(interfaceID);
  }
}
