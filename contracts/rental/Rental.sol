//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./interface/IRental.sol";
import "../wrapper/interfaces/IWrapper.sol";
import "../lib/TokenRecord.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Rental is IRental, AccessControlUpgradeable, UUPSUpgradeable, PausableUpgradeable {
  IERC20 private _token;

  uint256 public MINIMUM_RENTAL_PERIOD = 30 days;

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  mapping(uint256 => Order) private _orders;

  function initialize(IERC20 token_) public initializer {
    __Rental_init(token_);
  }

  function __Rental_init(IERC20 token_) internal onlyInitializing {
    __Rental_init_unchained(token_);
  }

  function __Rental_init_unchained(IERC20 token_) internal onlyInitializing {
    _token = token_;
  }

  function list(
    address wrapper,
    uint256 tokenId,
    uint64 expires,
    uint256 amount
  ) public whenNotPaused {
    require(IWrapper(wrapper).supportsInterface(type(IWrapper).interfaceId), ""); // TODO:
    require(expires + MINIMUM_RENTAL_PERIOD >= block.timestamp, ""); // TODO:
    require(block.timestamp + MINIMUM_RENTAL_PERIOD >= IWrapper(wrapper).userExpires(tokenId), ""); // TODO
    require(amount > 0, ""); // TODO:
    require(IWrapper(wrapper).userOf(tokenId) == _msgSender(), ""); // TODO:

    if (_orders[tokenId].creator != address(0)) delete _orders[tokenId];
    _orders[tokenId] = Order({ creator: _msgSender(), expires: expires, amount: amount });

    emit Listed(tokenId, expires, amount);
  }

  function unlist(address wrapper, uint256 tokenId) public whenNotPaused {
    require(IWrapper(wrapper).userOf(tokenId) == _msgSender() || _orders[tokenId].creator == _msgSender(), ""); // TODO:
    delete _orders[tokenId];
    emit Unlisted(tokenId);
  }

  function rent(
    address wrapper,
    uint256 tokenId,
    address newUser
  ) public whenNotPaused {
    require(IWrapper(wrapper).supportsInterface(type(IWrapper).interfaceId), ""); // TODO:
    require(IWrapper(wrapper).userOf(tokenId) == _orders[tokenId].creator && IWrapper(wrapper).userExpires(tokenId) > block.timestamp + MINIMUM_RENTAL_PERIOD, ""); // TODO:
    require(_token.balanceOf(_msgSender()) >= _orders[tokenId].amount && _token.allowance(_msgSender(), address(this)) >= _orders[tokenId].amount, "INSUFFICIENT_FUND");

    _token.transferFrom(_msgSender(), _orders[tokenId].creator, _orders[tokenId].amount);

    IWrapper(wrapper).setUser(tokenId, newUser, _orders[tokenId].expires);

    emit Rented(tokenId, newUser);

    delete _orders[tokenId];
  }

  function pause() public onlyRole(ADMIN_ROLE) {
    _pause();
  }

  function unpause() public onlyRole(ADMIN_ROLE) {
    _unpause();
  }

  function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}
}
