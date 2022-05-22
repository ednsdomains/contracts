//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./IRegistrar.sol";
import "./IRegistry.sol";

error Unauthorized();
error InvalidDomainName(string name);

contract Registrar is
    ERC1155Upgradeable,
    ERC2981Upgradeable,
    OwnableUpgradeable,
    IRegisrar
{
    uint256 public constant GRACE_PERIOD = 90 days;
    using StringsUpgradeable for uint256;
    mapping(uint256 => uint256) private _expiries;
    mapping(uint256 => address) private _owners;
    mapping(address => bool) public controllers;
    IRegistry public registry;

    function initialize(IRegistry registry_) public initializer {
        __Registrar_init(registry_);
    }

    function __Registrar_init(IRegistry registry_) internal onlyInitializing {
        __Registrar_init_unchained(registry_);
        __ERC1155_init_unchained("");
        __Ownable_init_unchained();
    }

    function __Registrar_init_unchained(IRegistry registry_)
        internal
        onlyInitializing
    {
        registry_ = registry;
    }

    // function setURI(string memory uri_) public virtual onlyOwner {
    //     _setURI(uri_);
    // }

    // function uri(uint256 tokenId)
    //     public
    //     view
    //     virtual
    //     override(ERC1155Upgradeable)
    //     returns (string memory)
    // {
    //     require(exists(tokenId), "404 Token Not Found");
    //     return
    //         bytes(_uri).length > 0
    //             ? string(abi.encodePacked(_uri, tokenId.toString()))
    //             : "";
    // }

    // function _isOwner(address spender, uint256 tokenId)
    //     internal
    //     view
    //     override
    //     returns (bool)
    // {
    //     return this.balanceOf(spender, id) === 1;
    // }

    // function _isApprovedOrOwner(address spender, uint256 tokenId)
    //     internal
    //     view
    //     override
    //     returns (bool)
    // {
    //     address owner = ownerOf(tokenId);
    //     return (spender == owner ||
    //         getApproved(tokenId) == spender ||
    //         isApprovedForAll(owner, spender));
    // }

    // modifier live(bytes32 node) {
    //     require(edns.owner(node) == address(this));
    //     _;
    // }

    modifier onlyNodeOwner(bytes32 node) {
        address owner = registry.owner(node);
        require(owner == address(0x0) || owner == msg.sender, "403 Forbidden");
        _;
    }

    modifier onlyController() {
        require(controllers[msg.sender], "403 Forbidden");
        _;
    }

    // https://ethereum.stackexchange.com/questions/50369/string-validation-solidity-alpha-numeric-and-length
    modifier valid(string memory name) {
        require(bytes(name).length > 0, "400 Invalid Length");
        bytes memory b = bytes(name);
        for (uint256 i; i < b.length; i++) {
            bytes1 char = b[i];
            require(char != 0x2E, "400 Invalid Character");
        }
        _;
    }

    modifier exists(uint256 id) {
        require(_owners[id] != address(0), "404 Not Exist");
        _;
    }

    function _exists(uint256 id) internal view returns (bool) {
        return _owners[id] != address(0);
    }

    function expiry(uint256 id) external view override returns (uint256) {
        return _expiries[id];
    }

    function available(uint256 id) public view override returns (bool) {
        return _expiries[id] + GRACE_PERIOD < block.timestamp;
    }

    function ownerOf(uint256 id) public view exists(id) returns (address) {
        return registry.owner(bytes32(id));
    }

    function addController(address controller) external override onlyOwner {
        controllers[controller] = true;
        emit ControllerAdded(controller);
    }

    function removeController(address controller) external override onlyOwner {
        controllers[controller] = false;
        emit ControllerRemoved(controller);
    }

    function setResolver(bytes32 node, address resolver)
        external
        override
        onlyOwner
    {
        registry.setResolver(node, resolver);
    }

    function registerDomain(
        uint256 id,
        bytes32 node,
        address owner,
        uint256 duration,
        bool updateRegistry
    ) internal onlyController returns (uint256) {
        require(available(id), "503 Domain Not Available");
        require(
            block.timestamp + duration + GRACE_PERIOD >
                block.timestamp + GRACE_PERIOD,
            "400 Duration Too Short"
        );
        _expiries[id] = block.timestamp + duration;
        if (_exists(id)) {
            _burn(owner, id, 1);
        }
        _mint(owner, id, 1, "");
        if (updateRegistry) {
            registry.setSubnodeOwner(node, bytes32(id), owner);
        }

        emit NameRegistered(id, owner, block.timestamp + duration);

        return block.timestamp + duration;
    }

    function renewDomain(
        uint256 id,
        bytes32 node,
        uint256 duration
    ) external override onlyController returns (uint256) {
        require(
            _expiries[id] + GRACE_PERIOD >= block.timestamp,
            "500 Domain Expired"
        );
        require(
            _expiries[id] + duration + GRACE_PERIOD > duration + GRACE_PERIOD,
            "400 Duration Too Short"
        );

        _expiries[id] += duration;
        emit NameRenewed(id, _expiries[id]);
        return _expiries[id];
    }

    // function reclaimDomain(
    //     uint256 id,
    //     bytes32 node,
    //     address owner
    // ) external override {
    //     require(onlyNodeOwner(msg.sender, id));
    //     _registry.setSubnodeOwner(node, bytes32(id), owner);
    // }

    function registerTld() external onlyController {}

    // function setBaseNode(bytes32 nodehash, bool _available)
    //     public
    //     virtual
    //     override
    //     onlyOwner
    // {
    //     baseNodes[nodehash] = _available;
    // }

    // function baseNodeAvailable(bytes32 nodehash)
    //     public
    //     view
    //     override
    //     returns (bool)
    // {
    //     return baseNodes[nodehash];
    // }

    // function supportsInterface(bytes4 interfaceID)
    //     public
    //     view
    //     override(ERC721Upgradeable, IERC165Upgradeable)
    //     returns (bool)
    // {
    //     return
    //         interfaceID == INTERFACE_META_ID ||
    //         interfaceID == ERC721_ID ||
    //         interfaceID == RECLAIM_ID;
    // }
}
