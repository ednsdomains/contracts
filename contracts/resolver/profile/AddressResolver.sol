// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../BaseResolver.sol";
import "./interfaces/IAddressResolver.sol";

abstract contract AddressResolver is IAddressResolver, BaseResolver {
  mapping(bytes32 => address) internal _addresses;
  mapping(address => bytes) internal _reverseAddresses;

  function _setAddress(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    address address_
  ) internal {
    _setHostRecord(host, name, tld);
    bytes32 fqdn;
    if (keccak256(bytes(host)) == AT) {
      fqdn = keccak256(_join(name, tld));
    } else {
      require(_validHost(bytes(host)), "INVALID_HOST");
      fqdn = keccak256(_join(host, name, tld));
    }
    _addresses[fqdn] = address_;
    emit SetAddress(host, name, tld, address_);
  }

  function setAddress(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    address address_
  ) public onlyLive(name, tld) onlyAuthorised(host, name, tld) {
    _setAddress(host, name, tld, address_);
    // if (_registry.isOmni(keccak256(tld))) {
    //   uint16[] memory lzChainIds = _registry.getLzChainIds(keccak256(tld));
    //   _synchronizer.sync(lzChainIds, abi.encodeWithSignature("setAddress_SYNC(bytes,bytes,bytes,address)", host, name, tld, address_));
    // }
  }

  function setAddress_SYNC(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    address address_
  ) public onlySynchronizer {
    _setAddress(host, name, tld, address_);
  }

  function getAddress(
    bytes memory host,
    bytes memory name,
    bytes memory tld
  ) public view onlyLive(name, tld) returns (address) {
    if (keccak256(bytes(host)) == AT) {
      return _addresses[keccak256(_join(name, tld))];
    } else {
      require(_validHost(bytes(host)), "INVALID_HOST");
      return _addresses[keccak256(_join(host, name, tld))];
    }
  }

  function _setReverseAddress(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    address address_
  ) internal {
    _setHostRecord(host, name, tld);
    bytes memory fqdn;
    if (keccak256(bytes(host)) == AT) {
      fqdn = _join(name, tld);
    } else {
      require(_validHost(bytes(host)), "INVALID_HOST");
      fqdn = _join(host, name, tld);
    }
    _reverseAddresses[address_] = fqdn;
    emit SetAddress(host, name, tld, address_);
  }

  function setReverseAddress(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    address address_
  ) public onlyLive(name, tld) onlyAuthorised(host, name, tld) {
    _setReverseAddress(host, name, tld, address_);
    // if (_registry.isOmni(keccak256(tld))) {
    //   uint16[] memory lzChainIds = _registry.getLzChainIds(keccak256(tld));
    //   _synchronizer.sync(lzChainIds, abi.encodeWithSignature("setAddress_SYNC(bytes,bytes,bytes,address)", host, name, tld, address_));
    // }
  }

  function setReverseAddress_SYNC(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    address address_
  ) public onlySynchronizer {
    _setReverseAddress(host, name, tld, address_);
  }

  function getReverseAddress(address address_) public view returns (string memory) {
    return string(_reverseAddresses[address_]);
  }

  function supportsInterface(bytes4 interfaceID) public view virtual override returns (bool) {
    return interfaceID == type(IAddressResolver).interfaceId || super.supportsInterface(interfaceID);
  }
}
