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

  mapping(CrossChainProvider.CrossChainProvider => address) private _providers;

  function initialize() public initializer {
    __Portal_init();
  }

  function __Portal_init() internal onlyInitializing {
    __Portal_init_unchained();
    __UUPSUpgradeable_init();
    __AccessControl_init();
    __ERC165_init();
  }

  function __Portal_init_unchained() internal onlyInitializing {
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _grantRole(ADMIN_ROLE, _msgSender());
  }

  function send(
    CrossChainProvider.CrossChainProvider provider,
    address payable sender,
    uint16 dstChainId,
    bytes calldata payload // abi.encode(target_contract_address, abi.encodeWithSignature())
  ) public payable onlyRole(SENDER_ROLE) {
    if (provider == CrossChainProvider.CrossChainProvider.LAYERZERO && _providers[provider] != address(0)) {
      LayerZeroProvider(_providers[provider]).send{ value: msg.value }(sender, dstChainId, payload, new bytes(0));
    } else {
      revert("Empty provider");
    }

    emit Sent(provider, sender, dstChainId, payload);
  }

  function receive_(CrossChainProvider.CrossChainProvider provider, bytes calldata payload) public onlyRole(PROVIDER_ROLE) {
    emit Received(provider, payload);

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

  function setProvider(CrossChainProvider.CrossChainProvider provider, address address_) public onlyRole(ADMIN_ROLE) {
    _providers[provider] = address_;
  }

  /* ========== UUPS ==========*/
  function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}
}
