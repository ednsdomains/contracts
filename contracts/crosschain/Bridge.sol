//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../lib/TldClass.sol";
import "../registry/interfaces/IRegistry.sol";
import "./interfaces/IBridge.sol";
import "./interfaces/IPortal.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract Bridge is IBridge, PausableUpgradeable, AccessControlUpgradeable {
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant TERMINATOR_ROLE = keccak256("TERMINATOR_ROLE");

  Chain.Chain private _selfChain;

  IRegistry private _registry;
  IPortal private _portal;

  mapping(bytes32 => AcceptedRequest) private _acceptedRequests;
  mapping(bytes32 => BridgedRequest) private _bridgedRequests;
  mapping(bytes32 => bool) private _receivedRequest;

  mapping(Chain.Chain => address) private _remoteBridges;
  mapping(bytes32 => uint16) private _chainIds;

  mapping(address => uint256) private _counts;

  function initialize(
    Chain.Chain selfChain,
    IRegistry registry_,
    IPortal portal_
  ) public initializer {
    __Bridge_init(selfChain, registry_, portal_);
  }

  function __Bridge_init(
    Chain.Chain selfChain,
    IRegistry registry_,
    IPortal portal_
  ) internal onlyInitializing {
    __Bridge_init_unchained(selfChain, registry_, portal_);
  }

  function __Bridge_init_unchained(
    Chain.Chain selfChain,
    IRegistry registry_,
    IPortal portal_
  ) internal onlyInitializing {
    _registry = registry_;
    _portal = portal_;
    _selfChain = selfChain;
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _grantRole(ADMIN_ROLE, _msgSender());
  }

  function pause() public onlyRole(ADMIN_ROLE) {
    _pause();
  }

  function unpause() public onlyRole(ADMIN_ROLE) {
    _unpause();
  }

  function receive_(bytes memory payload) external {
    require(_msgSender() == address(_portal), "ONLE_PORTAL");
    bytes32 ref;
    assembly {
      ref := mload(add(payload, 32))
    }
    _receivedRequest[ref] = true;
  }

  function _getRef(
    uint256 id,
    Chain.Chain dstChain,
    CrossChainProvider.CrossChainProvider provider,
    bytes32 name,
    bytes32 tld,
    address owner,
    uint64 expiry
  ) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(id, dstChain, provider, name, tld, owner, expiry));
  }

  function bridge(
    Chain.Chain dstChain,
    CrossChainProvider.CrossChainProvider provider,
    bytes32 name,
    bytes32 tld,
    address owner,
    uint64 expiry
  ) external payable whenNotPaused {
    require(_selfChain != dstChain, "SELF_CHAIN");
    uint16 dstChainId = getChainId(dstChain, provider);
    require(_registry.getOwner(name, tld) == _msgSender(), "ONLY_OWNER");
    require(_registry.getTldClass(tld) == TldClass.TldClass.UNIVERSAL, "ONLY_UNIVERSAL_TLD");
    require(dstChainId != 0, ""); // TODO:

    uint256 id = _counts[_msgSender()];
    bytes32 ref = _getRef(id, dstChain, provider, name, tld, owner, expiry);
    address dstBridge = getRemoteBridge(dstChain);

    bytes memory payload = abi.encode(dstBridge, ref);

    require(msg.value >= _portal.estimateFee(provider, dstChainId, payload), "INSUFFICIENT_FEE");

    _portal.send{ value: msg.value }(payable(_msgSender()), provider, dstChainId, payload);

    _bridgedRequests[ref] = BridgedRequest({ dstChain: dstChain, provider: provider, tld: tld, name: name, owner: owner, expiry: expiry });

    _registry.bridged(name, tld);

    emit Bridged(id, _msgSender(), ref);

    _counts[_msgSender()] += 1;
  }

  function accept(
    uint256 id,
    bytes32 ref,
    Chain.Chain srcChain,
    CrossChainProvider.CrossChainProvider provider,
    bytes memory name,
    bytes memory tld,
    address owner,
    uint64 expiry
  ) external whenNotPaused {
    require(_receivedRequest[ref] == true, "REF_NOT_FOUND");
    bytes32 name_ = keccak256(name);
    bytes32 tld_ = keccak256(tld);
    bytes32 ref_ = _getRef(id, srcChain, provider, name_, tld_, owner, expiry);
    require(ref == ref_, "INVALID_REF");
    require(_msgSender() == owner, "ONLY_OWNER");

    _registry.setRecord(name, tld, owner, address(0x0), expiry);

    _acceptedRequests[ref] = AcceptedRequest({ srcChain: srcChain, provider: provider, tld: tld_, name: name_, owner: owner, expiry: expiry });

    emit Accepted(id, _msgSender(), ref);

    _receivedRequest[ref] = false;
  }

  function getAcceptedRequest(bytes32 ref) public view returns (AcceptedRequest memory) {
    return _acceptedRequests[ref];
  }

  function getBridgedRequest(bytes32 ref) public view returns (BridgedRequest memory) {
    return _bridgedRequests[ref];
  }

  function getRemoteBridge(Chain.Chain chain) public view returns (address) {
    return _remoteBridges[chain];
  }

  function setRemoteBridge(Chain.Chain chain, address target) public onlyRole(ADMIN_ROLE) {
    _remoteBridges[chain] = target;
  }

  function getChainId(Chain.Chain chain, CrossChainProvider.CrossChainProvider provider) public view returns (uint16) {
    return _chainIds[keccak256(abi.encodePacked(chain, provider))];
  }

  function setChainId(
    Chain.Chain chain,
    CrossChainProvider.CrossChainProvider provider,
    uint16 chainId
  ) public onlyRole(ADMIN_ROLE) {
    _chainIds[keccak256(abi.encodePacked(chain, provider))] = chainId;
  }

  function getCount() public view returns (uint256) {
    return _counts[_msgSender()];
  }
}
