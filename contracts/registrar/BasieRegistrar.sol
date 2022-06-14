//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "../utils/LabelValidator.sol";
import "./ISingletonRegistrar.sol";
import "../registry/IRegistry.sol";

// TODO: Implement ERC2981 NFT Royalty Standard
contract BasieRegistrar is ISingletonRegistrar, ERC721Upgradeable, ERC2981Upgradeable, AccessControlUpgradeable, LabelValidator {
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant ROOT_ROLE = keccak256("ROOT_ROLE");

  // future preparing for adopting LayerZero
  // uint8 public immutable chainId; // The current chain ID in LZ
  // uint8 public immutable chainIds; // The list of chain IDs in LZ

  mapping(address => mapping(bytes32 => bool))  public controllers;

  IRegistry internal _registry;

  function initialize(IRegistry registry_) public initializer {
    __Registrar_init(registry_);
  }

  function __Registrar_init(IRegistry registry_)  internal onlyInitializing {
    __Registrar_init_unchained(registry_);
    __ERC721_init("Omni Name Service", "OMNS");
    __AccessControl_init();
  }

  function __Registrar_init_unchained(IRegistry registry_)   internal onlyInitializing {
    _registry = registry_;
    _setRoleAdmin(ADMIN_ROLE, DEFAULT_ADMIN_ROLE);
    _setRoleAdmin(ROOT_ROLE, DEFAULT_ADMIN_ROLE);
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(ADMIN_ROLE, _msgSender());
  }

  modifier onlyRoot() {
    require(hasRole(ROOT_ROLE, _msgSender()), "FORBIDDEN_ACCESS");
    _;
  }

  modifier onlyAdmin() {
    require(hasRole(ADMIN_ROLE, _msgSender()), "FORBIDDEN_ACCESS");
    _;
  }

  modifier onlyDomainOwner(uint256 id) {
    require(_msgSender() == ownerOf(id), "FORBIDDEN_ACCESS");
    _;
  }

  modifier onlyController(bytes32 tld) {
    require(controllers[_msgSender()][tld], "FORBIDDEN_ACCESS(Controller)");
    _;
  }

  function expiry(bytes memory domain, bytes memory tld)  public view returns (uint256) {
    return _registry.expiry(keccak256(domain), keccak256(tld));
  }

  function available(bytes memory tld)  public view returns (bool) {
    return exists(keccak256(tld)) && _registry.enable(keccak256(tld));
  }
//If domain is using, return false.
  function available(bytes memory domain, bytes memory tld)   public view returns (bool) {
    return expiry(domain, tld) + _registry.gracePeriod() < block.timestamp;
  }

  function ownerOf(bytes memory domain, bytes memory tld)  public view override returns (address) {
    uint256 id = uint256(keccak256(abi.encodePacked(domain, ".", tld)));
    return super.ownerOf(id);
  }

  function exists(bytes memory domain, bytes memory tld) public view returns (bool) {
    uint256 id = uint256(keccak256(abi.encodePacked(domain, ".", tld)));
    return super._exists(id);
  }

  function exists(bytes32 tld)  public virtual view returns (bool) {
    return _registry.exists(tld);
  }
  function controllerApproved(bytes32 tld, address controller)  public view returns (bool) {
    return controllers[controller][tld];
  }

  function setControllerApproval(
    bytes memory tld,
    address controller,
    bool approved
  )  external onlyRoot {
    controllers[controller][keccak256(tld)] = approved;
    emit SetController(tld, controller, approved);
  }

  function register(
    bytes calldata domain,
    bytes calldata tld,
    address owner,
    uint256 duration
  )   public virtual onlyController(keccak256(tld)) {
    require(_validDomain(domain), "INVALID_DOMAIN_NAME");
    require(available(domain, tld), "DOMAIN_NOT_AVAILABLE");
    require(block.timestamp + duration + _registry.gracePeriod() > block.timestamp + _registry.gracePeriod(), "DURATION_TOO_SHORT");
    uint256 id = uint256(keccak256(abi.encodePacked(string(domain), ".", string(tld))));
    uint256 expiry_ = block.timestamp + duration;
    if (_exists(id)) {
      _burn(id);
    }
    _mint(owner, id);
    _registry.setRecord(string(domain), string(tld), owner, address(0), expiry_);
    emit DomainRegistered(domain, tld, owner, expiry_);
  }

  function renew(
    bytes calldata domain,
    bytes calldata tld,
    uint256 duration
  )  public virtual onlyController(keccak256(bytes(tld))) {
    bytes32 _domain = keccak256(domain);
    bytes32 _tld = keccak256(tld);
    uint256 expiry_ = _registry.expiry(_domain, _tld);
    require(expiry_ + _registry.gracePeriod() >= block.timestamp, "DOMAIN_ALREADY_EXPIRED");
    require(expiry_ + duration + _registry.gracePeriod() >= duration + _registry.gracePeriod(), "DURATION_TOO_SHORT");
    _registry.setExpiry(_domain, _tld, expiry_ + duration);
    emit DomainRenewed(domain, tld, expiry_ + duration);
  }

  function reclaim(
    bytes calldata domain,
    bytes calldata tld,
    address owner
  ) public virtual onlyController(keccak256(bytes(tld))) {
    uint256 id = uint256(keccak256(abi.encodePacked(string(domain), ".", string(tld))));
    require(ownerOf(id) == owner, "FORBIDDEN_ACCESS");
    bytes32 _domain = keccak256(domain);
    bytes32 _tld = keccak256(tld);
    require(_registry.live(_domain, _tld), "DOMAIN_EXPIRED");
    _registry.setOwner(keccak256(domain), keccak256(tld), owner);
    emit DomainReclaimed(domain, tld, owner);
  }

  function tokenId(string memory domain, string memory tld)  public pure returns (uint256) {
    require(_validDomain(bytes(domain)), "INVALID_DOMAIN_NAME");
    return uint256(keccak256(abi.encodePacked(domain, ".", tld)));
  }

  function tokenId(bytes memory domain, bytes memory tld)  public pure returns (uint256) {
    require(_validDomain(bytes(domain)), "INVALID_DOMAIN_NAME");
    return uint256(keccak256(abi.encodePacked(domain, ".", tld)));
  }

  function supportsInterface(bytes4 interfaceID)  public view override(AccessControlUpgradeable, ERC2981Upgradeable, ERC721Upgradeable, IERC165Upgradeable) returns (bool) {
    return interfaceID == type(ISingletonRegistrar).interfaceId || super.supportsInterface(interfaceID);
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

  // modifier onlyNodeOwner(bytes32 node) {
  //   address owner = _registry.owner(node);
  //   require(owner == address(0x0) || owner == msg.sender, "403 Forbidden");
  //   _;
  // }

  // modifier onlyController() {
  //   require(controllers[msg.sender], "403 Forbidden");
  //   _;
  // }

  // // https://ethereum.stackexchange.com/questions/50369/string-validation-solidity-alpha-numeric-and-length
  // modifier valid(string memory name) {
  //   require(bytes(name).length > 0, "400 Invalid Length");
  //   bytes memory b = bytes(name);
  //   for (uint256 i; i < b.length; i++) {
  //     bytes1 char = b[i];
  //     require(char != 0x2E, "400 Invalid Character");
  //   }
  //   _;
  // }

  // modifier exists(uint256 id) {
  //   require(_owners[id] != address(0), "404 Not Exist");
  //   _;
  // }

  // function _exists(uint256 id) internal view returns (bool) {
  //   return _owners[id] != address(0);
  // }

  // function expiry(uint256 id) external view override returns (uint256) {
  //   return _expiries[id];
  // }

  // function available(uint256 id) public view override returns (bool) {
  //   return _expiries[id] + GRACE_PERIOD < block.timestamp;
  // }

  // function ownerOf(uint256 id) public view exists(id) returns (address) {
  //   return _registry.owner(bytes32(id));
  // }

  // function addController(address controller) external override onlyOwner {
  //   controllers[controller] = true;
  //   emit ControllerAdded(controller);
  // }

  // function removeController(address controller) external override onlyOwner {
  //   controllers[controller] = false;
  //   emit ControllerRemoved(controller);
  // }

  // function setResolver(bytes32 node, address resolver) external override onlyOwner {
  //   _registry.setResolver(node, resolver);
  // }

  // function registerDomain(
  //   uint256 id,
  //   bytes32 node,
  //   address owner,
  //   uint256 duration,
  //   bool updateRegistry
  // ) internal onlyController returns (uint256) {
  //   require(available(id), "503 Domain Not Available");
  //   require(block.timestamp + duration + GRACE_PERIOD > block.timestamp + GRACE_PERIOD, "400 Duration Too Short");
  //   _expiries[id] = block.timestamp + duration;
  //   if (_exists(id)) {
  //     _burn(owner, id, 1);
  //   }
  //   _mint(owner, id, 1, "");
  //   if (updateRegistry) {
  //     _registry.setSubnodeOwner(node, bytes32(id), owner);
  //   }

  //   emit NameRegistered(id, owner, block.timestamp + duration);

  //   return block.timestamp + duration;
  // }

  // function renewDomain(
  //   uint256 id,
  //   bytes32 node,
  //   uint256 duration
  // ) external override onlyController returns (uint256) {
  //   require(_expiries[id] + GRACE_PERIOD >= block.timestamp, "500 Domain Expired");
  //   require(_expiries[id] + duration + GRACE_PERIOD > duration + GRACE_PERIOD, "400 Duration Too Short");

  //   _expiries[id] += duration;
  //   emit NameRenewed(id, _expiries[id]);
  //   return _expiries[id];
  // }

  // function reclaimDomain(
  //     uint256 id,
  //     bytes32 node,
  //     address owner
  // ) external override {
  //     require(onlyNodeOwner(msg.sender, id));
  //     _registry.setSubnodeOwner(node, bytes32(id), owner);
  // }

  // function registerTld() external onlyController {}

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
