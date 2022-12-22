//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IRentalManager {
  event Rented(uint256 tokenId, address user, uint256 expires);
  event Listed(uint256 tokenId, uint256 minimum, uint256 maximum, uint256 cost);
  event Unlisted(uint256 tokenId);

  function unlist(uint256 tokenId) external;

  function list(
    uint256 tokenId,
    uint256 minimum,
    uint256 maximum,
    uint256 cost
  ) external;

  function rent(
    uint256 tokenId,
    uint256 duration,
    address user
  ) external;
}
