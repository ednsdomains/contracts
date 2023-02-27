// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "../../diamond/upgradeInitializers/DiamondInit.sol";

contract RegistryInit is DiamondInit {
  function init() external {
    _init();
  }
}
