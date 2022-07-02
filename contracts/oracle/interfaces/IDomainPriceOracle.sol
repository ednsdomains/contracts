//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IDomainPriceOracle {
  // function price(string memory domain, uint256 expiry) external returns (uint256);

  function price(
    bytes memory domain,
    bytes32 tld,
    uint256 durations
  ) external view returns (uint256);
}
