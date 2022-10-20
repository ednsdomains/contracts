//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "../utils/LabelOperator.sol";
import "../oracle/interfaces/ITokenPriceOracle.sol";
import "../oracle/interfaces/IDomainPriceOracle.sol";
import "./interfaces/IBaseRegistrar.sol";
import "./interfaces/IClassicalRegistrarController.sol";

contract ClassicalRegistrarController is IClassicalRegistrarController, AccessControlUpgradeable, LabelOperator {
  IERC20Upgradeable private _token;
  IBaseRegistrar private _registrar;
  IDomainPriceOracle private _domainPrice;
  ITokenPriceOracle private _tokenPrice;

  uint256 private COIN_ID;

  uint256 private constant MINIMUM_COMMIT_TIME = 1 minutes;
  uint256 private constant MAXIMUM_COMMIT_TIME = 1 days;
  uint256 private constant MINIMUM_REGISTRATION_DURATION = 365 days; // In seconds
  uint256 private constant MAXIMUM_REGISTRATION_DURATION = 365 days * 10; // In seconds

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  mapping(bytes32 => uint256) internal _commitments;

  function initialize(
    IERC20Upgradeable token_,
    IDomainPriceOracle domainPrice_,
    ITokenPriceOracle tokenPrice_,
    IBaseRegistrar registrar_,
    uint256 coinId
  ) public initializer {
    __ClassicalRegistrarController_init(token_, domainPrice_, tokenPrice_, registrar_, coinId);
  }

  function __ClassicalRegistrarController_init(
    IERC20Upgradeable token_,
    IDomainPriceOracle domainPrice_,
    ITokenPriceOracle tokenPrice_,
    IBaseRegistrar registrar_,
    uint256 coinId
  ) internal onlyInitializing {
    __ClassicalRegistrarController_init_unchained(token_, domainPrice_, tokenPrice_, registrar_, coinId);
    __AccessControl_init();
  }

  function __ClassicalRegistrarController_init_unchained(
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
    _setRoleAdmin(ADMIN_ROLE, DEFAULT_ADMIN_ROLE);
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(ADMIN_ROLE, _msgSender());
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
  ) public {
    // The durations must be multiple of 365 days
    // require(durations % 365 days == 0, "INVALID_DURATIONS");
    // uint256 _price = getPrice(name, tld, durations);
    // require(_token.allowance(_msgSender(), address(this)) >= _price, "INSUFFICIENT_BALANCE");
    // TODO: Set record in resolver
    // TODO: Set record in reverse resolver
    // _token.transferFrom(_msgSender(), address(this), _price);
//    _registrar.register(name, tld, address(this), expires);
//     _registrar.transferFrom(address(this), owner, _registrar.tokenId(name, tld));
    _registrar.register(name, tld, owner, expires);
  }

  function renew(
    bytes memory name,
    bytes memory tld,
    uint64 expires
  ) public {
    // The durations must be multiple of 365 days
    // require(durations % 365 days == 0, "INVALID_DURATIONS");
    // uint256 _price = getPrice(name, tld, durations);
    // require(_token.allowance(_msgSender(), address(this)) >= _price, "INSUFFICIENT_BALANCE");
    // _token.transferFrom(_msgSender(), address(this), _price);
    _registrar.renew(name, tld, expires);
  }
}
