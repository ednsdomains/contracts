//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "./ISingletonRegistrar.sol";
import "../utils/LabelValidator.sol";
import "../oracle/ITokenPriceOracle.sol";
import "../oracle/IDomainPriceOracle.sol";

contract SingletonRegistrarController is AccessControlUpgradeable, LabelValidator {
  IERC20Upgradeable private _token;
  ISingletonRegistrar private _registrar;
  IDomainPriceOracle private _domainPrice;
  ITokenPriceOracle private _tokenPrice;

  uint256 private constant MINIMUM_COMMIT_TIME = 1 minutes;
  uint256 private constant MAXIMUM_COMMIT_TIME = 1 days;

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  function initialize(
    IERC20Upgradeable token_,
    IDomainPriceOracle domainPrice_,
    ITokenPriceOracle tokenPrice_,
    ISingletonRegistrar registrar_
  ) public initializer {
    __SingletonRegistrarController_init(token_, domainPrice_, tokenPrice_, registrar_);
  }

  function __SingletonRegistrarController_init(
    IERC20Upgradeable token_,
    IDomainPriceOracle domainPrice_,
    ITokenPriceOracle tokenPrice_,
    ISingletonRegistrar registrar_
  ) internal onlyInitializing {
    __SingletonRegistrarController_init_unchained(token_, domainPrice_, tokenPrice_, registrar_);
    __AccessControl_init();
  }

  function __SingletonRegistrarController_init_unchained(
    IERC20Upgradeable token_,
    IDomainPriceOracle domainPrice_,
    ITokenPriceOracle tokenPrice_,
    ISingletonRegistrar registrar_
  ) internal onlyInitializing {
    _token = token_;
    _domainPrice = domainPrice_;
    _tokenPrice = tokenPrice_;
    _registrar = registrar_;
    _setRoleAdmin(ADMIN_ROLE, DEFAULT_ADMIN_ROLE);
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(ADMIN_ROLE, _msgSender());
  }

  function available(string memory domain, string memory tld) public view returns (bool) {
    return valid(domain, tld) && _registrar.available(domain, tld);
  }

  function price(
    string memory domain,
    string memory tld,
    uint256 durations
  ) public view returns (uint256) {
    return _domainPrice.price(bytes(domain), keccak256(bytes(tld)), durations);
  }

  function commit() public {}
}
