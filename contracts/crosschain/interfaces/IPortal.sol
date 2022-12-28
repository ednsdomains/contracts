//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../../lib/CrossChainProvider.sol";

interface IPortal {
  function send(
    CrossChainProvider.CrossChainProvider provider,
    uint256 chainId,
    address target,
    bytes calldata payload
  ) external;

  function callback() external;
}
