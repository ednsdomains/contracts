// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "../BaseResolver.sol";
import "./interfaces/IAddressResolver.sol";

abstract contract AddressResolver is IAddressResolver, BaseResolver {
  uint256 public constant MAX_LENGTH = 256;
  uint256 public constant MIN_LENGTH = 1;
  mapping(bytes32 => mapping(uint256 => bytes)) private _addresses;

  function _valid(bytes memory host) internal pure returns (bool) {
    if (host.length > MAX_LENGTH || host.length < MIN_LENGTH) return false;
    for (uint256 i; i < host.length; i++) {
      if (!((host[i] >= bytes1("a") && host[i] <= bytes1("z")) || (host[i] >= bytes1("0") && host[i] <= bytes1("9")) || host[i] == bytes1("-") || host[i] == bytes1("_"))) {
        return false;
      }
    }
    return true;
  }

  function setAddr(
    string memory host,
    string memory domain,
    string memory tld,
    uint256 coin,
    string memory address_
  ) public {
    require(isAuthorised(domain, tld), "FORBIDDEN_ACCESS");
    require(_valid(bytes(host)), "INVALUD_HOST");
    bytes32 fqdn = keccak256(abi.encodePacked(host, ".", domain, ".", tld));
    _addresses[fqdn][coin] = bytes(address_);
    emit SetAddress(abi.encodePacked(host, ".", domain, ".", tld), bytes(host), bytes(domain), bytes(tld), coin, bytes(address_));
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
