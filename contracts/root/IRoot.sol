//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IRoot {
  function register(
    string memory tld,
    address resolver,
    bool enable_,
    bool omni_
  ) external;

  function transfer(string memory tld) external;

  function reclaim(string memory tld) external;

  function setEnable(string memory tld, bool enable) external;

  function setResolver(string memory tld, address resolver) external;

  function setControllerApproval(
    string memory tld,
    address controller,
    bool approved
  ) external;

  function enable(string memory tld) external view returns (bool);

  function omni(string memory tld) external view returns (bool);

  function resolver(string memory tld) external view returns (address);
}
