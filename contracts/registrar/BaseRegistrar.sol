//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
//import "@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "../utils/LabelOperator.sol";
import "../registry/interfaces/IRegistry.sol";

// TODO: Implement ERC2981 NFT Royalty Standard
abstract contract BaseRegistrar is ERC721Upgradeable, AccessControlUpgradeable, LabelOperator {
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant ROOT_ROLE = keccak256("ROOT_ROLE");
  event DomainRegistered(bytes name, bytes tld, address owner, uint256 expires);
  event DomainRenewed(bytes name, bytes tld, uint256 expires);
  event DomainReclaimed(bytes name, bytes tld, address owner);
  event SetController(bytes tld, address controller, bool approved);

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
  function available(bytes memory tld) public view virtual returns (bool) {
    return true;
  }
  function available(bytes memory domain, bytes memory tld) public view virtual returns (bool) {
    return true;
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

  function getExpires(bytes memory name, bytes memory tld) public view virtual returns (uint256) {
    return _registry.getExpires(keccak256(name), keccak256(tld));
  }

  function isAvailable(bytes memory tld) public view virtual returns (bool) {
    return isExists(keccak256(tld)) && _registry.isEnable(keccak256(tld));
  }

  function isAvailable(bytes memory name, bytes memory tld) public view virtual returns (bool) {
    return getExpires(name, tld) + _registry.getGracePeriod() < block.timestamp;
  }

  function ownerOf(bytes memory name, bytes memory tld) public view virtual returns (address) {
    uint256 id = uint256(keccak256(_join(name, tld)));
    return super.ownerOf(id);
  }

  function isExists(bytes memory name, bytes memory tld) public view virtual returns (bool) {
    uint256 id = uint256(keccak256(_join(name, tld)));
    return super._exists(id);
  }

  function isExists(bytes32 tld) public view virtual returns (bool) {
    return _registry.isExists(tld);
  }

  function getControllerApproved(bytes32 tld, address controller) public view virtual returns (bool) {
    return controllers[controller][tld];
  }

  function tokenId(bytes memory name, bytes memory tld) public pure virtual returns (uint256) {
    require(_validDomain(name), "INVALID_DOMAIN_NAME");
    return uint256(keccak256(_join(name, tld)));
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
    bytes memory name,
    bytes memory tld,
    address owner,
    uint256 durations
  ) internal {
    require(_validDomain(name), "INVALID_DOMAIN_NAME");
    require(isAvailable(name, tld), "DOMAIN_NOT_AVAILABLE");
    require(block.timestamp + durations + _registry.getGracePeriod() > block.timestamp + _registry.getGracePeriod(), "DURATION_TOO_SHORT");
    uint256 id = uint256(keccak256(_join(name, tld)));
    uint256 expires_ = block.timestamp + durations;
    if (_exists(id)) {
      _burn(id);
    }
    _mint(owner, id);
    _registry.setRecord(name, tld, owner, address(0), expires_);
    emit DomainRegistered(name, tld, owner, expires_);
  }

  function _renew(
    bytes memory name,
    bytes memory tld,
    uint256 durations
  ) internal {
    bytes32 _domain = keccak256(name);
    bytes32 _tld = keccak256(tld);
    uint256 expires_ = _registry.getExpires(_domain, _tld);
    require(expires_ + _registry.getGracePeriod() >= block.timestamp, "DOMAIN_EXPIRED");
    require(expires_ + durations + _registry.getGracePeriod() >= durations + _registry.getGracePeriod(), "DURATION_TOO_SHORT");
    _registry.setExpires(_domain, _tld, expires_ + durations);
    emit DomainRenewed(name, tld, expires_ + durations);
  }

  function _reclaim(
    bytes memory name,
    bytes memory tld,
    address owner
  ) internal {
    uint256 id = uint256(keccak256(_join(name, tld)));
    require(ownerOf(id) == owner, "FORBIDDEN");
    bytes32 _domain = keccak256(name);
    bytes32 _tld = keccak256(tld);
    require(_registry.isLive(_domain, _tld), "DOMAIN_EXPIRED");
    _registry.setOwner(keccak256(name), keccak256(tld), owner);
    emit DomainReclaimed(name, tld, owner);
  }

  function supportsInterface(bytes4 interfaceID) public view override(AccessControlUpgradeable, ERC721Upgradeable) returns (bool) {
    return super.supportsInterface(interfaceID);
  }
}
