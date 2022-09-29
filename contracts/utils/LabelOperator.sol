//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

abstract contract LabelOperator {
  uint256 public constant MAX_LABEL_LENGTH = 64;
  uint256 public constant MIN_LABEL_LENGTH = 5;
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
    require(label.length < MAX_LABEL_LENGTH && label.length > MIN_LABEL_LENGTH, "INVALUD_LENGTH");
    for (uint256 i; i < label.length; i++) {
      require(
        (label[i] >= bytes1("a") && label[i] <= bytes1("z")) || (label[i] >= bytes1("0") && label[i] <= bytes1("9")) || label[i] == bytes1("-") || label[i] == bytes1("_")||label[i] == 0x00,
        "INVALID_CHARACTER"
      );
    }
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

  // function _reorg(bytes memory fqdn)
  //   internal
  //   pure
  //   returns (
  //     bytes memory host,
  //     bytes memory name,
  //     bytes memory tld
  //   )
  // {
  //   bytes[] memory labels = new bytes[];
  // }
}
