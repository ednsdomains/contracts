pragma solidity >=0.8.4;

import "./BaseRegistrarImplementation.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../resolvers/Resolver.sol";
import "./StringUtils.sol";
import "hardhat/console.sol";

contract EDNSRegistrarController is Ownable{
    using StringUtils for *;

    bytes4 constant private INTERFACE_META_ID = bytes4(keccak256("supportsInterface(bytes4)"));

    event NameRegistered(string name, string indexed tld, bytes32 indexed label, address indexed owner, uint expires);
    event NameRenewed(string name, string indexed tld, bytes32 indexed label, uint expires);

    mapping(bytes => bytes32) tlds;

    BaseRegistrarImplementation private base;

    uint private nameMinimumLengthLimit;
    uint private nameMaximumLengthLimit;

    constructor(BaseRegistrarImplementation _base) {
        base = _base;
    }

    function setNameLengthLimit(uint minimum, uint maximum) public onlyOwner{
        nameMinimumLengthLimit = minimum;
        nameMaximumLengthLimit = maximum;
    }

    function valid(string memory name) public view returns(bool) {
        return name.strlen() >= nameMinimumLengthLimit && name.strlen() <= nameMaximumLengthLimit;
    }

    function available(string memory name, string memory tld) public view returns(bool) {
        require(tldAvailable(tld), "TLD not available");
        bytes32 baseNode = tlds[bytes(tld)];
        bytes32 label = keccak256(bytes(abi.encodePacked(name,baseNode)));
        return valid(name) && base.available(uint256(label));
    }

    function registerWithConfig(string memory name, string memory tld, address owner, uint duration, address resolver, address addr) public onlyOwner {
        require(tldAvailable(tld), "TLD not available");
        bytes32 baseNode = tlds[bytes(tld)];
        bytes32 label = keccak256(bytes(abi.encodePacked(name,baseNode)));
        uint256 tokenId = uint256(label);

        uint expires;
        if(resolver != address(0)) {
            // Set this contract as the (temporary) owner, giving it
            // permission to set up the resolver.
            expires = base.register(tokenId, baseNode, address(this), duration);

            // The nodehash of this label
            bytes32 nodehash = keccak256(abi.encodePacked(baseNode, bytes32(tokenId)));

            // Set the resolver
            base.edns().setResolver(nodehash, resolver);

            // Configure the resolver
            if (addr != address(0)) {
                Resolver(resolver).setAddr(nodehash, addr);
            }

            // Now transfer full ownership to the expeceted owner
            base.reclaim(tokenId, baseNode, owner);
            base.transferFrom(address(this), owner, tokenId);
        } else {
            require(addr == address(0));
            expires = base.register(tokenId, baseNode, owner, duration);
        }

        emit NameRegistered(name, tld, label, owner, expires);
    }

    function renew(string calldata name, string calldata tld, uint duration) external onlyOwner() {
        require(tldAvailable(tld), "TLD not available");
        bytes32 baseNode = tlds[bytes(tld)];
        bytes32 label = keccak256(bytes(abi.encodePacked(name,tld)));
        uint256 tokenId = uint256(label);
        uint expires = base.renew(tokenId, baseNode, duration);
        emit NameRenewed(name, tld, label, expires);
    }

    function supportsInterface(bytes4 interfaceID) external pure returns (bool) {
        return interfaceID == INTERFACE_META_ID;
    }

    function setTld(string memory tld, bytes32 nodehash) public virtual onlyOwner {
        tlds[bytes(tld)] = nodehash;
    }

    function tldAvailable(string memory tld) public view virtual returns(bool){
        bytes32 baseNode = tlds[bytes(tld)];
        return base.baseNodeAvailable(baseNode);
    }

}