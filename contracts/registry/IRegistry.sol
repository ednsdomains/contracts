//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IRegistry {
  event NewTld(bytes tld, address owner);
  event NewDomain(bytes domain, bytes tld, address owner);
  event NewHost(bytes host, bytes domain, bytes tld);

  event NewOwner(bytes fqdn, address newOwner);
  event NewResolver(bytes fqdn, address newResolver);

  event SetOperator(bytes fqdn, address operator, bool approved);

  function setRecord(
    bytes memory tld,
    address owner,
    address resolver,
    bool enable,
    bool omni
  ) external;

  function setRecord(
    bytes memory domain,
    bytes memory tld,
    address owner,
    address resolver,
    uint256 expiry
  ) external;

  function setRecord(
    bytes memory host,
    bytes memory domain,
    bytes memory tld
  ) external;

  function setResolver(bytes32 tld, address resolver) external;

  function setResolver(
    bytes32 domain,
    bytes32 tld,
    address resolver
  ) external;

  function setOwner(bytes32 tld, address owner) external;

  function setOwner(
    bytes32 domain,
    bytes32 tld,
    address owner
  ) external;

  function setOperator(
    bytes32 domain,
    bytes32 tld,
    address operator,
    bool approved
  ) external;

  function setOperator(
    bytes32 host,
    bytes32 domain,
    bytes32 tld,
    address operator,
    bool approved
  ) external;

  function setExpiry(
    bytes32 domain,
    bytes32 tld,
    uint256 expiry
  ) external;

  function setEnable(bytes32 tld, bool enable) external;

  function owner(bytes32 tld) external view returns (address);

  function owner(bytes32 domain, bytes32 tld) external view returns (address);

  function resolver(bytes32 tld) external view returns (address);

  function resolver(bytes32 domain, bytes32 tld) external view returns (address);

  function exists(bytes32 tld) external view returns (bool);

  function exists(bytes32 domain, bytes32 tld) external view returns (bool);

  function exists(
    bytes32 host,
    bytes32 domain,
    bytes32 tld
  ) external view returns (bool);

  function operator(
    bytes32 domain,
    bytes32 tld,
    address _operator
  ) external view returns (bool);

  function operator(
    bytes32 host,
    bytes32 domain,
    bytes32 tld,
    address _operator
  ) external view returns (bool);

  function operator(bytes32 domain, bytes32 tld) external view returns (bool);

  function operator(
    bytes32 host,
    bytes32 domain,
    bytes32 tld
  ) external view returns (bool);

  function expiry(bytes32 domain, bytes32 tld) external view returns (uint256);

  function gracePeriod() external view returns (uint256);

  function live(bytes32 domain, bytes32 tld) external view returns (bool);

  function enable(bytes32 tld) external view returns (bool);

  function omni(bytes32 tld) external view returns (bool);
}
