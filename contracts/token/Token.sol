//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC20/presets/ERC20PresetMinterPauserUpgradeable.sol";
import "../layerzero/NonBlockingLayerZeroApp.sol";
import "./IToken.sol";

contract Token is IToken, ERC20PresetMinterPauserUpgradeable, NonBlockingLayerZeroApp {
  event InboundBridged(uint16 srcChainId, address to, uint256 amount, uint64 nonce);
  event OutboundBridged(uint16 dstChainId, address from, address to, uint256 amount, uint64 nonce);

  event Locked(address from, uint256 amount);
  event Unlocked(address to, uint256 amount);

  uint256 private _lockedBalance = 0;

  uint16 public chainId; // The current chain ID in LayerZero

  function initialize(uint16 lzChainId) public initializer {
    __Token_init(lzChainId);
    __ERC20PresetMinterPauser_init("Omni Name Service", "OMNS");
  }

  function __Token_init(uint16 lzChainId) internal onlyInitializing {
    __Token_init_unchained(lzChainId);
  }

  function __Token_init_unchained(uint16 lzChainId) internal onlyInitializing {
    _setRoleAdmin(MINTER_ROLE, DEFAULT_ADMIN_ROLE);
    _setRoleAdmin(PAUSER_ROLE, DEFAULT_ADMIN_ROLE);
    chainId = lzChainId;
  }

  function decimals() public pure override returns (uint8) {
    return 8;
  }

  function estimateBridgeFee(uint16 dstChainId, uint256 amount) public view returns (uint256 nativeFee, uint256 zroFee) {
    bytes memory payload = abi.encode(_msgSender(), amount);
    return lzEndpoint.estimateFees(dstChainId, address(this), payload, false, "");
  }

  function bridge(
    address from,
    address to,
    uint16 dstChainId,
    uint256 amount
  ) public payable {
    _lock(from, amount);
    bytes memory payload = abi.encode(to, amount);
    _lzSend(dstChainId, payload, payable(_msgSender()), address(0x0), "");
    uint64 nonce = lzEndpoint.getOutboundNonce(dstChainId, address(this));
    emit OutboundBridged(dstChainId, from, to, amount, nonce);
  }

  function _nonblockingLzReceive(
    uint16 srcChainId,
    bytes memory, // srcAddress
    uint64 nonce,
    bytes memory payload
  ) internal virtual override {
    (bytes memory toBytes, uint256 amount) = abi.decode(payload, (bytes, uint256));
    address to;
    assembly {
      to := mload(add(toBytes, 20))
    }
    _unlock(to, amount);
    emit InboundBridged(srcChainId, to, amount, nonce);
  }

  function _lock(address from, uint256 amount) internal {
    transferFrom(from, address(this), amount);
    _lockedBalance += amount;
    emit Locked(from, amount);
  }

  function _unlock(address to, uint256 amount) internal {
    _transfer(address(this), to, amount);
    _lockedBalance -= amount;
    emit Unlocked(to, amount);
  }

  function locked() public view returns (uint256) {
    return _lockedBalance;
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControlEnumerableUpgradeable, IERC165Upgradeable) returns (bool) {
    return interfaceId == type(IToken).interfaceId || super.supportsInterface(interfaceId);
  }
}
