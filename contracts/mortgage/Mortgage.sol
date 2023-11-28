// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "./interfaces/IMortgage.sol";
import "../registry/interfaces/IRegistry.sol";

contract Mortgage is IMortgage, ReentrancyGuardUpgradeable, AccessControlUpgradeable, UUPSUpgradeable, PausableUpgradeable {
  using SafeERC20Upgradeable for IERC20Upgradeable;

  IERC20Upgradeable internal _token;
  IRegistry internal _registry;

  mapping(bytes32 => mapping(bytes32 => mapping(address => uint256))) internal _funds;
  mapping(bytes32 => mapping(bytes32 => uint256)) internal _requirements;

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

  function initialize(IERC20Upgradeable token_) public initializer {
    __Mortgage_init(token_);
  }

  function __Mortgage_init(IERC20Upgradeable token_) internal onlyInitializing {
    __Pausable_init();
    __Mortgage_init_unchained(token_);
  }

  function __Mortgage_init_unchained(IERC20Upgradeable token_) internal onlyInitializing {
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _grantRole(ADMIN_ROLE, _msgSender());
    _grantRole(OPERATOR_ROLE, _msgSender());
    _token = token_;
  }

  function deposit(bytes32 name, bytes32 tld, address owner, address spender, uint256 amount) public whenNotPaused nonReentrant {
    require(isExists(name, tld), "DOMAIN_NOT_EXISTS");
    require(_registry.isLive(name, tld), "DOMAIN_EXPIRED");
    _token.safeTransferFrom(spender, address(this), getRequirement(name, tld));
    _funds[tld][name][owner] += amount;
    emit Deposit(name, tld, owner, amount);
  }

  function withdraw(bytes32 name, bytes32 tld, address recipient, uint256 amount) public whenNotPaused nonReentrant {
    require(_funds[tld][name][_msgSender()] >= amount, "FUND_AMOUNT_EXCEEDED");
    _token.safeTransferFrom(address(this), recipient, amount);
    emit Withdraw(name, tld, _msgSender(), amount);
  }

  function setRequirement(bytes32 name, bytes32 tld, uint256 amount) public onlyRole(OPERATOR_ROLE) {
    _requirements[tld][name] = amount;
  }

  function getRequirement(bytes32 name, bytes32 tld) public view returns (uint256) {
    return _requirements[tld][name];
  }

  function isFulfill(bytes32 name, bytes32 tld) public view returns (bool) {
    return _funds[tld][name][_registry.getOwner(name, tld)] >= _requirements[tld][name];
  }

  function isExists(bytes32 name, bytes32 tld) public view returns (bool) {
    return _requirements[tld][name] > 0;
  }

  function setRegistry(IRegistry registry_) external onlyRole(ADMIN_ROLE) {
    _registry = registry_;
  }

  function getRegistry() external view returns (address) {
    return address(_registry);
  }

  function pause() public onlyRole(ADMIN_ROLE) {
    _pause();
  }

  function unpause() public onlyRole(ADMIN_ROLE) {
    _unpause();
  }

  function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}

  uint256[50] private __gap;
}
