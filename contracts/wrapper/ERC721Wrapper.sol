//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../registry/interfaces/IRegistry.sol";
import "./interfaces/IERC721Wrapper.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract ERC721Wrapper is IERC721Wrapper, AccessControlUpgradeable {
  IRegistry private _registry;

  bytes32 public constant REGISTRY_ROLE = keccak256("REGISTRY_ROLE");
  bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

  string private _name;
  string private _symbol;
  mapping(address => uint256) private _balances;

  modifier onlyRegistry() {
    require(hasRole(REGISTRY_ROLE, _msgSender()), "ONLY_REGISTRY");
    _;
  }

  modifier onlyOperator() {
    require(hasRole(OPERATOR_ROLE, _msgSender()), "ONLY_REGISTRY");
    _;
  }

  /* ========== Initializer ==========*/

  function initialize(
    IRegistry registry_,
    string memory name_,
    string memory symbol_
  ) public initializer {
    __ERC721Wrapper_init(registry_, name_, symbol_);
  }

  function __ERC721Wrapper_init(
    IRegistry registry_,
    string memory name_,
    string memory symbol_
  ) internal onlyInitializing {
    __ERC721Wrapper_init_unchained(registry_, name_, symbol_);
    __AccessControl_init();
    __ERC165_init();
  }

  function __ERC721Wrapper_init_unchained(
    IRegistry registry_,
    string memory name_,
    string memory symbol_
  ) internal onlyInitializing {
    _registry = registry_;
    _setRoleAdmin(REGISTRY_ROLE, DEFAULT_ADMIN_ROLE);
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(OPERATOR_ROLE, _msgSender());
    _name = name_;
    _symbol = symbol_;
  }

  /* ========== ERC721 ==========*/

  function balanceOf(address owner_) public view returns (uint256) {
    require(owner_ != address(0), "ERC721: balance query for the zero address");
    return _balances[owner_];
  }

  function ownerOf(uint256 tokenId_) public view returns (address) {
    return _registry.ownerOf(tokenId_);
  }

  function safeTransferFrom(
    address from,
    address to,
    uint256 tokenId_
  ) public {
    safeTransferFrom(from, to, tokenId_, "");
  }

  function transferFrom(
    address from,
    address to,
    uint256 tokenId_
  ) public {
    _registry.transferFrom(from, to, tokenId_);
  }

  function approve(address to, uint256 tokenId_) public {
    _registry.approve(to, tokenId_);
  }

  function getApproved(uint256 tokenId_) public view returns (address) {
    return _registry.ownerOf(tokenId_);
  }

  function setApprovalForAll(address operator, bool approved) public {
    _registry.setApprovalForAll(operator, approved);
  }

  function isApprovedForAll(address owner, address operator) public view returns (bool) {
    return _registry.isApprovedForAll(owner, operator);
  }

  function safeTransferFrom(
    address from,
    address to,
    uint256 tokenId_,
    bytes memory _data
  ) public {
    _registry.safeTransferFrom(from, to, tokenId_, _data);
  }

  function mint(address to, uint256 tokenId_) external onlyRegistry {
    _balances[to] += 1;
    emit Transfer(address(0), to, tokenId_);
  }

  function burn(uint256 tokenId_) external onlyRegistry {
    address owner = ownerOf(tokenId_);
    emit Transfer(owner, address(0), tokenId_);
  }

  /* ========== ERC721 Metadata ==========*/

  function name() public view virtual returns (string memory) {
    return _name;
  }

  function setName(string memory name_) public onlyOperator {
    _name = name_;
  }

  function symbol() public view virtual returns (string memory) {
    return _symbol;
  }

  function setSymbol(string memory symbol_) public onlyOperator {
    _symbol = symbol_;
  }

  function tokenURI(uint256 tokenId_) public view returns (string memory) {
    return _registry.tokenURI(tokenId_);
  }
}
