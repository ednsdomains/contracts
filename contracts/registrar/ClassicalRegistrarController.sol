//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "../utils/LabelOperator.sol";
import "../oracle/interfaces/ITokenPriceOracle.sol";
import "../oracle/interfaces/IDomainPriceOracle.sol";
import "./interfaces/IBaseRegistrar.sol";
import "./interfaces/IClassicalRegistrarController.sol";
import "./BaseRegistrarController.sol";
import "../root/interfaces/IRoot.sol";

contract ClassicalRegistrarController is IClassicalRegistrarController, BaseRegistrarController, AccessControlUpgradeable, LabelOperator {
  IERC20 private _token;
  IBaseRegistrar private _registrar;
  IRoot private _root;

  uint256 private COIN_ID;

  bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

  mapping(bytes32 => uint256) internal _commitments;

  modifier onlyOperator() {
    require(hasRole(OPERATOR_ROLE, _msgSender()), "ONLY_OPERATOR");
    _;
  }

  function initialize(
    IERC20 token_,
    IBaseRegistrar registrar_,
    IRoot root_,
    uint256 coinId
  ) public initializer {
    __ClassicalRegistrarController_init(token_, registrar_, root_, coinId);
  }

  function __ClassicalRegistrarController_init(
    IERC20 token_,
    IBaseRegistrar registrar_,
    IRoot root_,
    uint256 coinId
  ) internal onlyInitializing {
    __ClassicalRegistrarController_init_unchained(token_, registrar_, root_, coinId);
    __AccessControl_init();
  }

  function __ClassicalRegistrarController_init_unchained(
    IERC20 token_,
    IBaseRegistrar registrar_,
    IRoot root_,
    uint256 coinId
  ) internal onlyInitializing {
    _token = token_;
    _registrar = registrar_;
    _root = root_;
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

  function register(
    bytes memory name,
    bytes memory tld,
    address owner,
    uint64 expires
  ) public onlyOperator {
    _registrar.register(name, tld, owner, expires);
  }

  function register(
    bytes memory name,
    bytes memory tld,
    address owner,
    uint64 expires,
    uint256 price,
    bytes calldata signature
  ) public {
    require(_verify(keccak256(abi.encodePacked(name, tld, expires, price)), signature, _root.getAuthorizer()), "INVALID_SIGNATURE");
    require(_token.allowance(_msgSender(), address(this)) >= price, "INSUFFICIENT_BALANCE");
    _registrar.register(name, tld, owner, expires);
    _token.transferFrom(_msgSender(), address(_root), price);
  }

  function renew(
    bytes memory name,
    bytes memory tld,
    uint64 expires
  ) public onlyOperator {
    _registrar.renew(name, tld, expires);
  }

  function renew(
    bytes memory name,
    bytes memory tld,
    uint64 expires,
    uint256 price,
    bytes calldata signature
  ) public {
    require(_verify(keccak256(abi.encodePacked(name, tld, expires, price)), signature, _root.getAuthorizer()), "INVALID_SIGNATURE");
    require(_token.allowance(_msgSender(), address(this)) >= price, "INSUFFICIENT_BALANCE");
    _registrar.renew(name, tld, expires);
    _token.transferFrom(_msgSender(), address(_root), price);
  }
}
