//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";

interface IBaseRegistrar is IERC721Upgradeable {
  // event ControllerAdded(address controller, bytes tld);
  // event ControllerRemoved(address controller, bytes tld);

  event DomainRegistered(bytes domain, bytes tld, address owner, uint256 expiry);
  event DomainRenewed(bytes domain, bytes tld, uint256 expiry);
  event DomainReclaimed(bytes domain, bytes tld, address owner);

  event SetController(bytes tld, address controller, bool approved);

  function expiry(bytes calldata domain, bytes calldata tld) external view returns (uint256);

  function available(bytes calldata tld) external view returns (bool);

  function available(bytes calldata domain, bytes calldata tld) external view returns (bool);

  function ownerOf(bytes calldata domain, bytes calldata tld) external view returns (address);

  function exists(bytes calldata domain, bytes calldata tld) external view returns (bool);

  function exists(bytes32 tld) external view returns (bool);

  function controllerApproved(bytes32 tld, address controller) external view returns (bool);

  function setControllerApproval(
    bytes calldata tld,
    address controller,
    bool approved
  ) external;

  function register(
    bytes calldata domain,
    bytes calldata tld,
    address owner,
    uint256 durations
  ) external;

  function renew(
    bytes calldata domain,
    bytes calldata tld,
    uint256 durations
  ) external;

  function reclaim(
    bytes calldata domain,
    bytes calldata tld,
    address owner
  ) external;

  function tokenId(bytes calldata domain, bytes calldata tld) external pure returns (uint256);
}
