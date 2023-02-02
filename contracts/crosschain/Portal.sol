//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../lib/CrossChainProvider.sol";
import "./providers/layerzero/LayerZeroProvider.sol";
import "./interfaces/IPortal.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract Portal is IPortal, UUPSUpgradeable, AccessControlUpgradeable {
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant SENDER_ROLE = keccak256("SENDER_ROLE");
  bytes32 public constant PROVIDER_ROLE = keccak256("PROVIDER_ROLE");

  mapping(bytes32 => bytes) private _sends;
  mapping(bytes32 => bytes) private _receives;

  mapping(CrossChainProvider.CrossChainProvider => address) private _providers;

  function initialize() public initializer {
    __Registry_init();
  }

  function __Registry_init() internal onlyInitializing {
    __Registry_init_unchained();
    __UUPSUpgradeable_init();
    __AccessControl_init();
    __ERC165_init();
  }

  function __Registry_init_unchained() internal onlyInitializing {
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _grantRole(ADMIN_ROLE, _msgSender());
  }

  function send(
    CrossChainProvider.CrossChainProvider provider,
    uint16 chainId,
    address target,
    bytes calldata ews // abi.encodeWithSignature();
  ) public payable {
    require(hasRole(SENDER_ROLE, _msgSender()), "ONLY_SENDER");
    bytes memory payload = abi.encode(target, ews);

    bytes32 ref = keccak256(payload);
    _sends[ref] = payload;
    emit Sent(provider, ref);

    if (provider == CrossChainProvider.CrossChainProvider.LAYERZERO && _providers[provider] != address(0)) {
      LayerZeroProvider(_providers[provider]).send{ value: msg.value }(address(this), chainId, payload, payable(_msgSender()), address(this), new bytes(0));
    } else {
      revert("Empty provider");
    }
  }

  function receive_(CrossChainProvider.CrossChainProvider provider, bytes calldata payload) public {
    require(hasRole(PROVIDER_ROLE, _msgSender()), "ONLY_PROVIDER");
    bytes32 ref = keccak256(payload);
    _receives[ref] = payload;
    emit Received(provider, ref);

    // (bytes memory targetAddressBytes, bytes memory ews) = abi.decode(payload, (bytes, bytes));
    // address target;
    // assembly {
    //   target := mload(add(targetAddressBytes, 20))
    // }
    // (bool success, ) = target.call(ews);
  }

  function getProvider(CrossChainProvider.CrossChainProvider provider) public view returns (address) {
    return _providers[provider];
  }

  function setProvider(CrossChainProvider.CrossChainProvider provider, address address_) public {
    require(hasRole(ADMIN_ROLE, _msgSender()), "ONLY_ADMIN");
    _providers[provider] = address_;
  }

  function getReceived(bytes32 ref) public view returns (bytes memory) {
    return _receives[ref];
  }

  function getSends(bytes32 ref) public view returns (bytes memory) {
    return _sends[ref];
  }

  /* ========== UUPS ==========*/
  function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}
}
