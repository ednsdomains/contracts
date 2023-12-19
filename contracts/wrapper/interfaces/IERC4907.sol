// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

interface IERC4907 {
  // Logged when the user of an NFT is changed or expiry is changed
  /// @notice Emitted when the `user` of an NFT or the `expiry` of the `user` is changed
  /// The zero address for user indicates that there is no user address
  event UpdateUser(uint256 indexed tokenId, address indexed user, uint64 expiry);

  /// @notice set the user and expiry of an NFT
  /// @dev The zero address indicates there is no user
  /// Throws if `tokenId` is not valid NFT
  /// @param user  The new user of the NFT
  /// @param expiry  UNIX timestamp, The new user could use the NFT before expiry
  function setUser(
    uint256 tokenId,
    address user,
    uint64 expiry
  ) external;

  /// @notice Get the user address of an NFT
  /// @dev The zero address indicates that there is no user or the user is expired
  /// @param tokenId The NFT to get the user address for
  /// @return The user address for this NFT
  function userOf(uint256 tokenId) external view returns (address);

  /// @notice Get the user expiry of an NFT
  /// @dev The zero value indicates that there is no user
  /// @param tokenId The NFT to get the user expiry for
  /// @return The user expiry for this NFT
  function userExpiry(uint256 tokenId) external view returns (uint256);
}
