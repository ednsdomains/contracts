//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/utils/introspection/IERC165Upgradeable.sol";

// https://github.com/LayerZero-Labs/solidity-examples/blob/main/contracts/token/oft/IOFTCore.sol

interface IToken is IERC165Upgradeable {
  function estimateBridgeFee(uint16 dstChainId, uint256 amount) external view returns (uint256 nativeFee, uint256 zroFee);

  function bridge(
    address from,
    address to,
    address payable refundAddress,
    uint16 dstChainId,
    uint256 amount
  ) external payable;

  function locked() external view returns (uint256);
}
