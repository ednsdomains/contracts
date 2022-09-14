//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IRegistry {
  /* ========== Event ==========*/
  event NewTld(bytes tld, address owner);
  event NewDomain(bytes name, bytes tld, address owner);
  event NewHost(bytes host, bytes name, bytes tld);

  event NewOwner(bytes fqdn, address newOwner);
  event NewResolver(bytes fqdn, address newResolver);

  event SetOperator(bytes fqdn, address operator, bool approved);

  /* ========== Mutative ==========*/
  function setRecord(
    bytes memory tld,
    address owner,
    address resolver,
    bool enable,
    bool omni,
    uint16[] memory lzChainIds
  ) external;

  function setRecord(
    bytes memory name,
    bytes memory tld,
    address owner,
    address resolver,
    uint256 expires
  ) external;

  function setRecord(
    bytes memory host,
    bytes memory name,
    bytes memory tld
  ) external;

  function setResolver(bytes32 tld, address resolver) external;

  function setResolver(
    bytes32 name,
    bytes32 tld,
    address resolver
  ) external;

  function setOwner(bytes32 tld, address owner) external;

  function setOwner(
    bytes32 name,
    bytes32 tld,
    address owner
  ) external;

  function setOperator(
    bytes32 name,
    bytes32 tld,
    address operator,
    bool approved
  ) external;

  function setOperator(
    bytes32 host,
    bytes32 name,
    bytes32 tld,
    address operator,
    bool approved
  ) external;

  function setExpires(
    bytes32 name,
    bytes32 tld,
    uint256 expires
  ) external;

  function setEnable(bytes32 tld, bool enable) external;

  // function remove(
  //   bytes32 host,
  //   bytes32 name,
  //   bytes32 tld
  // ) external;

  /* ========== Query - Genereal ==========*/

  function getOwner(bytes32 tld) external view returns (address);

  function getOwner(bytes32 name, bytes32 tld) external view returns (address);

  function getResolver(bytes32 tld) external view returns (address);

  function getResolver(bytes32 name, bytes32 tld) external view returns (address);

  function getExpires(bytes32 name, bytes32 tld) external view returns (uint256);

  function getGracePeriod() external view returns (uint256);

  function getLzChainIds(bytes32 tld) external view returns (uint16[] memory);

  /* ========== Query - Boolean ==========*/

  function isExists(bytes32 tld) external view returns (bool);

  function isExists(bytes32 name, bytes32 tld) external view returns (bool);

  function isExists(
    bytes32 host,
    bytes32 name,
    bytes32 tld
  ) external view returns (bool);

  function isOperator(
    bytes32 name,
    bytes32 tld,
    address _operator
  ) external view returns (bool);

  function isOperator(
    bytes32 host,
    bytes32 name,
    bytes32 tld,
    address _operator
  ) external view returns (bool);

  function isOperator(bytes32 name, bytes32 tld) external view returns (bool);

  function isOperator(
    bytes32 host,
    bytes32 name,
    bytes32 tld
  ) external view returns (bool);

  function isLive(bytes32 name, bytes32 tld) external view returns (bool);

  function isEnable(bytes32 tld) external view returns (bool);

  function isOmni(bytes32 tld) external view returns (bool);
}
