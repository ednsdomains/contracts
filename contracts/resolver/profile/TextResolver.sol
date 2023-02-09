// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "../BaseResolver.sol";
import "./interfaces/ITextResolver.sol";

abstract contract TextResolver is ITextResolver, BaseResolver {
  mapping(address => mapping(bytes32 => string)) internal _texts;

  function _setText(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    string memory text
  ) internal {
    bytes32 fqdn = _getFqdn(host, name, tld);
    _texts[_getUser(host, name, tld)][fqdn] = text;
    emit SetText(host, name, tld, text);
  }

  function setText(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    string memory text
  ) public onlyLive(name, tld) onlyAuthorised(host, name, tld) {
    _setText(host, name, tld, text);
  }

  function getText(
    bytes memory host,
    bytes memory name,
    bytes memory tld
  ) public view onlyLive(name, tld) returns (string memory) {
    bytes32 fqdn = _getFqdn(host, name, tld);
    return _texts[_getUser(host, name, tld)][fqdn];
  }

  function supportsInterface(bytes4 interfaceID) public view virtual override returns (bool) {
    return interfaceID == type(ITextResolver).interfaceId || super.supportsInterface(interfaceID);
  }

  uint256[50] private __gap;
}
