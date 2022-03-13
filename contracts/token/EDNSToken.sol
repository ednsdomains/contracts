// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

contract EDNSToken is ERC20PresetMinterPauser {
    constructor(uint256 initialSupply) ERC20PresetMinterPauser("Ether Domain Name Service", "EDNS") {
        _mint(msg.sender, initialSupply);
    }
}