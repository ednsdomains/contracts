// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../BaseResolver.sol";
import "./interfaces/ITextResolver.sol";

abstract contract TextResolver is ITextResolver, BaseResolver {
  //    mapping(bytes32=>mapping(string=>string)) texts;
  mapping(bytes32 => string) internal _texts;

  function _setText(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    string memory text
  ) internal {
    _setHostRecord(host, name, tld);
    bytes32 fqdn;
    if (keccak256(bytes(host)) == AT) {
      fqdn = keccak256(_join(name, tld));
    } else {
      require(_validHost(bytes(host)), "INVALID_HOST");
      fqdn = keccak256(_join(host, name, tld));
    }
    _texts[fqdn] = text;
    emit SetText(host, name, tld, text);
  }

  function setText(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    //        bytes32 type_,
    string memory text
  ) public onlyLive(name, tld) onlyAuthorised(host, name, tld) {
    _setText(host, name, tld, text);
  }

  // function setText_SYNC(
  //   bytes memory host,
  //   bytes memory name,
  //   bytes memory tld,
  //   //    bytes32 type_,
  //   string memory text
  // ) public onlyLive(name, tld) onlyAuthorised(host, name, tld) {
  //   _setText(host, name, tld, text);
  // }

  function getText(
    bytes memory host,
    bytes memory name,
    bytes memory tld
  )
    public
    view
    //        bytes32 type_
    onlyLive(name, tld)
    returns (string memory)
  {
    bytes32 fqdn;
    if (keccak256(bytes(host)) == AT) {
      fqdn = keccak256(_join(name, tld));
    } else {
      require(_validHost(bytes(host)), "INVALID_HOST");
      fqdn = keccak256(_join(host, name, tld));
    }
    return _texts[fqdn];
  }

  function supportsInterface(bytes4 interfaceID) public view virtual override returns (bool) {
    return interfaceID == type(ITextResolver).interfaceId || super.supportsInterface(interfaceID);
  }
}
