//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../BaseResolver.sol";
import "./interfaces/IReverseResolver.sol";

abstract contract ReverseResolver is IReverseResolver, BaseResolver {
  mapping(bytes32 => bytes) internal _reverseRecords;

  function setReverseRecord(
    bytes calldata host,
    bytes calldata domain,
    bytes calldata tld,
    bytes calldata address_
  ) public onlyLive(domain, tld) onlyAuthorised(host, domain, tld) {
    _setReverseRecord(host, domain, tld, address_);
    if (_registry.omni(keccak256(tld))) _synchronizer.sync(abi.encodeWithSignature("setReverseRecord_SYNC(bytes,bytes,bytes,bytes)", host, domain, tld, address_));
  }

  function setReverseRecord_SYNC(
    bytes calldata host,
    bytes calldata domain,
    bytes calldata tld,
    bytes calldata address_
  ) public onlySynchronizer {
    _setReverseRecord(host, domain, tld, address_);
  }

  function _setReverseRecord(
    bytes calldata host,
    bytes calldata domain,
    bytes calldata tld,
    bytes calldata address_
  ) public onlyLive(domain, tld) onlyAuthorised(host, domain, tld) {
    _setHostRecord(host, domain, tld);
    bytes memory fqdn;
    if (keccak256(bytes(host)) == AT) {
      fqdn = abi.encodePacked(domain, DOT, tld);
    } else {
      require(_validHost(bytes(host)), "INVALID_HOST");
      fqdn = abi.encodePacked(host, DOT, domain, DOT, tld);
    }
    _reverseRecords[keccak256(address_)] = fqdn;
    emit SetReverseRecord(bytes(host), bytes(domain), bytes(tld), bytes(address_));
  }

  function reverse(bytes calldata address_) external view returns (bytes memory) {
    return _reverseRecords[keccak256(address_)];
  }

  function supportsInterface(bytes4 interfaceID) public view virtual override returns (bool) {
    return interfaceID == type(IReverseResolver).interfaceId || super.supportsInterface(interfaceID);
  }
}
