//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "./interfaces/IOmniRegistrarController.sol";
import "../registrar/interfaces/IOmniRegistrar.sol";
import "../utils/Synchronizer.sol";
import "../utils/LabelOperator.sol";
import "../oracle/interfaces/ITokenPriceOracle.sol";
import "../oracle/interfaces/IDomainPriceOracle.sol";

contract OmniRegistrarController is IOmniRegistrarController, AccessControlUpgradeable, LabelOperator {
  IERC20Upgradeable private _token;
  IOmniRegistrar private _registrar;
  IDomainPriceOracle private _domainPrice;
  ITokenPriceOracle private _tokenPrice;

  uint256[] COIN_IDS;

  uint256 private constant MINIMUM_COMMIT_TIME = 5 minutes;
  uint256 private constant MAXIMUM_COMMIT_TIME = 1 days;
  uint256 private constant MINIMUM_REGISTRATION_DURATION = 1; // In year
  uint256 private constant MAXIMUM_REGISTRATION_DURATION = 10; // In year

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  mapping(bytes32 => uint256) internal _commitments;

  function initialize(
    IERC20Upgradeable token_,
    IDomainPriceOracle domainPrice_,
    ITokenPriceOracle tokenPrice_,
    IOmniRegistrar registrar_,
    uint256[] memory coinIds
  ) public initializer {
    __OmniRegistrarController_init(token_, domainPrice_, tokenPrice_, registrar_, coinIds);
  }

  function __OmniRegistrarController_init(
    IERC20Upgradeable token_,
    IDomainPriceOracle domainPrice_,
    ITokenPriceOracle tokenPrice_,
    IOmniRegistrar registrar_,
    uint256[] memory coinIds
  ) internal onlyInitializing {
    __OmniRegistrarController_init_unchained(token_, domainPrice_, tokenPrice_, registrar_, coinIds);
    __AccessControl_init();
  }

  function __OmniRegistrarController_init_unchained(
    IERC20Upgradeable token_,
    IDomainPriceOracle domainPrice_,
    ITokenPriceOracle tokenPrice_,
    IOmniRegistrar registrar_,
    uint256[] memory coinIds
  ) internal onlyInitializing {
    _token = token_;
    _domainPrice = domainPrice_;
    _tokenPrice = tokenPrice_;
    _registrar = registrar_;
    COIN_IDS = coinIds;
    _setRoleAdmin(ADMIN_ROLE, DEFAULT_ADMIN_ROLE);
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(ADMIN_ROLE, _msgSender());
  }

  function isAvailable(string memory tld) public view returns (bool) {
    return _registrar.isAvailable(bytes(tld)) && _registrar.isControllerApproved(keccak256(bytes(tld)), address(this));
  }

  function isAvailable(string memory domain, string memory tld) public view returns (bool) {
    return valid(domain, tld) && _registrar.isAvailable(bytes(domain), bytes(tld));
  }

  function getPrice(
    string memory domain,
    string memory tld,
    uint256 durations
  ) public view returns (uint256) {
    return _domainPrice.price(bytes(domain), keccak256(bytes(tld)), durations);
  }

  function commit(
    string memory domain,
    string memory tld,
    address owner,
    uint256 durations
  ) public {
    require(isAvailable(tld), "TLD_NOT_AVAILABLE");
    bytes32 commitment = makeCommitment(domain, tld, owner, durations);
    require(_commitments[commitment] + MAXIMUM_COMMIT_TIME < block.timestamp, "INVALID_COMMIT");
    _tokenPrice.requestTokenPriceInUsd();
    _commitments[commitment] = block.timestamp;
  }

  function makeCommitment(
    string memory domain,
    string memory tld,
    address owner,
    uint256 durations
  ) public view returns (bytes32) {
    require(_registrar.isExists(keccak256(bytes(tld))) && _registrar.isControllerApproved(keccak256(bytes(tld)), address(this)), "TLD_NOT_AVAILABLE");
    return keccak256(abi.encodePacked(domain, tld, owner, durations, _msgSender()));
  }

  function _consumeCommitment(
    string memory domain,
    string memory tld,
    uint256 durations,
    bytes32 commitment
  ) internal {
    require(_commitments[commitment] + MINIMUM_COMMIT_TIME <= block.timestamp, "INVALID_COMMITMENT");
    require(_commitments[commitment] + MAXIMUM_COMMIT_TIME >= block.timestamp, "INVALID_COMMITMENT");
    require(isAvailable(domain, tld), "DOMAIN_IS_NOT_AVAIABLE");
    require(MAXIMUM_REGISTRATION_DURATION >= durations && durations >= MINIMUM_REGISTRATION_DURATION, "DURATION_TOO_SHORT");
    delete _commitments[commitment];
  }

  function register(
    string memory domain,
    string memory tld,
    address owner,
    uint256 durations,
    bytes32 commitment
  ) public {
    // The durations must be multiple of 365 days
    require(durations % 365 days == 0, "INVALID_DURATIONS");
    uint256 _price = getPrice(domain, tld, durations);
    require(_token.allowance(_msgSender(), address(this)) >= _price, "INSUFFICIENT_BALANCE");
    _consumeCommitment(domain, tld, durations, commitment);
    // TODO: Set record in resolver
    // TODO: Set record in reverse resolver
    _registrar.register(bytes(domain), bytes(tld), address(this), durations);
    _registrar.reclaim(bytes(domain), bytes(tld), owner);
    _registrar.transferFrom(address(this), owner, _registrar.tokenId(bytes(domain), bytes(tld)));
  }

  function renew(
    string memory domain,
    string memory tld,
    uint256 durations
  ) public {
    // The durations must be multiple of 365 days
    require(durations % 365 days == 0, "INVALID_DURATIONS");
    uint256 _price = getPrice(domain, tld, durations);
    require(_token.allowance(_msgSender(), address(this)) >= _price, "INSUFFICIENT_BALANCE");
    _token.transferFrom(_msgSender(), address(this), _price);
    _registrar.renew(bytes(domain), bytes(tld), durations);
  }
}
