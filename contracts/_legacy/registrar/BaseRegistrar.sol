pragma solidity ^0.8.4;

import "../registry/EDNS.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

abstract contract BaseRegistrar is OwnableUpgradeable, IERC721Upgradeable {
    uint constant public GRACE_PERIOD = 90 days;

    event ControllerAdded(address indexed controller);
    event ControllerRemoved(address indexed controller);
    event NameMigrated(uint256 indexed id, address indexed owner, uint expires);
    event NameRegistered(uint256 indexed id, address indexed owner, uint expires);
    event NameRenewed(uint256 indexed id, uint expires);

    // The EDNS registry
    EDNS public edns;

    // The namehash of the TLDs this registrar owns (eg, .edns)
    mapping(bytes32=>bool) public baseNodes;

    // A map of addresses that are authorised to register and renew names.
    mapping(address=>bool) public controllers;

    // Authorises a controller, who can register and renew domains.
    function addController(address controller) virtual external;

    // Revoke controller permission for an address.
    function removeController(address controller) virtual external;

    // Set the resolver for the TLD this registrar manages.
    function setResolver(bytes32 node, address resolver) virtual external;

    // Returns the expiration timestamp of the specified label hash.
    function nameExpires(uint256 id) virtual external view returns(uint);

    // Returns true iff the specified name is available for registration.
    function available(uint256 id) virtual public view returns(bool);

    /**
     * @dev Register a name.
     */
    function register(uint256 id, bytes32 node, address owner, uint duration) virtual external returns(uint);

    function renew(uint256 id, bytes32 node, uint duration) virtual external returns(uint);
    
    function setBaseNode(bytes32 nodehash, bool available) public virtual;

    function baseNodeAvailable(bytes32 nodehash) public virtual view returns(bool);

    /**
     * @dev Reclaim ownership of a name in EDNS, if you own it in the registrar.
     */
    function reclaim(uint256 id, bytes32 node, address owner) virtual external;
}