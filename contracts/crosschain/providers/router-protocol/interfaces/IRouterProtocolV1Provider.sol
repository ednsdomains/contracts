// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "../../interfaces/IBaseProvider.sol";

interface IRouterProtocolV1Provider is IBaseProvider {
  function setFeeToken(address _address) external;

  function getFeeToken(address user) external view returns (address);

  function setHandler(address _handler) external;

  function getHandler() external view returns (address);

  function routerReply(uint8 srcChainID, address srcAddress, bytes memory data) external;
}
