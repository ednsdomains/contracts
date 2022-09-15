//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IDomainPriceOracle {
  function setFee(bytes32 tld, uint256 fee) external;

  function getFee(bytes32 tld) external view returns (uint256);

  function setPrice(bytes32 tld, uint256[] memory price_) external;

  function getPrice(
    bytes memory name,
    bytes32 tld,
    uint256 durations
  ) external view returns (uint256);
}
