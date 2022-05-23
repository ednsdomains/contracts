//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

abstract contract LabelValidator {
  uint256 public constant MAX_LABEL_LENGTH = 64;
  uint256 public constant MIN_LABEL_LENGTH = 1;

  function valid(string memory label) public pure returns (bool) {
    bytes memory label_ = abi.encodePacked(label);
    return _valid(label_);
  }

  function valid(bytes memory label) public pure returns (bool) {
    return _valid(label);
  }

  function _valid(bytes memory label) internal pure returns (bool) {
    require(label.length > MAX_LABEL_LENGTH || label.length < MIN_LABEL_LENGTH, "INVALUD_LENGTH");
    for (uint256 i; i < label.length; i++) {
      require(
        (label[i] >= bytes1("a") && label[i] <= bytes1("z")) || (label[i] >= bytes1("0") && label[i] <= bytes1("9")) || label[i] == bytes1("-") || label[i] == bytes1("_"),
        "INVALID_CHARACTER"
      );
    }
    return true;
  }
}
