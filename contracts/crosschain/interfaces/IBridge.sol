//SPDX-License-Identifier: MIT
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
    Chain.Chain srcChain;
    CrossChainProvider.CrossChainProvider provider;
    bytes32 tld;
    bytes32 name;
    address owner;
    uint64 expiry;
  }

  struct BridgedRequest {
    Chain.Chain dstChain;
    CrossChainProvider.CrossChainProvider provider;
    bytes32 tld;
    bytes32 name;
    address owner;
    uint64 expiry;
  }

  function getRef(
    uint256 nonce,
    Chain.Chain dstChain,
    CrossChainProvider.CrossChainProvider provider,
    bytes32 name,
    bytes32 tld,
    address owner,
    uint64 expiry
  ) external view returns (bytes32);

  function estimateFee(
    Chain.Chain dstChain,
    CrossChainProvider.CrossChainProvider provider,
    bytes32 name,
    bytes32 tld
  ) external view returns (uint256);

  function bridge(
    uint256 nonce,
    bytes32 ref,
    Chain.Chain dstChain,
    CrossChainProvider.CrossChainProvider provider,
    bytes32 name,
    bytes32 tld
  ) external payable;

  function accept(
    uint256 nonce,
    bytes32 ref,
    Chain.Chain srcChain,
    CrossChainProvider.CrossChainProvider provider,
    bytes memory name,
    bytes memory tld,
    address owner,
    uint64 expiry
  ) external;

  function getAcceptedRequest(bytes32 ref) external view returns (AcceptedRequest memory);

  function getBridgedRequest(bytes32 ref) external view returns (BridgedRequest memory);

  function getRemoteBridge(Chain.Chain chain) external view returns (address);

  function setRemoteBridge(Chain.Chain chain, address target) external;

  function getChainId(Chain.Chain chain, CrossChainProvider.CrossChainProvider provider) external view returns (uint16);

  function setChainId(
    Chain.Chain chain,
    CrossChainProvider.CrossChainProvider provider,
    uint16 chaindId
  ) external;

  function getNonce() external view returns (uint256);
}
