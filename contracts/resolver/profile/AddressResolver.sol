// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../BaseResolver.sol";
import "./interfaces/IAddressResolver.sol";

abstract contract AddressResolver is IAddressResolver, BaseResolver {
  mapping(bytes32 => mapping(uint256 => bytes)) internal _addresses;

  function setAddr(
    bytes calldata host,
    bytes calldata domain,
    bytes calldata tld,
    uint256 coin,
    bytes calldata address_
  ) public onlyLive(domain, tld) onlyAuthorised(host, domain, tld) {
    _setAddress(host, domain, tld, coin, address_);
    if (_registry.omni(keccak256(tld))) _synchronizer.sync(abi.encodeWithSignature("setAddr_SYNC(bytes, bytes, bytes, uint256, bytes)", host, domain, tld, coin, address_));
  }

  function setAddr_SYNC(
    bytes calldata host,
    bytes calldata domain,
    bytes calldata tld,
    uint256 coin,
    bytes calldata address_
  ) public onlySynchronizer {
    _setAddress(host, domain, tld, coin, address_);
  }

  function _setAddress(
    bytes calldata host,
    bytes calldata domain,
    bytes calldata tld,
    uint256 coin,
    bytes calldata address_
  ) internal {
    _setHostRecord(host, domain, tld);
    bytes32 fqdn;
    if (keccak256(bytes(host)) == AT) {
      fqdn = keccak256(abi.encodePacked(domain, DOT, tld));
    } else {
      require(_validHost(bytes(host)), "INVALID_HOST");
      fqdn = keccak256(abi.encodePacked(host, DOT, domain, DOT, tld));
    }
    _addresses[fqdn][coin] = address_;
    emit SetAddress(bytes(host), bytes(domain), bytes(tld), coin, bytes(address_));
  }

  function addr(
    bytes calldata domain,
    bytes calldata tld,
    uint256 coin
  ) public view returns (bytes memory) {
    bytes32 fqdn = keccak256(abi.encodePacked(domain, DOT, tld));
    return _addresses[fqdn][coin];
  }

  function addr(
    bytes calldata host,
    bytes calldata domain,
    bytes calldata tld,
    uint256 coin
  ) public view returns (bytes memory) {
    bytes32 fqdn = keccak256(abi.encodePacked(host, DOT, domain, DOT, tld));
    return _addresses[fqdn][coin];
  }

  function addr(bytes calldata fqdn_, uint256 coin) public view returns (bytes memory) {
    bytes32 fqdn = keccak256(bytes(fqdn_));
    return _addresses[fqdn][coin];
  }

  function addr(bytes32 fqdn, uint256 coin) public view returns (bytes memory) {
    return _addresses[fqdn][coin];
  }

  function supportsInterface(bytes4 interfaceID) public view virtual override returns (bool) {
    return interfaceID == type(IAddressResolver).interfaceId || super.supportsInterface(interfaceID);
  }
}
