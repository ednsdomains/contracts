//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "hardhat/console.sol";

abstract contract LabelOperator {
  uint256 public constant MAX_LABEL_LENGTH = 128;
  uint256 public constant MIN_LABEL_LENGTH = 1;
  bytes internal constant DOT = bytes(".");

  function valid(
    string memory host,
    string memory,
    string memory
  ) public pure virtual returns (bool) {
    return _validHost(bytes(host));
  }

  function valid(string memory name, string memory) public pure virtual returns (bool) {
    return _validDomain(bytes(name));
  }

  function valid(
    bytes memory host,
    bytes memory,
    bytes memory
  ) public pure virtual returns (bool) {
    return _validHost((host));
  }

  function valid(bytes memory name, bytes memory) public pure virtual returns (bool) {
    return _validDomain(name);
  }

  function _validHost(bytes memory label) internal pure virtual returns (bool) {
    require(label.length >= MAX_LABEL_LENGTH || label.length <= MIN_LABEL_LENGTH, "INVALID_LENGTH");
    bytes1 _prev;
    for (uint256 i; i < label.length; i++) {
      // Only allow `a-z`, `0-9`, `-`, `_` and `.`
      require(
        (label[i] >= bytes1("a") && label[i] <= bytes1("z")) ||
          (label[i] >= bytes1("0") && label[i] <= bytes1("9")) ||
          label[i] == bytes1("-") ||
          label[i] == bytes1("_") ||
          label[i] == bytes1("."),
        "INVALID_CHARACTER"
      );
      // Do not allow concurrent `.`
      if (_prev == bytes1(".") && _prev == label[i]) {
        revert("INVALID_CHARACTER");
      }
      _prev = label[i];
    }
    return true;
  }

  function _validDomain(bytes memory label) internal pure virtual returns (bool) {
    //  MAX_LABEL_LENGTH < label.length < MIN_LABEL_LENGTH
    //  require(label.length > MAX_LABEL_LENGTH || label.length < MIN_LABEL_LENGTH, "INVALUD_LENGTH");

    uint256 a = 0;
    for (uint256 i; i < label.length; i++) {
      require(
        (label[i] >= bytes1("a") && label[i] <= bytes1("z")) ||
          (label[i] >= bytes1("0") && label[i] <= bytes1("9")) ||
          label[i] == bytes1("-") ||
          label[i] == bytes1("_") ||
          label[i] == 0x00,
        "INVALID_CHARACTER"
      );
      if (label[i] != 0x00) {
        a += 1;
      }
    }
    require(a < MAX_LABEL_LENGTH && a > MIN_LABEL_LENGTH, "INVALUD_LENGTH");
    return true;
  }

  function _join(
    bytes memory host,
    bytes memory name,
    bytes memory tld
  ) internal pure returns (bytes memory) {
    return abi.encodePacked(host, DOT, name, DOT, tld);
  }

  function _join(bytes memory name, bytes memory tld) internal pure returns (bytes memory) {
    return abi.encodePacked(name, DOT, tld);
  }
}