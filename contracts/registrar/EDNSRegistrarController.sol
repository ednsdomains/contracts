pragma solidity >=0.8.4;

import "./BaseRegistrarImplementation.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../resolvers/Resolver.sol";
import "./StringUtils.sol";

contract EDNSRegistrarController is Ownable{
    using StringUtils for *;

    bytes4 constant private INTERFACE_META_ID = bytes4(keccak256("supportsInterface(bytes4)"));

    event NameRegistered(string name, bytes32 node, bytes32 indexed label, address indexed owner, uint expires);
    event NameRenewed(string name, bytes32 node, bytes32 indexed label, uint expires);

    BaseRegistrarImplementation base;

    mapping(string => bytes32) public tlds;

    constructor(BaseRegistrarImplementation _base) public {
        base = _base;
    }

    // name = alice
    // node = namehash(eth)
    function valid(string memory name) public pure returns(bool) {
        return name.strlen() >= 5;
    }

    function available(string memory name, string memory tld) public view returns(bool) {
        require(tlds[tld].length > 0);
        bytes32 node = tlds[tld];
        bytes32 label = keccak256(bytes(name));
        return valid(name) && base.available(uint256(label), node);
    }

    function registerWithConfig(string memory name, bytes32 node, address owner, uint duration, address resolver, address addr) public onlyOwner {
        require(base.nodeExist(node));
        bytes32 label = keccak256(bytes(name));
        uint256 tokenId = uint256(label);

        uint expires;
        if(resolver != address(0)) {
            // Set this contract as the (temporary) owner, giving it
            // permission to set up the resolver.
            expires = base.register(tokenId, node, address(this), duration);

            // The nodehash of this label
            bytes32 nodehash = keccak256(abi.encodePacked(node, label));

            // Set the resolver
            base.edns().setResolver(nodehash, resolver);

            // Configure the resolver
            if (addr != address(0)) {
                Resolver(resolver).setAddr(nodehash, addr);
            }

            // Now transfer full ownership to the expeceted owner
            base.reclaim(tokenId, node, owner);
            base.transferFrom(address(this), owner, tokenId);
        } else {
            require(addr == address(0));
            expires = base.register(tokenId, node, owner, duration);
        }

        emit NameRegistered(name, node, label, owner, expires);
    }

    function renew(string calldata name, bytes32 node, uint duration) external onlyOwner() {
        bytes32 label = keccak256(bytes(name));
        uint expires = base.renew(uint256(label), node, duration);
        emit NameRenewed(name, node, label, expires);
    }

    function supportsInterface(bytes4 interfaceID) external pure returns (bool) {
        return interfaceID == INTERFACE_META_ID;
    }

    function addTld(string memory name, bytes32 node) public onlyOwner {

    }

}