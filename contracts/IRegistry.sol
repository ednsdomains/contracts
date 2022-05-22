//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IRegistry {
  event NewTld(string tld, address owner);
  event NewDomain(string domain, string tld, address owner);
  event NewHost(string host, string domain, string tld);

  event NewOwner(string fqdn, address newOwner);
  event NewResolver(string fqdn, address newResolver);

  event SetOperator(string fqdn, address operator, bool approved);
  event SetTtl(string fqdn, uint256 ttl);

  function setRecord(
    string memory tld,
    address owner,
    address resolver
  ) external;

  function setRecord(
    string memory domain,
    string memory tld,
    address owner,
    address resolver,
    uint256 ttl
  ) external;

  function setRecord(
    string memory host,
    string memory domain,
    string memory tld,
    uint256 ttl
  ) external;

  function setResolver(bytes32 tld, address resolver) external;

  function setResolver(
    bytes32 domain,
    bytes32 tld,
    address resolver
  ) external;

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

  function setTtl(
    bytes32 domain,
    bytes32 tld,
    uint256 ttl
  ) external;

  function setTtl(
    bytes32 host,
    bytes32 domain,
    bytes32 tld,
    uint256 ttl
  ) external;

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
}
