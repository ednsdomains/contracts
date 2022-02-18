pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "../registry/EDNS.sol";
import "./BaseRegistrar.sol";

contract BaseRegistrarImplementation is ERC721, BaseRegistrar  {
    // A map of expiry times
    mapping(bytes32=>mapping(uint256=>uint)) expiries;

    string private BASE_URI;

    bytes4 constant private INTERFACE_META_ID = bytes4(keccak256("supportsInterface(bytes4)"));
    bytes4 constant private ERC721_ID = bytes4(
        keccak256("balanceOf(address)") ^
        keccak256("ownerOf(uint256)") ^
        keccak256("approve(address,uint256)") ^
        keccak256("getApproved(uint256)") ^
        keccak256("setApprovalForAll(address,bool)") ^
        keccak256("isApprovedForAll(address,address)") ^
        keccak256("transferFrom(address,address,uint256)") ^
        keccak256("safeTransferFrom(address,address,uint256)") ^
        keccak256("safeTransferFrom(address,address,uint256,bytes)")
    );
    bytes4 constant private RECLAIM_ID = bytes4(keccak256("reclaim(uint256,address)"));

    function _setBaseURI(string memory baseURI) internal virtual {
        BASE_URI = baseURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override(ERC721) returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, "/", this, "/", tokenId)) : "";
    }

    function _baseURI()
        internal
        view
        override(ERC721)
        returns(string memory)
    {
        return BASE_URI;
    }

    /**
     * v2.1.3 version of _isApprovedOrOwner which calls ownerOf(tokenId) and takes grace period into consideration instead of ERC721.ownerOf(tokenId);
     * https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.1.3/contracts/token/ERC721/ERC721.sol#L187
     * @dev Returns whether the given spender can transfer a given token ID
     * @param spender address of the spender to query
     * @param tokenId uint256 ID of the token to be transferred
     * @return bool whether the msg.sender is approved for the given token ID,
     *    is an operator of the owner, or is the owner of the token
     */
    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view override returns (bool) {
        address owner = ownerOf(tokenId);
        return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender));
    }

    constructor(EDNS _edns) ERC721("","") {
        edns = _edns;
    }

    modifier live(bytes32 node) {
        require(baseNodes[node]);
        require(edns.owner(node) == address(this));
        _;
    }

    modifier onlyController {
        require(controllers[msg.sender]);
        _;
    }

    /**
     * @dev Gets the owner of the specified token ID. Names become unowned
     *      when their registration expires.
     * @param tokenId uint256 ID of the token to query the owner of
     * @return address currently marked as the owner of the given token ID
     */
    function ownerOf(bytes32 node, uint256 tokenId) public view live(node) returns (address) {
        require(expiries[node][tokenId] > block.timestamp);
        return super.ownerOf(tokenId);
    }

    // Authorises a controller, who can register and renew domains.
    function addController(address controller) external override onlyOwner {
        controllers[controller] = true;
        emit ControllerAdded(controller);
    }

    // Revoke controller permission for an address.
    function removeController(address controller) external override onlyOwner {
        controllers[controller] = false;
        emit ControllerRemoved(controller);
    }

    // Set the resolver for the TLD this registrar manages.
    function setResolver(bytes32 node, address resolver) external override onlyOwner live(node)   {
        edns.setResolver(node, resolver);
    }

    // Returns the expiration timestamp of the specified id.
    function nameExpires(uint256 id, bytes32 node) external live(node) view override returns(uint) {
        return expiries[node][id];
    }

    // Returns true iff the specified name is available for registration.
    function available(uint256 id, bytes32 node) public live(node) view override returns(bool) {
        // Not available if it's registered here or in its grace period.
        return expiries[node][id] + GRACE_PERIOD < block.timestamp;
    }

    /**
     * @dev Register a name.
     * @param id The token ID (keccak256 of the label).
     * @param owner The address that should own the registration.
     * @param duration Duration in seconds for the registration.
     */
    function register(uint256 id, bytes32 node, address owner, uint duration) external override live(node) returns(uint) {
        return _register(id, node, owner, duration, true);
    }

    /**
     * @dev Register a name, without modifying the registry.
     * @param id The token ID (keccak256 of the label).
     * @param owner The address that should own the registration.
     * @param duration Duration in seconds for the registration.
     */
    function registerOnly(uint256 id, bytes32 node, address owner, uint duration) external returns(uint) {
        return _register(id, node, owner, duration, false);
    }

    function _register(uint256 id, bytes32 node, address owner, uint duration, bool updateRegistry) internal live(node) onlyController returns(uint) {
        require(available(id, node));
        require(block.timestamp + duration + GRACE_PERIOD > block.timestamp + GRACE_PERIOD); // Prevent future overflow

        expiries[node][id] = block.timestamp + duration;
        if(_exists(id)) {
            // Name was previously owned, and expired
            _burn(id);
        }
        _mint(owner, id);
        if(updateRegistry) {
            edns.setSubnodeOwner(node, bytes32(id), owner);
        }

        emit NameRegistered(id, node, owner, block.timestamp + duration);

        return block.timestamp + duration;
    }

    function renew(uint256 id, bytes32 node, uint duration) external override live(node) onlyController returns(uint) {
        require(expiries[node][id] + GRACE_PERIOD >= block.timestamp); // Name must be registered here or in grace period
        require(expiries[node][id] + duration + GRACE_PERIOD > duration + GRACE_PERIOD); // Prevent future overflow

        expiries[node][id] += duration;
        emit NameRenewed(id, node, expiries[node][id]);
        return expiries[node][id];
    }

    /**
     * @dev Reclaim ownership of a name in EDNS, if you own it in the registrar.
     */
    function reclaim(uint256 id, bytes32 node, address owner) external override live(node) {
        require(_isApprovedOrOwner(msg.sender, id));
        edns.setSubnodeOwner(node, bytes32(id), owner);
    }

    function setNode(bytes32 node) external override{
        require(!baseNodes[node]);
        baseNodes[node] = true;
    }

    function nodeExist(bytes32 node) external view override returns(bool){
        return baseNodes[node];
    }

    function supportsInterface(bytes4 interfaceID) public override(ERC721, IERC165) view returns (bool) {
        return interfaceID == INTERFACE_META_ID ||
            interfaceID == ERC721_ID ||
            interfaceID == RECLAIM_ID;
    }
}