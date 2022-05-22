//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155Upgradeable.sol";

// import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

interface IRegisrar is IERC1155Upgradeable {
    // Logged when a new Controller has been added
    event ControllerAdded(address indexed controller, string tld);
    // Logged when an existing Controller has been removed
    event ControllerRemoved(address indexed controller, string tld);
    // Logged when a new domain has been registered
    event DomainRegistered(
        uint256 indexed id,
        address indexed owner,
        string name,
        string tld,
        uint256 expiry
    );
    // Logged when a token has been renewed
    event DomainRenewed(
        uint256 indexed id,
        string name,
        string tld,
        uint256 expiry
    );

    // Return the expiry date in unix timestamp format of the domain
    function expiry(uint256 id) external view returns (uint256);

    // Return true if the specified name is available for registration
    function available(uint256 id) external view returns (bool);

    // Return the owner of the domain
    function ownerOf(uint256 id) external view returns (address);

    // Authorises a controller, which can register and renew domains
    function addController(address controller) external;

    // Revoke controller permission for an address
    function removeController(address controller) external;

    // Set the resolver for the TLD this registrar manages
    function setResolver(bytes32 node, address resolver) external;

    function registerDomain(
        uint256 id,
        bytes32 node,
        address owner,
        uint256 duration
    ) external returns (uint256);

    function renewDomain(
        uint256 id,
        bytes32 node,
        uint256 duration
    ) external returns (uint256);

    function reclaimDomain(
        uint256 id,
        bytes32 node,
        address owner
    ) external;
}
