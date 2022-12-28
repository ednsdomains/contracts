//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "../../lib/TldClass.sol";
import "../../lib/TokenRecord.sol";
import "../../lib/TldRecord.sol";
import "../../lib/DomainRecord.sol";
import "../../lib/HostRecord.sol";
import "../../lib/WrapperRecord.sol";

interface IRegistry {
  /* ========== Event ==========*/
  event NewTld(TldClass.TldClass class, bytes tld, address owner);
  event NewDomain(bytes name, bytes tld, address owner, uint64 expires);
  event NewHost(bytes host, bytes name, bytes tld);

  event SetResolver(bytes fqdn, address newResolver);
  event SetOperator(bytes fqdn, address operator, bool approved);
  event SetWrapper(bytes fqdn, address address_, bool enable);
  event SetUser(bytes fqdn, address newUser, uint64 expires);
  event SetOwner(bytes fqdn, address owner);
  event SetEnable(bytes fqdn, bool enable);
  event SetExpires(bytes fqdn, uint64 expires);

  event RemoveHost(bytes fqdn);

  /* ========== Mutative ==========*/
  function setRecord(
    bytes memory tld,
    address owner,
    address resolver,
    uint64 expires,
    bool enable,
    TldClass.TldClass class_
  ) external;

  function setRecord(
    bytes memory name,
    bytes memory tld,
    address owner,
    address resolver,
    uint64 expires
  ) external;

  function setRecord(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    uint16 ttl
  ) external;

  function setResolver(bytes32 tld, address resolver) external;

  function setResolver(
    bytes32 name,
    bytes32 tld,
    address resolver
  ) external;

  function setOwner(bytes32 tld, address newOwner) external;

  function setOwner(
    bytes32 name,
    bytes32 tld,
    address newOwner
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

  function setEnable(bytes32 tld, bool enable) external;

  function setWrapper(
    bytes32 tld,
    bool enable_,
    address wrapper_
  ) external;

  function setUser(
    bytes32 name,
    bytes32 tld,
    address user,
    uint64 expires
  ) external;

  function setUser(
    bytes32 host,
    bytes32 name,
    bytes32 tld,
    address user,
    uint64 expires
  ) external;

  function setExpires(bytes32 tld, uint64 expires) external;

  function setExpires(
    bytes32 name,
    bytes32 tld,
    uint64 expires
  ) external;

  function prune(bytes32 name, bytes32 tld) external;

  /* ========== Query - Genereal ==========*/

  function getOwner(bytes32 tld) external view returns (address);

  function getOwner(bytes32 name, bytes32 tld) external view returns (address);

  function getResolver(bytes32 tld) external view returns (address);

  function getResolver(bytes32 name, bytes32 tld) external view returns (address);

  function getExpires(bytes32 tld) external view returns (uint64);

  function getExpires(bytes32 name, bytes32 tld) external view returns (uint64);

  function getGracePeriod() external view returns (uint256);

  function getTldClass(bytes32 tld) external view returns (TldClass.TldClass);

  function getWrapper(bytes32 tld) external view returns (WrapperRecord.WrapperRecord memory);

  function getTokenRecord(uint256 tokenId) external view returns (TokenRecord.TokenRecord memory);

  function getUser(bytes32 name, bytes32 tld) external view returns (address);

  function getUser(
    bytes32 host,
    bytes32 name,
    bytes32 tld
  ) external view returns (address);

  function getUserExpires(bytes32 name, bytes32 tld) external view returns (uint64);

  function getUserExpires(
    bytes32 host,
    bytes32 name,
    bytes32 tld
  ) external view returns (uint64);

  function getTtl(
    bytes32 host,
    bytes32 name,
    bytes32 tld
  ) external view returns (uint16);

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

  function isLive(bytes32 name, bytes32 tld) external view returns (bool);

  function isEnable(bytes32 tld) external view returns (bool);

  /* ========== Utils ==========*/

  function getTokenId(bytes memory tld) external returns (uint256);

  function getTokenId(bytes memory name, bytes memory tld) external returns (uint256);

  function getTokenId(
    bytes memory host,
    bytes memory name,
    bytes memory tld
  ) external returns (uint256);
}
