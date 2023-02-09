// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "../lib/TldClass.sol";
import "../registry/interfaces/IRegistry.sol";
import "./interfaces/IBridge.sol";
import "./interfaces/IPortal.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract Bridge is IBridge, UUPSUpgradeable, PausableUpgradeable, AccessControlUpgradeable {
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant TERMINATOR_ROLE = keccak256("TERMINATOR_ROLE");

  Chain.Chain private _selfChain;

  IRegistry private _registry;
  IPortal private _portal;

  mapping(bytes32 => AcceptedRequest) private _acceptedRequests;
  mapping(bytes32 => BridgedRequest) private _bridgedRequests;
  mapping(bytes32 => bool) private _receivedRequest;

  mapping(Chain.Chain => address) private _remoteBridges;

  mapping(address => uint256) private _nonces;

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
    emit Received(ref);
  }

  function getRef(
    uint256 nonce,
    Chain.Chain dstChain,
    CrossChainProvider.CrossChainProvider provider,
    bytes32 name,
    bytes32 tld,
    address owner,
    uint64 expiry
  ) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(nonce, dstChain, provider, name, tld, owner, expiry));
  }

  function estimateFee(
    Chain.Chain dstChain,
    CrossChainProvider.CrossChainProvider provider,
    bytes32 name,
    bytes32 tld
  ) external view returns (uint256) {
    uint256 nonce = _nonces[_msgSender()];
    bytes32 ref = getRef(nonce, dstChain, provider, name, tld, _registry.getOwner(name, tld), _registry.getExpiry(name, tld));
    address dstBridge = getRemoteBridge(dstChain);
    require(dstBridge != address(0x0), "DST_BRIDGE_MISSING");

    bytes memory payload = abi.encode(dstBridge, abi.encodePacked(ref));

    return _portal.estimateFee(dstChain, provider, payload);
  }

  function bridge(
    uint256 nonce,
    bytes32 ref,
    Chain.Chain dstChain,
    CrossChainProvider.CrossChainProvider provider,
    bytes32 name,
    bytes32 tld
  ) external payable whenNotPaused {
    require(_selfChain != dstChain, "SELF_CHAIN");

    require(_registry.getOwner(name, tld) == _msgSender(), "ONLY_OWNER");
    require(_registry.getTldClass(tld) == TldClass.TldClass.UNIVERSAL || _registry.getTldClass(tld) == TldClass.TldClass.OMNI, "ONLY_UNIVERSAL_OR_OMNI_TLD");

    uint256 nonce_ = _nonces[_msgSender()];
    require(nonce_ == nonce, "INVALID_NONCE");

    bytes32 ref_ = getRef(nonce, dstChain, provider, name, tld, _registry.getOwner(name, tld), _registry.getExpiry(name, tld));
    require(ref_ == ref, "INVALID_REF");

    address dstBridge = getRemoteBridge(dstChain);
    require(dstBridge != address(0), "INVALID_BRIDGE");

    bytes memory payload = abi.encode(dstBridge, abi.encodePacked(ref));

    _portal.send_{ value: msg.value }(payable(_msgSender()), dstChain, provider, payload);

    _bridgedRequests[ref] = BridgedRequest({
      dstChain: dstChain,
      provider: provider,
      tld: tld,
      name: name,
      owner: _registry.getOwner(name, tld),
      expiry: _registry.getExpiry(name, tld)
    });

    _registry.bridged(name, tld);

    emit Bridged(nonce, _msgSender(), ref);

    _nonces[_msgSender()] += 1;
  }

  function accept(
    uint256 nonce,
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

    if (!_registry.isExists(name_, tld_)) {
      bytes32 ref_ = getRef(nonce, srcChain, provider, name_, tld_, owner, expiry);
      require(ref == ref_, "INVALID_REF");
      require(_msgSender() == owner, "ONLY_OWNER");
      _registry.setRecord(name, tld, owner, address(0x0), expiry);
    }

    _acceptedRequests[ref] = AcceptedRequest({ srcChain: srcChain, provider: provider, tld: tld_, name: name_, owner: owner, expiry: expiry });

    emit Accepted(nonce, _msgSender(), ref);

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

  function getNonce() public view returns (uint256) {
    return _nonces[_msgSender()];
  }

  function isReceived(bytes32 ref) public view returns (bool) {
    return _receivedRequest[ref];
  }

  /* ========== UUPS ==========*/
  function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}

  uint256[50] private __gap;
}
