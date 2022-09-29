//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "../lib/TldClass.sol";
import "./IERC4907.sol";

interface IRegistry is IERC721Upgradeable, IERC4907 {
  /* ========== Event ==========*/
  event NewTld(bytes tld, address owner);
  event NewDomain(bytes name, bytes tld, address owner);
  event NewHost(bytes host, bytes name, bytes tld);

  event NewOwner(bytes fqdn, address newOwner);
  event NewResolver(bytes fqdn, address newResolver);

  event SetOperator(bytes fqdn, address operator, bool approved);

  /* ========== ERC721 -Event ==========*/
  // event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
  // event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
  // event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

  /* ========== ERC4907 -Event ==========*/
  // event UpdateUser(uint256 indexed tokenId, address indexed user, uint64 expires);

  enum RecordType {
    TLD,
    DOMAIN,
    HOST
  }

  /* ========== Struct ==========*/
  struct TokenRecord {
    RecordType class_;
    bytes32 tld;
    bytes32 domain;
    bytes32 host;
  }
  struct TldRecord {
    bytes name; // The name of the TLD - '.meta' or '.ass'
    address owner; // The owner of thr TLD, it should always be the `Root` contract address
    address resolver; // The contract address of the resolver, it used the `PublicResolver` as default
    bool enable; // Is this TLD enable to register new name
    TldClass.TldClass class_;
    mapping(bytes32 => DomainRecord) domains;
  }
  struct DomainRecord {
    bytes name; // The name of the name name, if the FQDN is `edns.meta`, then this will be `bytes('edns')`
    address owner; // The owner of the name
    address resolver; //  The contract address of the resolver, it used the `PublicResolver` as default
    uint64 expires; // The expiry unix timestamp of the name
    Rental rental;
    mapping(address => bool) operators;
    mapping(bytes32 => HostRecord) hosts;
  }

  struct HostRecord {
    bytes name;
    Rental rental;
    mapping(address => bool) operators;
  }

  struct Rental {
    address user;
    uint64 expires;
  }

  /* ========== Mutative ==========*/
  function setRecord(
    bytes memory tld,
    address owner,
    address resolver,
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
    uint64 expires
  ) external;

  function setEnable(bytes32 tld, bool enable) external;

  function remove(bytes32 name, bytes32 tld) external;

  function remove(
    bytes32 host,
    bytes32 name,
    bytes32 tld
  ) external;

  /* ========== Query - Genereal ==========*/

  function getOwner(bytes32 tld) external view returns (address);

  function getOwner(bytes32 name, bytes32 tld) external view returns (address);

  function getResolver(bytes32 tld) external view returns (address);

  function getResolver(bytes32 name, bytes32 tld) external view returns (address);

  function getExpires(bytes32 name, bytes32 tld) external view returns (uint64);

  function getGracePeriod() external view returns (uint256);

  // function getLzChainIds(bytes32 tld) external view returns (uint16[] memory);

  function getTldClass(bytes32 tld) external view returns (TldClass.TldClass);

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

  // function isOmni(bytes32 tld) external view returns (bool);

  /* ========== Utils ==========*/

  function getTokenId(bytes memory tld) external returns (uint256);

  function getTokenId(bytes memory name, bytes memory tld) external returns (uint256);

  function getTokenId(
    bytes memory host,
    bytes memory name,
    bytes memory tld
  ) external returns (uint256);
}
