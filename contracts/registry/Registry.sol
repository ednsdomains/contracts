// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "../utils/Helper.sol";
import "./interfaces/IRegistry.sol";
import "../lib/TldClass.sol";
import "../wrapper/interfaces/IWrapper.sol";
import "../lib/UserRecord.sol";

contract Registry is IRegistry, Helper, AccessControlUpgradeable, UUPSUpgradeable {
  bytes32 internal constant AT = keccak256(bytes("@"));

  address private _owner;

  uint256 public constant GRACE_PERIOD = 30 days;

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
  bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");
  bytes32 public constant ROOT_ROLE = keccak256("ROOT_ROLE");
  bytes32 public constant WRAPPER_ROLE = keccak256("WRAPPER_ROLE");
  bytes32 public constant BRIDGE_ROLE = keccak256("BRIDGE_ROLE");

  address public defaultWrapper;

  mapping(bytes32 => mapping(bytes32 => uint256)) private _unsyncHostUser;

  mapping(bytes32 => TldRecord.TldRecord) internal _records;
  mapping(uint256 => TokenRecord.TokenRecord) internal _tokenRecords;

  /* ========== Helper ==========*/

  modifier onlyWrapper(bytes32 tld) {
    require(_msgSender() == _records[tld].wrapper.address_, "ONLY_OWNER_OR_WRAPPER");
    _;
  }

  modifier onlyTldOwner(bytes32 tld) {
    require(_msgSender() == _records[tld].owner, "ONLY_TLD_OWNER");
    _;
  }

  modifier onlyDomainOwnerOrWrapper(bytes32 name, bytes32 tld) {
    require(_msgSender() == _records[tld].domains[name].owner || _msgSender() == _records[tld].wrapper.address_, "ONLY_OWNER_OR_WRAPPER");
    _;
  }

  modifier onlyDomainOwner(bytes32 name, bytes32 tld) {
    require(_msgSender() == _records[tld].domains[name].owner, "ONLY_OWNER");
    _;
  }

  modifier onlyDomainUser(bytes32 name, bytes32 tld) {
    require(_msgSender() == _records[tld].domains[name].user.user, "ONLY_DOMAIN_USER");
    _;
  }

  modifier onlyDomainUserOrOperator(bytes32 name, bytes32 tld) {
    require(_msgSender() == _records[tld].domains[name].user.user || isOperator(name, tld, _msgSender()), "ONLY_DOMAIN_USER_OR_OPERATOR");
    _;
  }

  modifier onlyHostUser(
    bytes32 host,
    bytes32 name,
    bytes32 tld
  ) {
    require(_msgSender() == _records[tld].domains[name].hosts[host].user.user, "ONLY_HOST_USER");
    _;
  }

  modifier onlyHostUserOrOperator(
    bytes32 host,
    bytes32 name,
    bytes32 tld
  ) {
    require(_msgSender() == _records[tld].domains[name].user.user || isOperator(host, name, tld, _msgSender()), "ONLY_HOST_USER_OR_OPERATOR");
    _;
  }

  modifier onlyTldOwnerOrWrapper(bytes32 tld) {
    require(_msgSender() == _records[tld].owner || _msgSender() == _records[tld].wrapper.address_, "ONLY_TLD_OWNER_OR_WRAPPER");
    _;
  }

  modifier onlyLiveDomain(bytes32 name, bytes32 tld) {
    require(isLive(name, tld), "DOMAIN_EXPIRED");
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
    _grantRole(OPERATOR_ROLE, _msgSender());
  }

  /* ========== Mutative ==========*/
  function setRecord(
    Chain.Chain[] memory chains,
    bytes memory tld,
    address owner,
    address resolver,
    uint64 expiry,
    bool enable,
    TldClass.TldClass class_
  ) public onlyRole(ROOT_ROLE) {
    //    require(!isExists(keccak256(tld)) && !isExists(getTokenId(tld)), "TLD_EXIST"); -> !isExists(getTokenId(tld)) always return true
    // require((!isExists(keccak256(tld))) && (!isExists(getTokenId(tld))), "TLD_EXIST");
    require(owner != address(0x0), "UNDEFINED_OWNER");
    require(resolver != address(0x0), "UNDEFINED_RESOLVER");

    TldRecord.TldRecord storage _record = _records[keccak256(tld)];
    _record.chains = chains;
    _record.name = tld;
    _record.owner = owner;
    _record.resolver = resolver;
    _record.expiry = expiry;
    _record.enable = enable;
    _record.class_ = class_;

    if (defaultWrapper != address(0)) {
      WrapperRecord.WrapperRecord storage _wrapper = _record.wrapper;
      _wrapper.enable = enable;
      _wrapper.address_ = defaultWrapper;
      emit SetWrapper(tld, defaultWrapper, enable);
    }

    uint256 id = getTokenId(tld);

    TokenRecord.TokenRecord storage _tokenRecord = _tokenRecords[id];
    _tokenRecord.kind = Kind.Kind.TLD;
    _tokenRecord.tld = keccak256(tld);

    emit NewTld(class_, tld, owner);

    // if (_records[keccak256(tld)].wrapper.enable) {
    //   IWrapper(_records[keccak256(tld)].wrapper.address_).mint(owner, id);
    // }
  }

  function setRecord(
    bytes memory name,
    bytes memory tld,
    address owner,
    address resolver,
    uint64 expiry
  ) public {
    require(hasRole(REGISTRAR_ROLE, _msgSender()) || hasRole(BRIDGE_ROLE, _msgSender()), "ONLY_AUTHORIZED");
    require(owner != address(0x0), "UNDEFINED_OWNER");
    require(isExists(keccak256(tld)), "TLD_NOT_EXIST");

    if (resolver == address(0x0)) {
      resolver = _records[keccak256(tld)].resolver;
    }

    bool isExists_ = isExists(keccak256(name), keccak256(tld));

    uint256 id = getTokenId(name, tld);

    if (_records[keccak256(tld)].wrapper.enable) {
      IWrapper(_records[keccak256(tld)].wrapper.address_).mint(owner, id);
      if (isExists_) {
        _remove(keccak256(name), keccak256(tld));
        IWrapper(_records[keccak256(tld)].wrapper.address_).burn(id);
      }
    }

    DomainRecord.DomainRecord storage _record = _records[keccak256(tld)].domains[keccak256(name)];
    _record.name = name;
    _record.owner = owner;
    _record.resolver = resolver;
    _record.expiry = expiry;
    _record.user = UserRecord.UserRecord({ user: owner, expiry: expiry });
    emit NewDomain(name, tld, owner, expiry);

    TokenRecord.TokenRecord storage _tokenRecord = _tokenRecords[id];
    _tokenRecord.kind = Kind.Kind.DOMAIN;
    _tokenRecord.tld = keccak256(tld);
    _tokenRecord.domain = keccak256(name);

    _setRecord(bytes("@"), name, tld, 3600);
  }

  function _setRecord(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    uint16 ttl
  ) private {
    bytes32 host_ = keccak256(host);
    bytes32 name_ = keccak256(name);
    bytes32 tld_ = keccak256(tld);

    require(!isExists(host_, name_, tld_), "HOST_ALREADY_EXIST");

    HostRecord.HostRecord storage _record = _records[tld_].domains[name_].hosts[host_];
    _record.name = host;
    _record.ttl = ttl;

    UserRecord.UserRecord storage _user = _records[tld_].domains[name_].hosts[host_].user;
    _user.user = getOwner(name_, tld_);
    _user.expiry = getExpiry(name_, tld_);

    emit NewHost(host, name, tld);

    TokenRecord.TokenRecord storage _tokenRecord = _tokenRecords[getTokenId(host, name, tld)];
    _tokenRecord.kind = Kind.Kind.HOST;
    _tokenRecord.tld = tld_;
    _tokenRecord.domain = name_;
    _tokenRecord.host = host_;
  }

  function setRecord(
    bytes memory host,
    bytes memory name,
    bytes memory tld,
    uint16 ttl
  ) public onlyDomainUserOrOperator(keccak256(name), keccak256(tld)) onlyLiveDomain(keccak256(name), keccak256(tld)) {
    _setRecord(host, name, tld, ttl);
  }

  //set tld resolve
  function setResolver(bytes32 tld, address resolver_) public onlyTldOwner(tld) {
    require(isExists(tld), "TLD_NOT_EXIST");
    _records[tld].resolver = resolver_;

    emit SetResolver(_records[tld].name, resolver_);
  }

  function setResolver(
    bytes32 name,
    bytes32 tld,
    address resolver_
  ) public onlyDomainUserOrOperator(name, tld) onlyLiveDomain(name, tld) {
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
  ) public onlyDomainUser(name, tld) onlyLiveDomain(name, tld) {
    require(isExists(name, tld), "DOMAIN_NOT_EXIST");
    _records[tld].domains[name].operators[getOwner(name, tld)][operator_] = approved;

    emit SetOperator(_join(_records[tld].domains[name].name, _records[tld].name), operator_, approved);
  }

  function setOperator(
    bytes32 host,
    bytes32 name,
    bytes32 tld,
    address operator_,
    bool approved
  ) public onlyHostUser(host, name, tld) onlyLiveDomain(name, tld) {
    require(isExists(host, name, tld), "HOST_NOT_EXIST");
    _records[tld].domains[name].hosts[host].operators[getUser(host, name, tld)][operator_] = approved;

    emit SetOperator(_join(_records[tld].domains[name].hosts[host].name, _records[tld].domains[name].name, _records[tld].name), operator_, approved);
  }

  function setEnable(bytes32 tld, bool enable) public onlyTldOwner(tld) {
    require(isExists(tld), "TLD_NOT_EXIST");
    _records[tld].enable = enable;

    emit SetEnable(_records[tld].name, enable);
  }

  function setWrapper(
    bytes32 tld,
    bool enable,
    address address_
  ) public onlyTldOwner(tld) {
    WrapperRecord.WrapperRecord storage _wrapper = _records[tld].wrapper;
    _wrapper.enable = enable;
    _wrapper.address_ = address_;
    emit SetWrapper(_records[tld].name, address_, enable);
  }

  function setUser(
    bytes32 name,
    bytes32 tld,
    address user,
    uint64 expiry
  ) public onlyWrapper(tld) onlyLiveDomain(name, tld) {
    _records[tld].domains[name].user.user = user;
    if (expiry == 0) {
      _records[tld].domains[name].user.expiry = getExpiry(name, tld);
    } else {
      require(expiry <= getExpiry(name, tld), "DOMAIN_OVERFLOW");
      _records[tld].domains[name].user.expiry = expiry;
    }
    emit SetUser(_join(_records[tld].domains[name].name, _records[tld].name), user, expiry);
  }

  function setUser(
    bytes32 host,
    bytes32 name,
    bytes32 tld,
    address newUser,
    uint64 expiry
  ) public onlyWrapper(tld) onlyLiveDomain(name, tld) {
    require(isExists(host, name, tld), "HOST_NOT_EXISTS");
    require(newUser != address(0), "NULL_USER");

    address owner = getOwner(name, tld);
    address currUser = getUser(host, name, tld);

    if (owner == currUser && currUser != newUser) {
      _unsyncHostUser[tld][name] += 1;
    } else if (currUser != owner && currUser == newUser) {
      if (_unsyncHostUser[tld][name] > 0) {
        _unsyncHostUser[tld][name] -= 1;
      }
    }

    if (expiry == 0) {
      _records[tld].domains[name].hosts[host].user.expiry = getExpiry(name, tld);
    } else {
      require(expiry <= getExpiry(name, tld), "DOMAIN_OVERFLOW");
      _records[tld].domains[name].hosts[host].user.expiry = expiry;
    }
    _records[tld].domains[name].hosts[host].user.user = newUser;
    emit SetUser(_join(_records[tld].domains[name].hosts[host].name, _records[tld].domains[name].name, _records[tld].name), newUser, expiry);
  }

  function setExpiry(bytes32 tld, uint64 expiry) public onlyRole(ROOT_ROLE) {
    require(expiry > _records[tld].expiry && expiry > block.timestamp, "INVALID_EXPIRY");
    _records[tld].expiry = expiry;
    emit SetExpiry(_records[tld].name, expiry);
  }

  function setExpiry(
    bytes32 name,
    bytes32 tld,
    uint64 expiry
  ) public onlyRole(REGISTRAR_ROLE) onlyLiveDomain(name, tld) {
    require(expiry > _records[tld].domains[name].expiry && expiry > block.timestamp, "INVALID_EXPIRY");
    emit SetExpiry(_join(_records[tld].domains[name].name, _records[tld].name), expiry);
  }

  function setDefaultWrapper(address address_) external onlyRole(OPERATOR_ROLE) {
    defaultWrapper = address_;
  }

  /* ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ */
  /* ⚠️⚠️⚠️⚠️⚠️❗❗❗❗❗🔞🔞🔞 START OF DESCTRUCTIVE 🔞🔞🔞❗❗❗❗❗⚠️⚠️⚠️⚠️⚠️ */

  function unsetRecord(
    bytes32 host,
    bytes32 name,
    bytes32 tld
  ) public onlyLiveDomain(name, tld) {
    require(
      _msgSender() == getUser(name, tld) &&
        _msgSender() == getUser(host, name, tld) &&
        getUserExpiry(name, tld) > block.timestamp &&
        getUserExpiry(host, name, tld) > block.timestamp,
      "ONLY_USERS"
    );
    _remove(host, name, tld);
  }

  function _remove(bytes32 tld) internal {
    if (_records[tld].wrapper.enable) {
      IWrapper(_records[tld].wrapper.address_).burn(getTokenId(_records[tld].name));
    }
    emit RemoveTld(_records[tld].name);
    delete _records[tld];
    delete _tokenRecords[getTokenId(_records[tld].name)];
  }

  function _remove(bytes32 name, bytes32 tld) internal {
    if (_records[tld].wrapper.enable) {
      IWrapper(_records[tld].wrapper.address_).burn(getTokenId(_records[tld].domains[name].name, _records[tld].name));
    }
    emit RemoveDomain(_join(_records[tld].domains[name].name, _records[tld].name));
    delete _records[tld].domains[name];
    delete _tokenRecords[getTokenId(_records[tld].domains[name].name, _records[tld].name)];
  }

  function _remove(
    bytes32 host,
    bytes32 name,
    bytes32 tld
  ) internal {
    emit RemoveHost(_join(_records[tld].domains[name].hosts[host].name, _records[tld].domains[name].name, _records[tld].name));
    delete _records[tld].domains[name].hosts[host];
    delete _tokenRecords[getTokenId(_records[tld].domains[name].hosts[host].name, _records[tld].domains[name].name, _records[tld].name)];
    if (_records[tld].wrapper.enable) {
      IWrapper(_records[tld].wrapper.address_).burn(getTokenId(_records[tld].domains[name].hosts[host].name, _records[tld].domains[name].name, _records[tld].name));
    }
  }

  function prune(bytes32 name, bytes32 tld) public onlyDomainOwner(name, tld) onlyLiveDomain(name, tld) {}

  function prune(
    bytes32 host,
    bytes32 name,
    bytes32 tld
  ) public onlyHostUser(host, name, tld) onlyLiveDomain(name, tld) {}

  function bridged(bytes32 name, bytes32 tld) public onlyRole(BRIDGE_ROLE) {
    require(_unsyncHostUser[tld][name] == 0, "UNSYNC_HOST_USER_EXISTS");
    _remove(name, tld);
  }

  /* ⚠️⚠️⚠️⚠️⚠️❗❗❗❗❗🔞🔞🔞 END OF DESCTRUCTIVE 🔞🔞🔞❗❗❗❗❗⚠️⚠️⚠️⚠️⚠️*/
  /* ⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️ */

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

  function getExpiry(bytes32 tld) public view returns (uint64) {
    return _records[tld].expiry;
  }

  // Get the expiry date of the name in unix timestamp
  function getExpiry(bytes32 name, bytes32 tld) public view returns (uint64) {
    return _records[tld].domains[name].expiry;
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

  function getUserExpiry(bytes32 name, bytes32 tld) public view returns (uint64) {
    return _records[tld].domains[name].user.expiry;
  }

  function getUserExpiry(
    bytes32 host,
    bytes32 name,
    bytes32 tld
  ) public view returns (uint64) {
    return _records[tld].domains[name].hosts[host].user.expiry;
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
    return _tokenRecords[tokenId].tld != bytes32(0);
  }

  function isOperator(
    bytes32 name,
    bytes32 tld,
    address _operator
  ) public view returns (bool) {
    return _records[tld].domains[name].operators[getOwner(name, tld)][_operator];
  }

  function isOperator(
    bytes32 host,
    bytes32 name,
    bytes32 tld,
    address _operator
  ) public view returns (bool) {
    return _records[tld].domains[name].hosts[host].operators[getUser(host, name, tld)][_operator];
  }

  // Is the name still alive (not yet expired)
  function isLive(bytes32 name, bytes32 tld) public view returns (bool) {
    return _records[tld].domains[name].expiry > block.timestamp;
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

  uint256[50] private __gap;
}
