// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../BaseResolver.sol";
import "./interfaces/ITypedTextResolver.sol";

abstract contract TypedTextResolver is ITypedTextResolver, BaseResolver {
  mapping(bytes32 => mapping(bytes32 => string)) _typedTexts;

  function _setTypedText(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    bytes memory type_,
    string memory text
  ) internal onlyAuthorised(host, name, tld) {
    bytes32 fqdn;
    if (keccak256(bytes(host)) == AT) {
      fqdn = keccak256(_join(name, tld));
    } else {
      require(_validHost(bytes(host)), "INVALID_HOST");
      fqdn = keccak256(_join(host, name, tld));
    }
    _typedTexts[fqdn][keccak256(type_)] = text;
    emit SetTypedText(host, name, tld, type_, text);
  }

  function setTypedText(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    bytes memory type_,
    string memory text
  ) public onlyLive(name, tld) {
    _setHostRecord(host, name, tld);
    _setTypedText(host, name, tld, type_, text);
  }

  function getTypedText(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    bytes memory type_
  ) public view onlyLive(name, tld) returns (string memory) {
    bytes32 fqdn;
    if (keccak256(bytes(host)) == AT) {
      fqdn = keccak256(_join(name, tld));
    } else {
      require(_validHost(bytes(host)), "INVALID_HOST");
      fqdn = keccak256(_join(host, name, tld));
    }
    return _typedTexts[fqdn][keccak256(type_)];
  }

  function supportsInterface(bytes4 interfaceID) public view virtual override returns (bool) {
    return interfaceID == type(TypedTextResolver).interfaceId || super.supportsInterface(interfaceID);
  }
}
