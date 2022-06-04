// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../BaseResolver.sol";
import "./interfaces/IAddressResolver.sol";

abstract contract AddressResolver is IAddressResolver, BaseResolver {
  mapping(bytes32 => mapping(uint256 => bytes)) private _addresses;

  function setAddr(
    string memory host,
    string memory domain,
    string memory tld,
    uint256 coin,
    string memory address_
  ) public onlyAuthorised(host, domain, tld) {
    if (keccak256(bytes(host)) == keccak256("@")) {
      bytes32 fqdn = keccak256(abi.encodePacked(domain, ".", tld));
      _addresses[fqdn][coin] = bytes(address_);
      emit SetAddress(abi.encodePacked(domain, ".", tld), bytes(host), bytes(domain), bytes(tld), coin, bytes(address_));
    } else {
      require(_validHost(bytes(host)), "INVALID_HOST");
      bytes32 fqdn = keccak256(abi.encodePacked(host, ".", domain, ".", tld));
      _addresses[fqdn][coin] = bytes(address_);
      emit SetAddress(abi.encodePacked(host, ".", domain, ".", tld), bytes(host), bytes(domain), bytes(tld), coin, bytes(address_));
    }
  }

  function addr(
    string memory domain,
    string memory tld,
    uint256 coin
  ) public view returns (bytes memory) {
    bytes32 fqdn = keccak256(abi.encodePacked(domain, ".", tld));
    return _addresses[fqdn][coin];
  }

  function addr(
    string memory host,
    string memory domain,
    string memory tld,
    uint256 coin
  ) public view returns (bytes memory) {
    bytes32 fqdn = keccak256(abi.encodePacked(host, ".", domain, ".", tld));
    return _addresses[fqdn][coin];
  }

  function addr(string memory fqdn_, uint256 coin) public view returns (bytes memory) {
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
