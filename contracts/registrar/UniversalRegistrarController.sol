//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "../utils/LabelOperator.sol";
import "../oracle/interfaces/ITokenPriceOracle.sol";
import "../oracle/interfaces/IDomainPriceOracle.sol";
import "./interfaces/IBaseRegistrar.sol";
import "./interfaces/IUniversalRegistrarController.sol";

contract UniversalRegistrarController is IUniversalRegistrarController, AccessControlUpgradeable, LabelOperator {
  IERC20Upgradeable private _token;
  IBaseRegistrar private _registrar;
  IDomainPriceOracle private _domainPrice;
  ITokenPriceOracle private _tokenPrice;

  uint256 private COIN_ID;

  uint256 private constant MINIMUM_REGISTRATION_DURATION = 31 days; // In seconds
  uint256 private constant MAXIMUM_REGISTRATION_DURATION = 365 days * 10; // In seconds

  bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

  mapping(bytes32 => uint256) internal _commitments;

  modifier onlyOperator() {
    require(hasRole(OPERATOR_ROLE, _msgSender()), "ONLY_OPERATOR");
    _;
  }

  function initialize(
    IERC20Upgradeable token_,
    IDomainPriceOracle domainPrice_,
    ITokenPriceOracle tokenPrice_,
    IBaseRegistrar registrar_,
    uint256 coinId
  ) public initializer {
    __UniversalRegistrarController_init(token_, domainPrice_, tokenPrice_, registrar_, coinId);
  }

  function __UniversalRegistrarController_init(
    IERC20Upgradeable token_,
    IDomainPriceOracle domainPrice_,
    ITokenPriceOracle tokenPrice_,
    IBaseRegistrar registrar_,
    uint256 coinId
  ) internal onlyInitializing {
    __UniversalRegistrarController_init_unchained(token_, domainPrice_, tokenPrice_, registrar_, coinId);
    __AccessControl_init();
  }

  function __UniversalRegistrarController_init_unchained(
    IERC20Upgradeable token_,
    IDomainPriceOracle domainPrice_,
    ITokenPriceOracle tokenPrice_,
    IBaseRegistrar registrar_,
    uint256 coinId
  ) internal onlyInitializing {
    _token = token_;
    _domainPrice = domainPrice_;
    _tokenPrice = tokenPrice_;
    _registrar = registrar_;
    COIN_ID = coinId;
    _setRoleAdmin(OPERATOR_ROLE, DEFAULT_ADMIN_ROLE);
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(OPERATOR_ROLE, _msgSender());
  }

  function isAvailable(bytes memory tld) public view returns (bool) {
    return _registrar.isAvailable(tld) && _registrar.isControllerApproved(keccak256(tld), address(this));
  }

  function isAvailable(bytes memory name, bytes memory tld) public view returns (bool) {
    return valid(name, tld) && _registrar.isAvailable(name, tld);
  }

  function getPrice(
    bytes memory name,
    bytes memory tld,
    uint256 durations
  ) public view returns (uint256) {
    return _domainPrice.getPrice(name, keccak256(tld), durations);
  }

  function register(
    bytes memory name,
    bytes memory tld,
    address owner,
    uint64 expires
  ) public onlyOperator {
    _registrar.register(name, tld, owner, expires);
  }

  function renew(
    bytes memory name,
    bytes memory tld,
    uint64 expires
  ) public onlyOperator {
    _registrar.renew(name, tld, expires);
  }
}
