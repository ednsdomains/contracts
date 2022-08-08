// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../BaseResolver.sol";
import "./interfaces/IMultiCoinAddressResolver.sol";

abstract contract MultiCoinAddressResolver is IMultiCoinAddressResolver, BaseResolver {
  mapping(bytes32 => mapping(uint256 => bytes)) internal _multiCoinAddresses;

  function _setMultiCoinAddress(
    bytes memory host,
    bytes memory domain,
    bytes memory tld,
    uint256 coin,
    bytes memory address_
  ) internal {
    _setHostRecord(host, domain, tld);
    bytes32 fqdn;
    if (keccak256(bytes(host)) == AT) {
      fqdn = keccak256(abi.encodePacked(_join(domain, tld)));
    } else {
      require(_validHost(bytes(host)), "INVALID_HOST");
      fqdn = keccak256(abi.encodePacked(_join(host, domain, tld)));
    }
    _multiCoinAddresses[fqdn][coin] = address_;
    emit SetMultiCoinAddress(host, domain, tld, coin, bytes(address_));
  }

  function setMultiCoinAddress(
    bytes memory host,
    bytes memory domain,
    bytes memory tld,
    uint256 coin,
    bytes memory address_
  ) public onlyLive(domain, tld) onlyAuthorised(host, domain, tld) {
    _setMultiCoinAddress(host, domain, tld, coin, address_);
    if (_registry.isOmni(keccak256(tld))) {
      uint16[] memory lzChainIds = _registry.getLzChainIds(keccak256(tld));
      _synchronizer.sync(lzChainIds, abi.encodeWithSignature("setMultiCoinAddress_SYNC(bytes,bytes,bytes,uint256,bytes)", host, domain, tld, coin, address_));
    }
  }

  function setMultiCoinAddress_SYNC(
    bytes memory host,
    bytes memory domain,
    bytes memory tld,
    uint256 coin,
    bytes memory address_
  ) public onlySynchronizer {
    _setMultiCoinAddress(host, domain, tld, coin, address_);
  }

  function getMultiCoinAddress(
    bytes memory host,
    bytes memory domain,
    bytes memory tld,
    uint256 coin
  ) public view onlyLive(domain, tld) returns (bytes memory) {
    if (keccak256(bytes(host)) == AT) {
      return _multiCoinAddresses[keccak256(_join(domain, tld))][coin];
    } else {
      require(_validHost(bytes(host)), "INVALID_HOST");
      return _multiCoinAddresses[keccak256(_join(host, domain, tld))][coin];
    }
  }

  function supportsInterface(bytes4 interfaceID) public view virtual override returns (bool) {
    return interfaceID == type(IMultiCoinAddressResolver).interfaceId || super.supportsInterface(interfaceID);
  }
}
