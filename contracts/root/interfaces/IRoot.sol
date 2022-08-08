//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IRoot {
  function register(
    bytes memory tld,
    address resolver,
    bool enable_,
    bool omni_,
    uint16[] memory lzChainIds
  ) external payable;

  function transfer(bytes memory tld) external;

  function reclaim(bytes memory tld) external;

  function setEnable(bytes memory tld, bool enable) external payable;

  function setResolver(bytes memory tld, address resolver) external payable;

  function setControllerApproval(
    bytes memory tld,
    address controller,
    bool approved
  ) external;

  function isEnable(bytes memory tld) external view returns (bool);

  function isOmni(bytes memory tld) external view returns (bool);

  function getResolver(bytes memory tld) external view returns (address);
}
