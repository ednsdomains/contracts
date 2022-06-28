//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IRoot {
  function register(
    bytes calldata tld,
    address resolver,
    bool enable_,
    bool omni_
  ) payable external;

  function transfer(bytes calldata tld) external;

  function reclaim(bytes calldata tld) external;

  function setEnable(bytes calldata tld, bool enable) external;

  function setResolver(bytes calldata tld, address resolver) external;

  function setControllerApproval(
    bytes calldata tld,
    address controller,
    bool approved
  ) external;

  function enable(bytes calldata tld) external view returns (bool);

  function omni(bytes calldata tld) external view returns (bool);

  function resolver(bytes calldata tld) external view returns (address);
}
