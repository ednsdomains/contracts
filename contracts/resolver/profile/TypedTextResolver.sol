// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "../BaseResolver.sol";
import "./interfaces/ITypedTextResolver.sol";

abstract contract TypedTextResolver is ITypedTextResolver, BaseResolver {
  mapping(address => mapping(bytes32 => mapping(bytes32 => string))) _typedTexts;

  function _setTypedText(bytes memory host, bytes memory name, bytes memory tld, bytes memory type_, string memory text) internal onlyAuthorised(host, name, tld) {
    bytes32 fqdn = _getFqdn(host, name, tld);
    _typedTexts[_getUser(host, name, tld)][fqdn][keccak256(type_)] = text;
    emit SetTypedText(host, name, tld, type_, text);
  }

  function setTypedText(bytes memory host, bytes memory name, bytes memory tld, bytes memory type_, string memory text) public payable onlyLive(host, name, tld) {
    _setTypedText(host, name, tld, type_, text);
    _afterExec(keccak256(tld), abi.encodeWithSignature("setTypedText(bytes,bytes,bytes,bytes,string)", host, name, tld, type_, text));
  }

  function _unsetTypedText(bytes memory host, bytes memory name, bytes memory tld, bytes memory type_) internal onlyAuthorised(host, name, tld) {
    bytes32 fqdn = _getFqdn(host, name, tld);
    delete _typedTexts[_getUser(host, name, tld)][fqdn][keccak256(type_)];
    emit UnsetTypedText(host, name, tld, type_);
  }

  function unsetTypedText(bytes memory host, bytes memory name, bytes memory tld, bytes memory type_) public payable onlyLive(host, name, tld) {
    _unsetTypedText(host, name, tld, type_);
    _afterExec(keccak256(tld), abi.encodeWithSignature("unsetTypedText(bytes,bytes,bytes,bytes)", host, name, tld, type_));
  }

  function getTypedText(bytes memory host, bytes memory name, bytes memory tld, bytes memory type_) public view onlyLive(host, name, tld) returns (string memory) {
    bytes32 fqdn = _getFqdn(host, name, tld);
    return _typedTexts[_getUser(host, name, tld)][fqdn][keccak256(type_)];
  }

  function supportsInterface(bytes4 interfaceID) public view virtual override returns (bool) {
    return interfaceID == type(TypedTextResolver).interfaceId || super.supportsInterface(interfaceID);
  }

  uint256[50] private __gap;
}
