//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/token/ERC20/presets/ERC20PresetMinterPauserUpgradeable.sol";

contract OMNSToken is ERC20PresetMinterPauserUpgradeable {
  function initialize() public initializer {
    __OMNSToken_init();
    __ERC20PresetMinterPauser_init("Omni Name Service", "OMNS");
  }

  function __OMNSToken_init() internal onlyInitializing {
    __OMNSToken_init_unchained();
  }

  function __OMNSToken_init_unchained() internal onlyInitializing {}

  function decimals() public pure override returns (uint8) {
    return 8;
  }

  function bridge(uint256 dstChainId, uint256 amount) public {}
}
