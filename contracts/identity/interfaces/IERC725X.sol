// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.13;

// ERC165 identifier: `0x7545acac`
/* is ERC165, ERC173 */ interface IERC725X {
  event Executed(uint256 indexed operationType, address indexed target, uint256 indexed value, bytes4 data);
  event ContractCreated(uint256 indexed operationType, address indexed contractAddress, uint256 indexed value, bytes32 salt);

  function execute(uint256 operationType, address target, uint256 value, bytes memory data) external payable returns (bytes memory);

  function executeBatch(uint256[] memory operationsType, address[] memory targets, uint256[] memory values, bytes memory datas) external payable returns (bytes[] memory);
}
