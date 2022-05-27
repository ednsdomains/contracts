//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./IBaseRegistrar.sol";

interface ISingletonRegistrar is IBaseRegistrar {
  function send(string memory fqdn, uint256 chainId) external;

  function retrieve(string memory fqdn, uint256 chainId) external;
}
