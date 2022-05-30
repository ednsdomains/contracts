// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol";
import "../utils/LabelValidator.sol";

abstract contract BaseResolver is ERC165Upgradeable, LabelValidator {
  function isAuthorised(string memory domain, string memory tld) internal view virtual returns (bool);

  function isAuthorised(bytes32 domain, bytes32 tld) internal view virtual returns (bool);

  function isAuthorised(
    string memory host,
    string memory domain,
    string memory tld
  ) internal view virtual returns (bool);

  function isAuthorised(
    bytes32 host,
    bytes32 domain,
    bytes32 tld
  ) internal view virtual returns (bool);

  modifier domainAuthorised(bytes32 domain, bytes32 tld) {
    require(isAuthorised(domain, tld), "FORBIDDEN_ACCESS");
    _;
  }

  modifier hostAuthorised(
    bytes32 host,
    bytes32 domain,
    bytes32 tld
  ) {
    require(isAuthorised(host, domain, tld), "FORBIDDEN_ACCESS");
    _;
  }
}
