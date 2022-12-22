//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../../lib/Chain.sol";
import "../../lib/CrossChainProvider.sol";

interface IBridge {
  function bridge(
    Chain.Chain chain,
    CrossChainProvider.CrossChainProvider provider,
    bytes32 name,
    bytes32 tld,
    address owner,
    uint256 expires
  ) external;
}
