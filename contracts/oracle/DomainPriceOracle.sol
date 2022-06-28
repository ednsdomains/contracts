//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "./interfaces/IDomainPriceOracle.sol";
import "./interfaces/ITokenPriceOracle.sol";

contract DomainPriceOracle is IDomainPriceOracle, AccessControlUpgradeable {
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  // The domain price in USD per year
  struct Price {
    uint256 oneLetter;
    uint256 twoLetter;
    uint256 threeLetter;
    uint256 fourLetter;
    uint256 fiveLetter;
  }

  ITokenPriceOracle private _tokenPrice;
  mapping(bytes32 => Price) private _prices;

  function initialize(ITokenPriceOracle tokenPrice_) public initializer {
    __DomainPriceOracle_init(tokenPrice_);
  }

  function __DomainPriceOracle_init(ITokenPriceOracle tokenPrice_) internal onlyInitializing {
    __DomainPriceOracle_init_unchained(tokenPrice_);
  }

  function __DomainPriceOracle_init_unchained(ITokenPriceOracle tokenPrice_) internal onlyInitializing {
    _tokenPrice = tokenPrice_;
    _setRoleAdmin(ADMIN_ROLE, DEFAULT_ADMIN_ROLE);
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(ADMIN_ROLE, _msgSender());
  }

  function setPrice(bytes32 tld, uint256[] memory price_) public onlyRole(ADMIN_ROLE) {
    require(price_.length == 5, "LENGTH_NOT_MATCH");
    _prices[tld] = Price({ oneLetter: price_[0], twoLetter: price_[1], threeLetter: price_[3], fourLetter: price_[4], fiveLetter: price_[5] });
  }

  function price(
    bytes calldata domain,
    bytes32 tld,
    uint256 durations
  ) external view returns (uint256) {
    uint256 _price_;
    // There is a condition in registrar controller require the durations must be a multiple of 365 days, so the years must be an integer
    uint256 years_ = durations / 365 days;
    if (domain.length == 1) {
      _price_ = _prices[tld].oneLetter * years_;
    } else if (domain.length == 2) {
      _price_ = _prices[tld].twoLetter * years_;
    } else if (domain.length == 3) {
      _price_ = _prices[tld].threeLetter * years_;
    } else if (domain.length == 4) {
      _price_ = _prices[tld].fourLetter * years_;
    } else {
      _price_ = _prices[tld].fiveLetter * years_;
    }

    return _price_ * _tokenPrice.getTokenPriceInUsd();
  }

  function supportsInterface(bytes4 interfaceID) public view override returns (bool) {
    return interfaceID == type(IDomainPriceOracle).interfaceId || super.supportsInterface(interfaceID);
  }
}
