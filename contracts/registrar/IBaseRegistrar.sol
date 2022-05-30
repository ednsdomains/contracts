//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";

interface IBaseRegistrar is IERC721Upgradeable {
  // event ControllerAdded(address controller, bytes tld);
  // event ControllerRemoved(address controller, bytes tld);

  event DomainRegistered(bytes domain, bytes tld, address owner, uint256 expiry);
  event DomainRenewed(bytes domain, bytes tld, uint256 expiry);
  event DomainReclaimed(bytes domain, bytes tld, address owner);

  event SetController(bytes tld, address controller, bool approved);

  function expiry(string memory domain, string memory tld) external view returns (uint256);

  function available(string memory domain, string memory tld) external view returns (bool);

  function ownerOf(string memory domain, string memory tld) external view returns (address);

  function exists(string memory domain, string memory tld) external view returns (bool);

  function setControllerApproval(
    string calldata tld,
    address controller,
    bool approved
  ) external;

  function register(
    string calldata domain,
    string calldata tld,
    address owner,
    uint256 duration
  ) external;

  function renew(
    string calldata domain,
    string calldata tld,
    uint256 duration
  ) external;

  function reclaim(
    string calldata domain,
    string calldata tld,
    address owner
  ) external;
}
