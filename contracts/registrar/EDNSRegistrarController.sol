pragma solidity ^0.8.10;

import "./BaseRegistrarImplementation.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "../resolvers/Resolver.sol";
import "./StringUtils.sol";
import "../rewarding/IAffiliateProgram.sol";

contract EDNSRegistrarController is AccessControlEnumerable{
    using StringUtils for *;

    bytes4 constant private INTERFACE_META_ID = bytes4(keccak256("supportsInterface(bytes4)"));
    bytes4 constant private ACCESS_CONTROL_ENUMERABLE_ID = bytes4(
        keccak256("getRoleMember(bytes32,uint256)") ^
        keccak256("getRoleMemberCount(bytes32)")
    );

    event NameRegistered(string name, bytes indexed tld, bytes32 indexed label, address indexed owner, uint expires);
    event NameRenewed(string name, bytes indexed tld, bytes32 indexed label, uint expires);

    mapping(bytes => bytes32) public tlds;

    mapping(address => bool) private _operators;

    BaseRegistrarImplementation private base;

    uint private nameMinimumLengthLimit;
    uint private nameMaximumLengthLimit;

    IAffiliateProgram private _affiliateProgram;

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    constructor(BaseRegistrarImplementation _base) {
        base = _base;
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(OPERATOR_ROLE, _msgSender());
    }

    function setAffiliateProgram(IAffiliateProgram _program) public{
        require(hasRole(OPERATOR_ROLE, _msgSender()), "Forbidden access");
        _affiliateProgram = _program;
    }

    function setNameLengthLimit(uint minimum, uint maximum) public{
        require(hasRole(OPERATOR_ROLE, _msgSender()), "Forbidden access");
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

    function registerWithConfig(string memory name, string memory tld, address owner, uint duration, address resolver, address addr, bytes32 affiliate) public {
        require(hasRole(OPERATOR_ROLE, _msgSender()), "Forbidden access");
        require(tldAvailable(tld), "TLD not available");
        bytes32 baseNode = tlds[bytes(tld)];
        bytes32 label = keccak256(bytes(abi.encodePacked(name,baseNode)));
        uint256 tokenId = uint256(label);

        uint expires;
        if(resolver != address(0)) {
            // Set this contract as the (temporary) owner, giving it
            // permission to set up the resolver.
            expires = base.register(tokenId, baseNode, address(this), duration);
            if(address(_affiliateProgram) != address(0) && affiliate != 0x0){
                if(_affiliateProgram.allowRewarding()){
                    
                }
            }

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

        emit NameRegistered(name, bytes(tld), label, owner, expires);
    }

    function renew(string calldata name, string calldata tld, uint duration) public {
        require(hasRole(OPERATOR_ROLE, _msgSender()), "Forbidden access");
        require(tldAvailable(tld), "TLD not available");

        bytes32 baseNode = tlds[bytes(tld)];
        bytes32 label = keccak256(bytes(abi.encodePacked(name,tld)));
        uint256 tokenId = uint256(label);
        uint expires = base.renew(tokenId, baseNode, duration);
        emit NameRenewed(name, bytes(tld), label, expires);
    }

    function supportsInterface(bytes4 interfaceID) public override(AccessControlEnumerable) pure returns (bool) {
        return interfaceID == INTERFACE_META_ID || interfaceID == ACCESS_CONTROL_ENUMERABLE_ID;
    }

    function setTld(string memory tld, bytes32 nodehash) public virtual {
        require(hasRole(OPERATOR_ROLE, _msgSender()), "Forbidden access");
        
        tlds[bytes(tld)] = nodehash;
    }

    function tldAvailable(string memory tld) public view virtual returns(bool){
        bytes32 baseNode = tlds[bytes(tld)];
        return base.baseNodeAvailable(baseNode);
    }

}