// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "../BaseResolver.sol";
import "./interfaces/IMultiCoinAddressResolver.sol";

abstract contract MultiCoinAddressResolver is IMultiCoinAddressResolver, BaseResolver {
  mapping(address => mapping(bytes32 => mapping(uint256 => bytes))) internal _multiCoinAddresses;

  function _setMultiCoinAddress(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    uint256 coin,
    bytes memory address_
  ) internal {
    bytes32 fqdn = _getFqdn(host, name, tld);
    _multiCoinAddresses[_getUser(host, name, tld)][fqdn][coin] = address_;
    emit SetMultiCoinAddress(host, name, tld, coin, bytes(address_));
    _afterSet(keccak256(tld), abi.encodeWithSignature("_setMultiCoinAddress(host,name,tld,uint256,bytes)", host, name, tld, coin, address_));
  }

  function setMultiCoinAddress(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    uint256 coin,
    bytes memory address_
  ) public onlyLive(name, tld) onlyAuthorised(host, name, tld) {
    _setMultiCoinAddress(host, name, tld, coin, address_);
  }

  function getMultiCoinAddress(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    uint256 coin
  ) public view onlyLive(name, tld) returns (bytes memory) {
    if (keccak256(bytes(host)) == AT) {
      return _multiCoinAddresses[_getUser(host, name, tld)][keccak256(_join(name, tld))][coin];
    } else {
      require(valid(bytes(host)), "INVALID_HOST");
      return _multiCoinAddresses[_getUser(host, name, tld)][keccak256(_join(host, name, tld))][coin];
    }
  }

  function supportsInterface(bytes4 interfaceID) public view virtual override returns (bool) {
    return interfaceID == type(IMultiCoinAddressResolver).interfaceId || super.supportsInterface(interfaceID);
  }

  uint256[50] private __gap;
}
