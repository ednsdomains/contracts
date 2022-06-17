//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
//import "@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "../utils/LabelValidator.sol";
import "./IBaseRegistrar.sol";
import "../registry/IRegistry.sol";

// TODO: Implement ERC2981 NFT Royalty Standard
abstract contract BaseRegistrar is ERC721Upgradeable, AccessControlUpgradeable, LabelValidator {
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant ROOT_ROLE = keccak256("ROOT_ROLE");
  event DomainRegistered(bytes domain, bytes tld, address owner, uint256 expiry);
  event DomainRenewed(bytes domain, bytes tld, uint256 expiry);
  event DomainReclaimed(bytes domain, bytes tld, address owner);
  event SetController(bytes tld, address controller, bool approved);
  // future preparing for adopting LayerZero
  // uint8 public immutable chainId; // The current chain ID in LZ
  // uint8 public immutable chainIds; // The list of chain IDs in LZ

  mapping(address => mapping(bytes32 => bool))  public controllers;

  IRegistry internal _registry;

//  function __Registrar_init(IRegistry registry_)  internal onlyInitializing {
//    __Registrar_init_unchained(registry_);
//    __ERC721_init("Omni Name Service", "OMNS");
//    __AccessControl_init();
//  }

  function __Registrar_init_unchained(IRegistry registry_)   internal onlyInitializing {
    _registry = registry_;
    _setRoleAdmin(ADMIN_ROLE, DEFAULT_ADMIN_ROLE);
    _setRoleAdmin(ROOT_ROLE, DEFAULT_ADMIN_ROLE);
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(ADMIN_ROLE, _msgSender());
  }

  modifier onlyRoot() {
    require(hasRole(ROOT_ROLE, _msgSender()), "FORBIDDEN_R");
    _;
  }

  modifier onlyAdmin() {
    require(hasRole(ADMIN_ROLE, _msgSender()), "FORBIDDEN_A");
    _;
  }

  modifier onlyDomainOwner(uint256 id) {
    require(_msgSender() == ownerOf(id), "FORBIDDEN_D");
    _;
  }

  modifier onlyController(bytes32 tld) {
    require(controllers[_msgSender()][tld], "FORBIDDEN_C");
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

  function ownerOf(bytes memory domain, bytes memory tld)  public view  returns (address) {
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

  function _register(
    bytes calldata domain,
    bytes calldata tld,
    address owner,
    uint256 duration
  )   internal {
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

  function _renew(
    bytes calldata domain,
    bytes calldata tld,
    uint256 duration
  )  internal {
    bytes32 _domain = keccak256(domain);
    bytes32 _tld = keccak256(tld);
    uint256 expiry_ = _registry.expiry(_domain, _tld);
    require(expiry_ + _registry.gracePeriod() >= block.timestamp, "DOMAIN_EXPIRED");
    require(expiry_ + duration + _registry.gracePeriod() >= duration + _registry.gracePeriod(), "DURATION_TOO_SHORT");
    _registry.setExpiry(_domain, _tld, expiry_ + duration);
    emit DomainRenewed(domain, tld, expiry_ + duration);
  }

  function _reclaim(
    bytes calldata domain,
    bytes calldata tld,
    address owner
  ) internal {
    uint256 id = uint256(keccak256(abi.encodePacked(string(domain), ".", string(tld))));
    require(ownerOf(id) == owner, "FORBIDDEN");
    bytes32 _domain = keccak256(domain);
    bytes32 _tld = keccak256(tld);
    require(_registry.live(_domain, _tld), "DOMAIN_EXPIRED");
    _registry.setOwner(keccak256(domain), keccak256(tld), owner);
    emit DomainReclaimed(domain, tld, owner);
  }


  function tokenId(bytes memory domain, bytes memory tld)  public pure returns (uint256) {
    require(_validDomain(bytes(domain)), "INVALID_DOMAIN_NAME");
    return uint256(keccak256(abi.encodePacked(domain, ".", tld)));
  }

  function supportsInterface(bytes4 interfaceID)  public view override(AccessControlUpgradeable, ERC721Upgradeable) returns (bool) {
    return interfaceID == type(IBaseRegistrar).interfaceId || super.supportsInterface(interfaceID);
  }
}
