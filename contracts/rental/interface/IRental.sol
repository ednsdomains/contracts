// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

interface IRental {
  event Rented(uint256 tokenId, address newUser);
  event Listed(uint256 indexed tokenId, uint64 indexed expiry, uint256 indexed amount);
  event Unlisted(uint256 tokenId);

  struct Order {
    address creator;
    uint64 expiry;
    uint256 amount;
  }

  function list(
    address wrapper,
    uint256 tokenId,
    uint64 expiry,
    uint256 amount
  ) external;

  function unlist(address wrapper, uint256 tokenId) external;

  function rent(
    address wrapper,
    uint256 tokenId,
    address newUser
  ) external;
}
