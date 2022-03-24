pragma solidity ^0.8.4;

import "../registry/EDNS.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./Controllable.sol";

contract Root is OwnableUpgradeable, Controllable {
    bytes32 private constant ROOT_NODE = bytes32(0);

    bytes4 private constant INTERFACE_META_ID =
        bytes4(keccak256("supportsInterface(bytes4)"));

    event TLDLocked(bytes32 indexed label);

    EDNS public edns;
    mapping(bytes32 => bool) public locked;


    function initialize(EDNS _edns) public initializer{
        __Root_init(_edns);
    }

    function __Root_init(EDNS _edns) internal onlyInitializing{
        __Root_init_unchained(_edns);
    }

    function __Root_init_unchained(EDNS _edns) internal onlyInitializing{
        edns = _edns;
    }

    function setSubnodeOwner(bytes32 label, address owner)
        external
        onlyController
    {
        require(!locked[label]);
        edns.setSubnodeOwner(ROOT_NODE, label, owner);
    }

    function setResolver(address resolver) external onlyOwner {
        edns.setResolver(ROOT_NODE, resolver);
    }

    function lock(bytes32 label) external onlyOwner {
        emit TLDLocked(label);
        locked[label] = true;
    }

    function supportsInterface(bytes4 interfaceID)
        external
        pure
        returns (bool)
    {
        return interfaceID == INTERFACE_META_ID;
    }
}
