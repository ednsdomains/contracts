//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface ITokenPriceOracle {
  event SetApiUrl(string url);
  event GetTokenPriceInUsd(bytes32 indexed requestId, uint256 amount);

  function setApiUrl(string memory url) external;

  function requestTokenPriceInUsd() external;

  function getTokenPriceInUsd() external view returns (uint256);
}
