// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../BaseResolver.sol";
import "./interfaces/IMultiCoinAddressResolver.sol";

abstract contract MultiCoinAddressResolver is IMultiCoinAddressResolver, BaseResolver {
  mapping(bytes32 => mapping(uint256 => bytes)) internal _multiCoinAddresses;

  function _setMultiCoinAddress(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    uint256 coin,
    bytes memory address_
  ) internal {
    _setHostRecord(host, name, tld);
    bytes32 fqdn;
    if (keccak256(bytes(host)) == AT) {
      fqdn = keccak256(abi.encodePacked(_join(name, tld)));
    } else {
      require(_validHost(bytes(host)), "INVALID_HOST");
      fqdn = keccak256(abi.encodePacked(_join(host, name, tld)));
    }
    _multiCoinAddresses[fqdn][coin] = address_;
    emit SetMultiCoinAddress(host, name, tld, coin, bytes(address_));
  }

  function setMultiCoinAddress(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    uint256 coin,
    bytes memory address_
  ) public onlyLive(name, tld) onlyAuthorised(host, name, tld) {
    _setMultiCoinAddress(host, name, tld, coin, address_);
    // if (_registry.isOmni(keccak256(tld))) {
    //   uint16[] memory lzChainIds = _registry.getLzChainIds(keccak256(tld));
    //   _synchronizer.sync(lzChainIds, abi.encodeWithSignature("setMultiCoinAddress_SYNC(bytes,bytes,bytes,uint256,bytes)", host, name, tld, coin, address_));
    // }
  }

  function setMultiCoinAddress_SYNC(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    uint256 coin,
    bytes memory address_
  ) public onlySynchronizer {
    _setMultiCoinAddress(host, name, tld, coin, address_);
  }

  function getMultiCoinAddress(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    uint256 coin
  ) public view onlyLive(name, tld) returns (bytes memory) {
    if (keccak256(bytes(host)) == AT) {
      return _multiCoinAddresses[keccak256(_join(name, tld))][coin];
    } else {
      require(_validHost(bytes(host)), "INVALID_HOST");
      return _multiCoinAddresses[keccak256(_join(host, name, tld))][coin];
    }
  }

  function supportsInterface(bytes4 interfaceID) public view virtual override returns (bool) {
    return interfaceID == type(IMultiCoinAddressResolver).interfaceId || super.supportsInterface(interfaceID);
  }
}
