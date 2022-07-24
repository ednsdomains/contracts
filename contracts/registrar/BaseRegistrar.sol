//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
//import "@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "../utils/LabelValidator.sol";
import "../registry/IRegistry.sol";

// TODO: Implement ERC2981 NFT Royalty Standard
abstract contract BaseRegistrar is ERC721Upgradeable, AccessControlUpgradeable, LabelValidator {
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant ROOT_ROLE = keccak256("ROOT_ROLE");
  event DomainRegistered(bytes domain, bytes tld, address owner, uint256 expires);
  event DomainRenewed(bytes domain, bytes tld, uint256 expires);
  event DomainReclaimed(bytes domain, bytes tld, address owner);
  event SetController(bytes tld, address controller, bool approved);

  bytes internal constant DOT = bytes(".");

  mapping(address => mapping(bytes32 => bool)) public controllers;

  IRegistry internal _registry;

  bytes internal __baseURI;

  function __BaseRegistrar_init(IRegistry registry_) internal onlyInitializing {
    __BaseRegistrar_init_unchained(registry_);
    __ERC721_init("Omni Name Service", "OMNS");
    __AccessControl_init();
  }

  function __BaseRegistrar_init_unchained(IRegistry registry_) internal onlyInitializing {
    _registry = registry_;
    _setRoleAdmin(ADMIN_ROLE, DEFAULT_ADMIN_ROLE);
    _setRoleAdmin(ROOT_ROLE, DEFAULT_ADMIN_ROLE);
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(ADMIN_ROLE, _msgSender());
  }

  modifier onlyRoot() {
    require(hasRole(ROOT_ROLE, _msgSender()), "ONLY_ROOT");
    _;
  }

  modifier onlyAdmin() {
    require(hasRole(ADMIN_ROLE, _msgSender()), "ONLY_ADMIN");
    _;
  }

  modifier onlyDomainOwner(uint256 id) {
    require(_msgSender() == ownerOf(id), "ONLY_OWNER");
    _;
  }

  modifier onlyController(bytes32 tld) {
    require(controllers[_msgSender()][tld], "ONLY_CONTROLLER");
    _;
  }

  function getDurations(uint8 years_) public pure virtual returns (uint256) {
    return 365 days * years_;
  }

  function expires(bytes memory domain, bytes memory tld) public view virtual returns (uint256) {
    return _registry.expires(keccak256(domain), keccak256(tld));
  }

  function available(bytes memory tld) public view virtual returns (bool) {
    return exists(keccak256(tld)) && _registry.enable(keccak256(tld));
  }

  function available(bytes memory domain, bytes memory tld) public view virtual returns (bool) {
    return expires(domain, tld) + _registry.gracePeriod() < block.timestamp;
  }

  function ownerOf(bytes memory domain, bytes memory tld) public view virtual returns (address) {
    uint256 id = uint256(keccak256(abi.encodePacked(domain, DOT, tld)));
    return super.ownerOf(id);
  }

  function exists(bytes memory domain, bytes memory tld) public view virtual returns (bool) {
    uint256 id = uint256(keccak256(abi.encodePacked(domain, DOT, tld)));
    return super._exists(id);
  }

  function exists(bytes32 tld) public view virtual returns (bool) {
    return _registry.exists(tld);
  }

  function controllerApproved(bytes32 tld, address controller) public view virtual returns (bool) {
    return controllers[controller][tld];
  }

  function tokenId(bytes memory domain, bytes memory tld) public pure virtual returns (uint256) {
    require(_validDomain(domain), "INVALID_DOMAIN_NAME");
    return uint256(keccak256(abi.encodePacked(domain, DOT, tld)));
  }

  function tokenURI(uint256 tokenId_) public view virtual override(ERC721Upgradeable) returns (string memory) {
    require(_exists(tokenId_), "TOKEN_NOT_EXISTS");
    // `{_baseURI}/{chainId}/{contractAddress}/{tokenId}/metadata.json`
    return
      string(
        abi.encodePacked(
          __baseURI,
          "/",
          block.chainid,
          "/",
          StringsUpgradeable.toHexString(uint160(address(this)), 20),
          "/",
          StringsUpgradeable.toString(tokenId_),
          "/",
          "metadata.json"
        )
      );
  }

  function setBaseURI(string memory baseURI_) public virtual onlyAdmin {
    __baseURI = bytes(baseURI_);
  }

  function setControllerApproval(
    bytes memory tld,
    address controller,
    bool approved
  ) external onlyRoot {
    controllers[controller][keccak256(tld)] = approved;
    emit SetController(tld, controller, approved);
  }

  function _register(
    bytes memory domain,
    bytes memory tld,
    address owner,
    uint256 durations
  ) internal {
    require(_validDomain(domain), "INVALID_DOMAIN_NAME");
    require(available(domain, tld), "DOMAIN_NOT_AVAILABLE");
    require(block.timestamp + durations + _registry.gracePeriod() > block.timestamp + _registry.gracePeriod(), "DURATION_TOO_SHORT");
    uint256 id = uint256(keccak256(abi.encodePacked(domain, DOT, tld)));
    uint256 expires_ = block.timestamp + durations;
    if (_exists(id)) {
      _burn(id);
    }
    _mint(owner, id);
    _registry.setRecord(domain, tld, owner, address(0), expires_);
    emit DomainRegistered(domain, tld, owner, expires_);
  }

  function _renew(
    bytes memory domain,
    bytes memory tld,
    uint256 durations
  ) internal {
    bytes32 _domain = keccak256(domain);
    bytes32 _tld = keccak256(tld);
    uint256 expires_ = _registry.expires(_domain, _tld);
    require(expires_ + _registry.gracePeriod() >= block.timestamp, "DOMAIN_EXPIRED");
    require(expires_ + durations + _registry.gracePeriod() >= durations + _registry.gracePeriod(), "DURATION_TOO_SHORT");
    _registry.setExpires(_domain, _tld, expires_ + durations);
    emit DomainRenewed(domain, tld, expires_ + durations);
  }

  function _reclaim(
    bytes memory domain,
    bytes memory tld,
    address owner
  ) internal {
    uint256 id = uint256(keccak256(abi.encodePacked(domain, DOT, tld)));
    require(ownerOf(id) == owner, "FORBIDDEN");
    bytes32 _domain = keccak256(domain);
    bytes32 _tld = keccak256(tld);
    require(_registry.live(_domain, _tld), "DOMAIN_EXPIRED");
    _registry.setOwner(keccak256(domain), keccak256(tld), owner);
    emit DomainReclaimed(domain, tld, owner);
  }

  function supportsInterface(bytes4 interfaceID) public view override(AccessControlUpgradeable, ERC721Upgradeable) returns (bool) {
    return super.supportsInterface(interfaceID);
  }
}
