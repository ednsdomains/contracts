//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IRegistrar {
  event DomainRegistered(bytes name, bytes tld, address owner, uint256 expiry);
  event DomainRenewed(bytes name, bytes tld, uint256 expiry);
  event DomainReclaimed(bytes name, bytes tld, address owner);

  event SetController(bytes32 tld, address controller, bool approved);

  function getExpiry(bytes memory name, bytes memory tld) external view returns (uint256);

  function isAvailable(bytes memory tld) external view returns (bool);

  function isAvailable(bytes memory name, bytes memory tld) external view returns (bool);

  function isExists(bytes memory name, bytes memory tld) external view returns (bool);

  function isExists(bytes32 tld) external view returns (bool);

  function isControllerApproved(bytes32 tld, address controller) external view returns (bool);

  function setControllerApproval(
    bytes32 tld,
    address controller,
    bool approved
  ) external;

  function register(
    bytes memory name,
    bytes memory tld,
    address owner,
    uint64 expiry
  ) external;

  function renew(
    bytes memory name,
    bytes memory tld,
    uint64 expiry
  ) external;

  // function reclaim(
  //   bytes memory name,
  //   bytes memory tld,
  //   address owner
  // ) external;

  // function tokenId(bytes memory name, bytes memory tld) external pure returns (uint256);
}
