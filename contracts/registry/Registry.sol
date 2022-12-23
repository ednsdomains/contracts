//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "../utils/Helper.sol";
import "./interfaces/IRegistry.sol";
import "../lib/TldClass.sol";
import "../wrapper/interfaces/IWrapper.sol";

contract Registry is IRegistry, Helper, AccessControlUpgradeable, UUPSUpgradeable {
  using AddressUpgradeable for address;

  bytes32 internal constant AT = keccak256(bytes("@"));

  address private _owner;

  uint256 public constant GRACE_PERIOD = 30 days;

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");
  bytes32 public constant PUBLIC_RESOLVER_ROLE = keccak256("PUBLIC_RESOLVER_ROLE");
  bytes32 public constant ROOT_ROLE = keccak256("ROOT_ROLE");
  bytes32 public constant WRAPPER_ROLE = keccak256("WRAPPER_ROLE");

  mapping(bytes32 => TldRecord.TldRecord) internal _records;
  mapping(uint256 => TokenRecord.TokenRecord) internal _tokenRecords;

  mapping(address => mapping(address => bool)) private _operatorApprovals;

  mapping(bytes32 => mapping(bytes32 => mapping(bytes32 => mapping(address => bool)))) private _operators; // TLD => Domain => Host

  /* ========== Helper ==========*/

  modifier onlyDomainOwner(bytes32 name, bytes32 tld) {
    require(_msgSender() == _records[tld].domains[name].owner, "ONLY_OWNER");
    _;
  }

  modifier onlyDomainUser(bytes32 name, bytes32 tld) {
    require(_msgSender() == _records[tld].domains[name].user.user, "ONLY_DOMAIN_USER");
    _;
  }

  modifier onlyDomainOperator(bytes32 name, bytes32 tld) {
    require(_msgSender() == _records[tld].domains[name].user.user || _operators[tld][name][AT][_msgSender()], "ONLY_DOMAIN_OPERATOR");
    _;
  }

  modifier onlyHostOperator(
    bytes32 host,
    bytes32 name,
    bytes32 tld
  ) {
    require(
      _msgSender() == _records[tld].domains[name].owner || _records[tld].domains[name].operators[_msgSender()] || _records[tld].domains[name].hosts[host].operators[_msgSender()],
      "ONLY_HOST_OPERATOR"
    );
    _;
  }

  modifier onlyLiveDomain(bytes32 name, bytes32 tld) {
    require(isLive(name, tld), ""); // TODO:
    _;
  }

  modifier onlyTldOwnerOrWrapper(bytes32 tld) {
    require(_msgSender() == _records[tld].owner || _msgSender() == _records[tld].wrapper.address_, "ONLY_OWNER_OR_WRAPPER");
    _;
  }

  modifier onlyDomainOwnerOrWrapper(bytes32 name, bytes32 tld) {
    require(_msgSender() == _records[tld].domains[name].owner || _msgSender() == _records[tld].wrapper.address_, "ONLY_OWNER_OR_WRAPPER");
    _;
  }

  modifier onlyWrapper(bytes32 tld) {
    require(_msgSender() == _records[tld].wrapper.address_, "ONLY_OWNER_OR_WRAPPER");
    _;
  }

  /* ========== Initializer ==========*/

  function initialize() public initializer {
    __Registry_init();
  }

  function __Registry_init() internal onlyInitializing {
    __Registry_init_unchained();
    __UUPSUpgradeable_init();
    __AccessControl_init();
    __ERC165_init();
  }

  function __Registry_init_unchained() internal onlyInitializing {
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _grantRole(ADMIN_ROLE, _msgSender());
  }

  /* ========== Mutative ==========*/

  //Create TLD
  function setRecord(
    bytes memory tld,
    address owner,
    address resolver,
    uint64 expires,
    bool enable,
    TldClass.TldClass class_
  ) public onlyRole(ROOT_ROLE) {
    require(!isExists(keccak256(tld)) && !isExists(getTokenId(tld)), "TLD_EXIST");
    require(owner != address(0x0), "UNDEFINED_OWNER");
    require(resolver != address(0x0), "UNDEFINED_RESOLVER");

    TldRecord.TldRecord storage _record = _records[keccak256(tld)];
    _record.name = tld;
    _record.owner = owner;
    _record.resolver = resolver;
    _record.expires = expires;
    _record.enable = enable;
    _record.class_ = class_;

    uint256 id = getTokenId(tld);

    TokenRecord.TokenRecord storage _tokenRecord = _tokenRecords[id];
    _tokenRecord.type_ = RecordType.RecordType.TLD;
    _tokenRecord.tld = keccak256(tld);

    emit NewTld(class_, tld, owner);

    if (_records[keccak256(tld)].wrapper.enable) {
      IWrapper(_records[keccak256(tld)].wrapper.address_).mint(owner, id);
    }
  }

  //Add name
  function setRecord(
    bytes memory name,
    bytes memory tld,
    address owner,
    address resolver,
    uint64 expires
  ) public onlyRole(REGISTRAR_ROLE) {
    require(owner != address(0x0), "UNDEFINED_OWNER");
    require(isExists(keccak256(tld)), "TLD_NOT_EXIST");

    TokenRecord.TokenRecord memory _token = _tokenRecords[getTokenId(name, tld)];
    if (_token.type_ != RecordType.RecordType.DOMAIN) {
      revert(""); //TODO:
    }

    if (resolver == address(0x0)) {
      resolver = _records[keccak256(tld)].resolver;
    }

    bool isExists_ = isExists(keccak256(name), keccak256(tld));

    uint256 id = getTokenId(name, tld);

    if (_records[keccak256(tld)].wrapper.enable) {
      IWrapper(_records[keccak256(tld)].wrapper.address_).mint(owner, id);
      if (isExists_) {
        _delete(keccak256(name), keccak256(tld));
        IWrapper(_records[keccak256(tld)].wrapper.address_).burn(id);
      }
    }

    DomainRecord.DomainRecord storage _record = _records[keccak256(tld)].domains[keccak256(name)];
    _record.name = name;
    _record.owner = owner;
    _record.resolver = resolver;
    _record.expires = expires;
    emit NewDomain(name, tld, owner, expires);

    TokenRecord.TokenRecord storage _tokenRecord = _tokenRecords[id];
    _tokenRecord.type_ = RecordType.RecordType.DOMAIN;
    _tokenRecord.tld = keccak256(tld);
    _tokenRecord.domain = keccak256(name);
  }

  //Sub Domain
  function setRecord(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    uint16 ttl
  ) public onlyRole(PUBLIC_RESOLVER_ROLE) {
    require(isExists(keccak256(name), keccak256(tld)), "DOMAIN_NOT_EXIST");

    bool isExists_ = isExists(keccak256(host), keccak256(name), keccak256(tld));

    HostRecord.HostRecord storage _record = _records[keccak256(tld)].domains[keccak256(name)].hosts[keccak256(host)];
    _record.name = host;
    _record.ttl = ttl;

    uint256 id = uint256(keccak256(_join(host, name, tld)));
    if (!isExists_) {
      UserRecord.UserRecord storage _user = _records[keccak256(tld)].domains[keccak256(name)].hosts[keccak256(host)].user;
      _user.user = getOwner(keccak256(name), keccak256(tld));
      _user.expires = getExpires(keccak256(name), keccak256(tld));
      // emit UpdateUser(id, getOwner(keccak256(name), keccak256(tld)), getExpires(keccak256(name), keccak256(tld)));
    }

    emit NewHost(host, name, tld);

    TokenRecord.TokenRecord storage _tokenRecord = _tokenRecords[id];
    _tokenRecord.type_ = RecordType.RecordType.HOST;
    _tokenRecord.tld = keccak256(tld);
    _tokenRecord.domain = keccak256(name);
    _tokenRecord.host = keccak256(host);
  }

  //set tld resolve
  function setResolver(bytes32 tld, address resolver_) public onlyRole(ROOT_ROLE) {
    require(isExists(tld), "TLD_NOT_EXIST");
    _records[tld].resolver = resolver_;
    emit SetResolver(_records[tld].name, resolver_);
  }

  function setResolver(
    bytes32 name,
    bytes32 tld,
    address resolver_
  ) public onlyLiveDomain(name, tld) onlyDomainOperator(name, tld) {
    require(isExists(name, tld), "DOMAIN_NOT_EXIST");
    _records[tld].domains[name].resolver = resolver_;
    emit SetResolver(_join(_records[tld].domains[name].name, _records[tld].name), resolver_);
  }

  function setOwner(bytes32 tld, address owner_) public onlyTldOwnerOrWrapper(tld) {
    require(isExists(tld), "TLD_NOT_EXIST");
    _records[tld].owner = owner_;
    emit SetOwner(_records[tld].name, owner_);
  }

  function setOwner(
    bytes32 name,
    bytes32 tld,
    address newOwner
  ) public onlyDomainOwnerOrWrapper(name, tld) {
    require(isExists(name, tld), "DOMAIN_NOT_EXIST");
    _records[tld].domains[name].owner = newOwner;
    emit SetOwner(_join(_records[tld].domains[name].name, _records[tld].name), newOwner);
  }

  function setOperator(
    bytes32 name,
    bytes32 tld,
    address operator_,
    bool approved
  ) public onlyLiveDomain(name, tld) onlyDomainOwner(name, tld) {
    require(isExists(name, tld), "DOMAIN_NOT_EXIST");
    _records[tld].domains[name].operators[operator_] = approved;
    emit SetOperator(_join(_records[tld].domains[name].name, _records[tld].name), operator_, approved);
  }

  function setOperator(
    bytes32 host,
    bytes32 name,
    bytes32 tld,
    address operator_,
    bool approved
  ) public onlyLiveDomain(name, tld) onlyDomainOperator(name, tld) {
    require(isExists(host, name, tld), "HOST_NOT_EXIST");
    _records[tld].domains[name].hosts[host].operators[operator_] = approved;
    emit SetOperator(_join(_records[tld].domains[name].hosts[host].name, _records[tld].domains[name].name, _records[tld].name), operator_, approved);
  }

  function setEnable(bytes32 tld, bool enable) public onlyRole(ROOT_ROLE) {
    require(isExists(tld), "TLD_NOT_EXIST");
    _records[tld].enable = enable;
    emit SetEnable(_records[tld].name, enable);
  }

  function setWrapper(
    bytes32 tld,
    bool enable,
    address address_
  ) public onlyRole(ROOT_ROLE) {
    WrapperRecord.WrapperRecord storage _wrapper = _records[tld].wrapper;
    _wrapper.enable = enable;
    _wrapper.address_ = address_;
    emit SetWrapper(_records[tld].name, address_, enable);
  }

  function setUser(
    bytes32 name,
    bytes32 tld,
    address user,
    uint64 expires
  ) public onlyWrapper(tld) onlyLiveDomain(name, tld) {
    _records[tld].domains[name].user.user = user;
    if (expires == 0) {
      _records[tld].domains[name].user.expires = getExpires(name, tld);
    } else {
      require(expires <= getExpires(name, tld), ""); // TODO:
      _records[tld].domains[name].user.expires = expires;
    }
    emit SetUser(_join(_records[tld].domains[name].name, _records[tld].name), user, expires);
  }

  function setUser(
    bytes32 host,
    bytes32 name,
    bytes32 tld,
    address user,
    uint64 expires
  ) public onlyWrapper(tld) onlyLiveDomain(name, tld) {
    require(isExists(host, name, tld), "HOST_NOT_EXISTS");
    if (expires == 0) {
      _records[tld].domains[name].hosts[host].user.expires = getExpires(name, tld);
    } else {
      require(expires <= getExpires(name, tld), ""); // TODO:
      _records[tld].domains[name].hosts[host].user.expires = expires;
    }
    _records[tld].domains[name].hosts[host].user.user = user;
  }

  function setExpires(bytes32 tld, uint64 expires) public onlyRole(ROOT_ROLE) {
    require(expires > _records[tld].expires && expires > block.timestamp, ""); // TODO:
    _records[tld].expires = expires;
    emit SetExpires(_records[tld].name, expires);
  }

  function setExpires(
    bytes32 name,
    bytes32 tld,
    uint64 expires
  ) public onlyRole(REGISTRAR_ROLE) onlyLiveDomain(name, tld) {
    require(expires > _records[tld].domains[name].expires && expires > block.timestamp, ""); // TODO:
    _records[tld].domains[name].expires = expires;
    emit SetExpires(_join(_records[tld].domains[name].name, _records[tld].name), expires);
  }

  function _delete(bytes32 tld) internal {
    delete _records[tld];
    delete _tokenRecords[getTokenId(_records[tld].name)];
    if (_records[tld].wrapper.enable) {
      IWrapper(_records[tld].wrapper.address_).burn(getTokenId(_records[tld].name));
    }
  }

  function _delete(bytes32 name, bytes32 tld) internal {
    require(getExpires(name, tld) < block.timestamp, "DOMAIN_STILL_ALIVE");
    delete _records[tld].domains[name];
    delete _tokenRecords[getTokenId(_records[tld].domains[name].name, _records[tld].name)];
    if (_records[tld].wrapper.enable) {
      IWrapper(_records[tld].wrapper.address_).burn(getTokenId(_records[tld].domains[name].name, _records[tld].name));
    }
  }

  function _delete(
    bytes32 host,
    bytes32 name,
    bytes32 tld
  ) internal {
    require(isExists(host, name, tld) && getUser(host, name, tld) == getOwner(name, tld), "HOST_USER_NOT_OWNER"); // TODO:
    delete _records[tld].domains[name].hosts[host];
    delete _tokenRecords[getTokenId(_records[tld].domains[name].hosts[host].name, _records[tld].domains[name].name, _records[tld].name)];
    if (_records[tld].wrapper.enable) {
      IWrapper(_records[tld].wrapper.address_).burn(getTokenId(_records[tld].domains[name].hosts[host].name, _records[tld].domains[name].name, _records[tld].name));
    }
  }

  function prune(bytes32 name, bytes32 tld) public onlyDomainOwner(name, tld) onlyLiveDomain(name, tld) {}

  /* ========== Getter - General ==========*/

  function getOwner(bytes32 tld) public view returns (address) {
    require(isExists(tld), "TLD_NOT_FOUND");
    return _records[tld].owner;
  }

  function getOwner(bytes32 name, bytes32 tld) public view returns (address) {
    require(isExists(name, tld), "DOMAIN_NOT_FOUND");
    return _records[tld].domains[name].owner;
  }

  function getResolver(bytes32 tld) public view returns (address) {
    require(isExists(tld), "TLD_NOT_FOUND");
    return _records[tld].resolver;
  }

  function getResolver(bytes32 name, bytes32 tld) public view returns (address) {
    require(isExists(name, tld), "DOMAIN_NOT_FOUND");
    return _records[tld].domains[name].resolver;
  }

  function getExpires(bytes32 tld) public view returns (uint64) {
    return _records[tld].expires;
  }

  // Get the expires date of the name in unix timestamp
  function getExpires(bytes32 name, bytes32 tld) public view returns (uint64) {
    return _records[tld].domains[name].expires;
  }

  // Get the grace period
  function getGracePeriod() public pure returns (uint256) {
    return GRACE_PERIOD;
  }

  function getTldClass(bytes32 tld) public view returns (TldClass.TldClass) {
    return _records[tld].class_;
  }

  function getWrapper(bytes32 tld) public view returns (WrapperRecord.WrapperRecord memory) {
    return _records[tld].wrapper;
  }

  function getTokenRecord(uint256 tokenId_) public view returns (TokenRecord.TokenRecord memory) {
    return _tokenRecords[tokenId_];
  }

  function getUser(bytes32 name, bytes32 tld) public view returns (address) {
    return _records[tld].domains[name].user.user;
  }

  function getUser(
    bytes32 host,
    bytes32 name,
    bytes32 tld
  ) public view returns (address) {
    return _records[tld].domains[name].hosts[host].user.user;
  }

  function getUserExpires(bytes32 name, bytes32 tld) public view returns (uint64) {
    return _records[tld].domains[name].user.expires;
  }

  function getUserExpires(
    bytes32 host,
    bytes32 name,
    bytes32 tld
  ) public view returns (uint64) {
    return _records[tld].domains[name].hosts[host].user.expires;
  }

  function getTtl(
    bytes32 host,
    bytes32 name,
    bytes32 tld
  ) public view returns (uint16) {
    return _records[tld].domains[name].hosts[host].ttl;
  }

  /* ========== Getter - Boolean ==========*/

  function isExists(bytes32 tld) public view returns (bool) {
    return _records[tld].name.length > 0;
  }

  function isExists(bytes32 name, bytes32 tld) public view returns (bool) {
    return _records[tld].domains[name].name.length > 0;
  }

  function isExists(
    bytes32 host,
    bytes32 name,
    bytes32 tld
  ) public view returns (bool) {
    return _records[tld].domains[name].hosts[host].name.length > 0;
  }

  function isExists(uint256 tokenId) public view returns (bool) {
    return _tokenRecords[tokenId].tld.length > 0;
  }

  function isOperator(
    bytes32 name,
    bytes32 tld,
    address _operator
  ) public view returns (bool) {
    return _records[tld].domains[name].operators[_operator];
  }

  function isOperator(
    bytes32 host,
    bytes32 name,
    bytes32 tld,
    address _operator
  ) public view returns (bool) {
    return _records[tld].domains[name].hosts[host].operators[_operator];
  }

  function isOperator(bytes32 name, bytes32 tld) public view returns (bool) {
    return _records[tld].domains[name].operators[_msgSender()];
  }

  function isOperator(
    bytes32 host,
    bytes32 name,
    bytes32 tld
  ) public view returns (bool) {
    return _records[tld].domains[name].hosts[host].operators[_msgSender()];
  }

  // Is the name still alive (not yet expired)
  function isLive(bytes32 name, bytes32 tld) public view returns (bool) {
    return _records[tld].domains[name].expires > block.timestamp;
  }

  // Is the TLD enable and allow to register
  function isEnable(bytes32 tld) public view returns (bool) {
    return _records[tld].enable;
  }

  /* ========== Utils ==========*/

  function getTokenId(bytes memory tld) public pure virtual returns (uint256) {
    return uint256(keccak256(tld));
  }

  function getTokenId(bytes memory name_, bytes memory tld) public pure virtual returns (uint256) {
    return uint256(keccak256(_join(name_, tld)));
  }

  function getTokenId(
    bytes memory host,
    bytes memory name_,
    bytes memory tld
  ) public pure virtual returns (uint256) {
    return uint256(keccak256(_join(host, name_, tld)));
  }

  /* ========== UUPS ==========*/
  function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}

  /* ========== ERC-165 ==========*/
  function supportsInterface(bytes4 interfaceID) public view override(AccessControlUpgradeable) returns (bool) {
    return interfaceID == type(IRegistry).interfaceId || super.supportsInterface(interfaceID);
  }
}
