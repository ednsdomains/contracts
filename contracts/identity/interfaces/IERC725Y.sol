// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.13;

// ERC165 identifier: `0x629aa694`
/* is ERC165, ERC173 */ interface IERC725Y {
  event DataChanged(bytes32 indexed dataKey, bytes dataValue);

  function getData(bytes32 dataKey) external view returns (bytes memory);

  function getDataBatch(bytes32[] memory dataKeys) external view returns (bytes[] memory);

  function setData(bytes32 dataKey, bytes memory dataValue) external;

  function setDataBatch(bytes32[] memory dataKeys, bytes[] memory dataValues) external;
}
