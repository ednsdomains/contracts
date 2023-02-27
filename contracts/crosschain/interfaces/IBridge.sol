// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "../../lib/Chain.sol";
import "../../lib/CrossChainProvider.sol";
import "../../lib/TldClass.sol";
import "./IReceiver.sol";

interface IBridge is IReceiver {
  event Bridged(uint256 indexed nonce, address indexed sender, bytes32 indexed ref);
  event Accepted(uint256 indexed nonce, address indexed sender, bytes32 indexed ref);
  event Received(bytes32 indexed ref);

  struct AcceptedRequest {
    Chain srcChain;
    CrossChainProvider provider;
    bytes32 tld;
    bytes32 name;
    address owner;
    uint64 expiry;
  }

  struct BridgedRequest {
    Chain dstChain;
    CrossChainProvider provider;
    bytes32 tld;
    bytes32 name;
    address owner;
    uint64 expiry;
  }

  function estimateFee(
    Chain dstChain,
    CrossChainProvider provider,
    bytes32 name,
    bytes32 tld
  ) external view returns (uint256);

  function bridge(
    uint256 nonce,
    bytes32 ref,
    Chain dstChain,
    CrossChainProvider provider,
    bytes32 name,
    bytes32 tld
  ) external payable;

  function accept(
    uint256 nonce,
    bytes32 ref,
    Chain srcChain,
    CrossChainProvider provider,
    bytes memory name,
    bytes memory tld,
    address owner,
    uint64 expiry
  ) external;

  function getAcceptedRequest(bytes32 ref) external view returns (AcceptedRequest memory);

  function getBridgedRequest(bytes32 ref) external view returns (BridgedRequest memory);

  function getRemoteBridge(Chain chain) external view returns (address);

  function setRemoteBridge(Chain chain, address target) external;

  function getNonce() external view returns (uint256);

  function getRef(
    uint256 nonce,
    Chain dstChain,
    CrossChainProvider provider,
    bytes32 name,
    bytes32 tld,
    address owner,
    uint64 expiry
  ) external view returns (bytes32);

  function isReceived(bytes32 ref) external view returns (bool);
}
