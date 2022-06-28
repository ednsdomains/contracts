//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

abstract contract LabelValidator {
  uint256 public constant MAX_LABEL_LENGTH = 32;
  uint256 public constant MIN_LABEL_LENGTH = 5;

  function valid(
    string calldata host,
    string calldata,
    string calldata
  ) public pure virtual returns (bool) {
    return LabelValidator._validHost(bytes(host));
  }

  function valid(string calldata domain, string calldata) public pure virtual returns (bool) {
    return LabelValidator._validDomain(bytes(domain));
  }

  function valid(
    bytes calldata host,
    bytes calldata,
    bytes calldata
  ) public pure virtual returns (bool) {
    return LabelValidator._validHost((host));
  }

  function valid(bytes calldata domain, bytes calldata) public pure virtual returns (bool) {
    return LabelValidator._validDomain(domain);
  }

  function _validHost(bytes calldata label) internal pure virtual returns (bool) {
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

  function _validDomain(bytes calldata label) internal pure virtual returns (bool) {
    //  MAX_LABEL_LENGTH < label.length < MIN_LABEL_LENGTH

    //  require(label.length > MAX_LABEL_LENGTH || label.length < MIN_LABEL_LENGTH, "INVALUD_LENGTH");
    require(label.length < MAX_LABEL_LENGTH && label.length > MIN_LABEL_LENGTH, "INVALUD_LENGTH");
    for (uint256 i; i < label.length; i++) {
      require(
        (label[i] >= bytes1("a") && label[i] <= bytes1("z")) || (label[i] >= bytes1("0") && label[i] <= bytes1("9")) || label[i] == bytes1("-") || label[i] == bytes1("_"),
        "INVALID_CHARACTER"
      );
    }
    return true;
  }
}
