//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// import "https://github.com/Arachnid/solidity-bytesutils/blob/master/bytess.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "../utils/LabelOperator.sol";
import "./interfaces/IRegistry.sol";
import "../lib/TldClass.sol";
import "../wrapper/interfaces/IERC721Wrapper.sol";

contract Registry is IRegistry, LabelOperator, AccessControlUpgradeable {
  using AddressUpgradeable for address;

  bytes32 internal constant AT = keccak256(bytes("@"));

  address private _owner;

  uint256 public constant GRACE_PERIOD = 30 days;

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");
  bytes32 public constant PUBLIC_RESOLVER_ROLE = keccak256("PUBLIC_RESOLVER_ROLE");
  bytes32 public constant ROOT_ROLE = keccak256("ROOT_ROLE");
  bytes32 public constant ERC721_WRAPPER_ROLE = keccak256("ERC721_WRAPPER_ROLE");

  mapping(bytes32 => TldRecord.TldRecord) internal _records;
  mapping(uint256 => TokenRecord.TokenRecord) internal _tokenRecords;

  mapping(address => mapping(address => bool)) private _operatorApprovals;

  mapping(bytes32 => mapping(bytes32 => mapping(bytes32 => mapping(address => bool)))) private _operators; // TLD => Domain => Host

  /* ========== Validator ==========*/

  modifier onlyAdmin() {
    require(hasRole(ADMIN_ROLE, _msgSender()), "ONLY_ADMIN");
    _;
  }

  modifier onlyRoot() {
    require(hasRole(ROOT_ROLE, _msgSender()), "ONLY_ROOT");
    _;
  }

  modifier onlyRegistrar() {
    require(hasRole(REGISTRAR_ROLE, _msgSender()), "ONLY_REGISTRAR");
    _;
  }

  modifier onlyResolver() {
    require(hasRole(PUBLIC_RESOLVER_ROLE, _msgSender()), "ONLY_RESOLVER");
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

  modifier onlyDomainOwnerOrWrapper(bytes32 name, bytes32 tld) {
    require(_msgSender() == _records[tld].domains[name].owner || _msgSender() == _records[tld].wrapper.address_, "ONLY_OWNER_OR_WRAPPER");
    _;
  }

  /* ========== Initializer ==========*/

  function initialize() public initializer {
    __Registry_init();
  }

  function __Registry_init() internal onlyInitializing {
    __Registry_init_unchained();
    __AccessControl_init();
    __ERC165_init();
  }

  function __Registry_init_unchained() internal onlyInitializing {
    _setRoleAdmin(ADMIN_ROLE, DEFAULT_ADMIN_ROLE);
    _setRoleAdmin(REGISTRAR_ROLE, ADMIN_ROLE);
    _setRoleAdmin(ROOT_ROLE, ADMIN_ROLE);
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(ADMIN_ROLE, _msgSender());
  }

  /* ========== Mutative ==========*/

  //Create TLD
  function setRecord(
    bytes memory tld,
    address owner_,
    address resolver_,
    bool enable_,
    TldClass.TldClass class_
  ) external onlyRoot {
    require(!isExists(keccak256(tld)), "TLD_EXIST");
    require(owner_ != address(0x0), "UNDEFINED_OWNER");
    require(resolver_ != address(0x0), "UNDEFINED_RESOLVER");

    TldRecord.TldRecord storage _record = _records[keccak256(tld)];
    _record.name = tld;
    _record.owner = owner_;
    _record.resolver = resolver_;
    _record.enable = enable_;
    _record.class_ = class_;
    emit NewTld(tld, owner_);

    uint256 id = getTokenId(tld);

    TokenRecord.TokenRecord storage _tokenRecord = _tokenRecords[id];
    _tokenRecord.type_ = RecordType.RecordType.TLD;
    _tokenRecord.tld = keccak256(tld);

    if (_records[keccak256(tld)].wrapper.enable) {
      IERC721Wrapper(_records[keccak256(tld)].wrapper.address_).mint(owner_, id);
    }
  }

  //Add name
  function setRecord(
    bytes memory name,
    bytes memory tld,
    address owner_,
    address resolver_,
    uint64 expires_
  ) external onlyRegistrar {
    require(owner_ != address(0x0), "UNDEFINED_OWNER");
    require(isExists(keccak256(tld)), "TLD_NOT_EXIST");

    if (resolver_ == address(0x0)) {
      resolver_ = _records[keccak256(tld)].resolver;
    }

    bool isExists_ = isExists(keccak256(name), keccak256(tld));

    //    uint256 id = uint256(keccak256(_join(name, tld)));
    uint256 id = getTokenId(name, tld);

    if (_records[keccak256(tld)].wrapper.enable) {
      IERC721Wrapper(_records[keccak256(tld)].wrapper.address_).mint(owner_, id);
      if (isExists_) {
        IERC721Wrapper(_records[keccak256(tld)].wrapper.address_).burn(id);
      }
    }

    DomainRecord.DomainRecord storage _record = _records[keccak256(tld)].domains[keccak256(name)];
    _record.name = name;
    _record.owner = owner_;
    _record.resolver = resolver_;
    _record.expires = expires_;
    if (!isExists_) {
      UserRecord.UserRecord storage _user = _records[keccak256(tld)].domains[keccak256(name)].user;
      _user.user = owner_;
      _user.expires = expires_;
      // if (_records[keccak256(tld)].wrapper.enable) {}
      // emit UpdateUser(id, owner_, expires_);
    }
    emit NewDomain(name, tld, owner_);

    TokenRecord.TokenRecord storage _tokenRecord = _tokenRecords[id];
    _tokenRecord.type_ = RecordType.RecordType.DOMAIN;
    _tokenRecord.tld = keccak256(tld);
    _tokenRecord.domain = keccak256(name);
  }

  //Sub Domain
  function setRecord(
    bytes memory host,
    bytes memory name,
    bytes memory tld
  ) external onlyResolver {
    require(isExists(keccak256(name), keccak256(tld)), "DOMAIN_NOT_EXIST");

    bool isExists_ = isExists(keccak256(host), keccak256(name), keccak256(tld));

    HostRecord.HostRecord storage _record = _records[keccak256(tld)].domains[keccak256(name)].hosts[keccak256(host)];
    _record.name = host;
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
  function setResolver(bytes32 tld, address resolver_) external onlyRoot {
    require(isExists(tld), "TLD_NOT_EXIST");
    _records[tld].resolver = resolver_;
    emit NewResolver(_records[tld].name, resolver_);
  }

  function setResolver(
    bytes32 name,
    bytes32 tld,
    address resolver_
  ) external onlyLiveDomain(name, tld) onlyDomainOperator(name, tld) {
    require(isExists(name, tld), "DOMAIN_NOT_EXIST");
    _records[tld].domains[name].resolver = resolver_;
    emit NewResolver(abi.encodePacked(_records[tld].domains[name].name, DOT, _records[tld].name), resolver_);
  }

  function setOwner(bytes32 tld, address owner_) external onlyRoot {
    require(isExists(tld), "TLD_NOT_EXIST");
    _records[tld].owner = owner_;
    emit NewOwner(abi.encodePacked(_records[tld].name), owner_);
  }

  function setOwner(
    bytes32 name,
    bytes32 tld,
    address newOwner
  ) external onlyDomainOwnerOrWrapper(name, tld) {
    require(isExists(name, tld), "DOMAIN_NOT_EXIST");
    _records[tld].domains[name].owner = newOwner;
    emit NewOwner(abi.encodePacked(_records[tld].domains[name].name, DOT, _records[tld].name), newOwner);
  }

  function setOperator(
    bytes32 name,
    bytes32 tld,
    address operator_,
    bool approved
  ) public onlyLiveDomain(name, tld) onlyDomainOwner(name, tld) {
    require(isExists(name, tld), "DOMAIN_NOT_EXIST");
    _records[tld].domains[name].operators[operator_] = approved;
    emit SetOperator(abi.encodePacked(_records[tld].domains[name].name, DOT, _records[tld].name), operator_, approved);
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
    emit SetOperator(abi.encodePacked(_records[tld].domains[name].hosts[host].name, DOT, _records[tld].domains[name].name, DOT, _records[tld].name), operator_, approved);
  }

  function setExpires(
    bytes32 name,
    bytes32 tld,
    uint64 expires_
  ) external onlyRegistrar {
    require(isExists(name, tld), "DOMAIN_NOT_EXIST");
    require(_records[tld].domains[name].expires + GRACE_PERIOD >= block.timestamp, "DOMAIN_EXPIRED");
    _records[tld].domains[name].expires = expires_;
  }

  function setEnable(bytes32 tld, bool enable_) external onlyRoot {
    require(isExists(tld), "TLD_NOT_EXIST");
    _records[tld].enable = enable_;
  }

  function setWrapper(
    bytes32 tld,
    bool enable_,
    address wrapper_
  ) external onlyRoot {
    WrapperRecord.WrapperRecord storage _wrapper = _records[tld].wrapper;
    _wrapper.enable = enable_;
    _wrapper.address_ = wrapper_;
  }

  function setUser(
    bytes32 name,
    bytes32 tld,
    address user,
    uint64 expires
  ) external onlyDomainOwnerOrWrapper(name, tld) onlyLiveDomain(name, tld) {
    _records[tld].domains[name].user.user = user;
    if (expires == 0) {
      _records[tld].domains[name].user.expires = getExpires(name, tld);
    } else {
      require(expires <= getExpires(name, tld), ""); // TODO:
      _records[tld].domains[name].user.expires = expires;
    }
  }

  function setUser(
    bytes32 host,
    bytes32 name,
    bytes32 tld,
    address user,
    uint64 expires
  ) external onlyDomainOwnerOrWrapper(name, tld) onlyLiveDomain(name, tld) {
    require(isExists(host, name, tld), "HOST_NOT_EXISTS");
    if (expires == 0) {
      _records[tld].domains[name].hosts[host].user.expires = getExpires(name, tld);
    } else {
      require(expires <= getExpires(name, tld), ""); // TODO:
      _records[tld].domains[name].hosts[host].user.expires = expires;
    }
  }

  // function remove(bytes32 name, bytes32 tld) external onlyRegistrar {
  //   delete _records[tld].domains[name];
  //   _burn(getTokenId(_records[tld].domains[name].name, _records[tld].name));
  // }

  // function remove(
  //   bytes32 host,
  //   bytes32 name,
  //   bytes32 tld
  // ) external onlyRegistrar {
  //   delete _records[tld].domains[name].hosts[host];
  //   // _burn(getTokenId(_records[tld].domains[name].hosts[host].name, _records[tld].domains[name].name, _records[tld].name));
  // }

  function prune(bytes32 name, bytes32 tld) external onlyDomainOwner(name, tld) {}

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

  // Get the expires date of the name in unix timestamp
  function getExpires(bytes32 name, bytes32 tld) public view returns (uint64) {
    return _records[tld].domains[name].expires;
  }

  // Get the grace period
  function getGracePeriod() public pure returns (uint256) {
    return GRACE_PERIOD;
  }

  function getTldClass(bytes32 tld) external view returns (TldClass.TldClass) {
    return _records[tld].class_;
  }

  function getWrapper(bytes32 tld) external view returns (WrapperRecord.WrapperRecord memory) {
    return _records[tld].wrapper;
  }

  function getTokenRecord(uint256 tokenId_) external view returns (TokenRecord.TokenRecord memory) {
    return _tokenRecords[tokenId_];
  }

  function getUser(bytes32 name, bytes32 tld) external view returns (address) {
    return _records[tld].domains[name].user.user;
  }

  function getUser(
    bytes32 host,
    bytes32 name,
    bytes32 tld
  ) external view returns (address) {
    return _records[tld].domains[name].hosts[host].user.user;
  }

  function getUserExpires(bytes32 name, bytes32 tld) external view returns (uint64) {
    return _records[tld].domains[name].user.expires;
  }

  function getUserExpires(
    bytes32 host,
    bytes32 name,
    bytes32 tld
  ) external view returns (uint64) {
    return _records[tld].domains[name].hosts[host].user.expires;
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
    return _records[tld].domains[name].expires >= block.timestamp;
  }

  // Is the TLD enable and allow to register
  function isEnable(bytes32 tld) public view returns (bool) {
    return _records[tld].enable;
  }

  /* ========== Ownable ==========*/
  function owner() public view returns (address) {
    return _owner;
  }

  function setOwner(address newOwner) public onlyAdmin {
    _owner = newOwner;
  }

  /* ========== Utils ==========*/

  function getTokenId(bytes memory tld) public pure virtual returns (uint256) {
    return uint256(keccak256(tld));
  }

  function getTokenId(bytes memory name_, bytes memory tld) public pure virtual returns (uint256) {
    require(_validDomain(name_), "INVALID_DOMAIN_NAME");
    return uint256(keccak256(_join(name_, tld)));
  }

  function getTokenId(
    bytes memory host,
    bytes memory name_,
    bytes memory tld
  ) public pure virtual returns (uint256) {
    require(_validDomain(name_), "INVALID_DOMAIN_NAME");
    require(_validHost(host), "INVALID_DOMAIN_NAME");
    return uint256(keccak256(_join(host, name_, tld)));
  }

  function supportsInterface(bytes4 interfaceID) public view override(AccessControlUpgradeable) returns (bool) {
    return interfaceID == type(IRegistry).interfaceId || super.supportsInterface(interfaceID);
  }
}
