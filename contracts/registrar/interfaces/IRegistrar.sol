//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IRegistrar {
  // event ControllerAdded(address controller, bytes tld);
  // event ControllerRemoved(address controller, bytes tld);

  event DomainRegistered(bytes name, bytes tld, address owner, uint256 expires);
  event DomainRenewed(bytes name, bytes tld, uint256 expires);
  event DomainReclaimed(bytes name, bytes tld, address owner);

  event SetController(bytes tld, address controller, bool approved);

  function getExpires(bytes memory name, bytes memory tld) external view returns (uint256);

  function isAvailable(bytes memory tld) external view returns (bool);

  function isAvailable(bytes memory name, bytes memory tld) external view returns (bool);

  function isExists(bytes memory name, bytes memory tld) external view returns (bool);

  function isExists(bytes32 tld) external view returns (bool);

  function isControllerApproved(bytes32 tld, address controller) external view returns (bool);

  function setControllerApproval(
    bytes memory tld,
    address controller,
    bool approved
  ) external;

  function register(
    bytes memory name,
    bytes memory tld,
    address owner,
    uint64 expires
  ) external;

  function renew(
    bytes memory name,
    bytes memory tld,
    uint64 expires
  ) external;

  // function reclaim(
  //   bytes memory name,
  //   bytes memory tld,
  //   address owner
  // ) external;

  // function tokenId(bytes memory name, bytes memory tld) external pure returns (uint256);
}
