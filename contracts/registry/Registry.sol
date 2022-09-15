//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// import "https://github.com/Arachnid/solidity-bytesutils/blob/master/bytess.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "./interfaces/IRegistry.sol";

contract Registry is IRegistry, AccessControlUpgradeable {
  uint256 public constant GRACE_PERIOD = 30 days;

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");
  bytes32 public constant PUBLIC_RESOLVER_ROLE = keccak256("PUBLIC_RESOLVER_ROLE");
  bytes32 public constant ROOT_ROLE = keccak256("ROOT_ROLE");

  bytes internal constant DOT = bytes(".");

  struct TldRecord {
    bytes name; // The name of the TLD - '.meta' or '.ass'
    address owner; // The owner of thr TLD, it should always be the `Root` contract address
    address resolver; // The contract address of the resolver, it used the `PublicResolver` as default
    bool enable; // Is this TLD enable to register new name
    bool omni;
    uint16[] lzChainIds;
    bool allowRental;
    mapping(bytes32 => DomainRecord) domains;
  }

  struct DomainRecord {
    bytes name; // The name of the name name, if the FQDN is `edns.meta`, then this will be `bytes('edns')`
    address owner; // The owner of the name
    address resolver; //  The contract address of the resolver, it used the `PublicResolver` as default
    uint256 expires; // The expiry unix timestamp of the name
    RentalRecord rental;
    mapping(address => bool) operators;
    mapping(bytes32 => HostRecord) hosts;
  }

  struct HostRecord {
    bytes name;
    mapping(address => bool) operators;
  }

  struct RentalRecord {
    address user;
    uint256 expires;
  }

  mapping(bytes32 => TldRecord) internal _records;

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
    require(_msgSender() == _records[tld].domains[name].rental.user, "ONLY_USER");
    _;
  }

  modifier onlyDomainOperator(bytes32 name, bytes32 tld) {
    require(_msgSender() == _records[tld].domains[name].rental.user || _records[tld].domains[name].operators[_msgSender()], "ONLY_OPERATOR");
    _;
  }

  modifier onlyHostOperator(
    bytes32 host,
    bytes32 name,
    bytes32 tld
  ) {
    require(
      _msgSender() == _records[tld].domains[name].owner ||
        _records[tld].domains[name].operators[_msgSender()] ||
        _records[tld].domains[name].hosts[host].operators[_msgSender()],
      "FORBIDDEN"
    );
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
    bool omni_,
    uint16[] memory lzChainIds
  ) external onlyRoot {
    require(!isExists(keccak256(tld)), "TLD_EXIST");
    require(owner_ != address(0x0), "UNDEFINED_OWNER");
    require(resolver_ != address(0x0), "UNDEFINED_RESOLVER");
    TldRecord storage _record = _records[keccak256(tld)];
    _record.name = tld;
    _record.owner = owner_;
    _record.resolver = resolver_;
    _record.enable = enable_;
    _record.omni = omni_;
    _record.lzChainIds = [uint16(10002), uint16(10001)];
    emit NewTld(tld, owner_);
  }

  //Add name
  function setRecord(
    bytes memory name,
    bytes memory tld,
    address owner_,
    address resolver_,
    uint256 expires_
  ) external onlyRegistrar {
    require(owner_ != address(0x0), "UNDEFINED_OWNER");
    if (resolver_ == address(0x0)) resolver_ = _records[keccak256(tld)].resolver;
    require(isExists(keccak256(tld)), "TLD_NOT_EXIST");
    DomainRecord storage _record = _records[keccak256(tld)].domains[keccak256(name)];
    _record.name = name;
    _record.owner = owner_;
    _record.resolver = resolver_;
    _record.expires = expires_;
    RentalRecord storage _rental = _records[keccak256(tld)].domains[keccak256(name)].rental;
    _rental.user = owner_;
    _rental.expires = expires_;
    emit NewDomain(name, tld, owner_);
  }

  //Sub Domain
  function setRecord(
    bytes memory host,
    bytes memory name,
    bytes memory tld
  ) external onlyResolver {
    require(isExists(keccak256(name), keccak256(tld)), "DOMAIN_NOT_EXIST");
    HostRecord storage _record = _records[keccak256(tld)].domains[keccak256(name)].hosts[keccak256(host)];
    _record.name = host;
    emit NewHost(host, name, tld);
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
  ) external onlyRoot {
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
    address owner_
  ) external onlyRegistrar {
    require(isExists(name, tld), "DOMAIN_NOT_EXIST");
    _records[tld].domains[name].owner = owner_;
    emit NewOwner(abi.encodePacked(_records[tld].domains[name].name, DOT, _records[tld].name), owner_);
  }

  function setOperator(
    bytes32 name,
    bytes32 tld,
    address operator_,
    bool approved
  ) public onlyDomainOwner(name, tld) {
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
  ) public onlyDomainOperator(name, tld) {
    require(isExists(host, name, tld), "HOST_NOT_EXIST");
    _records[tld].domains[name].hosts[host].operators[operator_] = approved;
    emit SetOperator(abi.encodePacked(_records[tld].domains[name].hosts[host].name, DOT, _records[tld].domains[name].name, DOT, _records[tld].name), operator_, approved);
  }

  function setExpires(
    bytes32 name,
    bytes32 tld,
    uint256 expires_
  ) external onlyRegistrar {
    require(isExists(name, tld), "DOMAIN_NOT_EXIST");
    require(_records[tld].domains[name].expires + GRACE_PERIOD >= block.timestamp, "DOMAIN_EXPIRED");
    _records[tld].domains[name].expires = expires_;
  }

  function setEnable(bytes32 tld, bool enable_) external onlyRoot {
    require(isExists(tld), "TLD_NOT_EXIST");
    _records[tld].enable = enable_;
  }

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
  function getExpires(bytes32 name, bytes32 tld) public view returns (uint256) {
    return _records[tld].domains[name].expires;
  }

  // Get the grace period
  function getGracePeriod() public pure returns (uint256) {
    return GRACE_PERIOD;
  }

  function getLzChainIds(bytes32 tld) public view returns (uint16[] memory) {
    return _records[tld].lzChainIds;
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

  // Is the TLD an OMNI TLD
  function isOmni(bytes32 tld) public view returns (bool) {
    return _records[tld].omni;
  }

  function supportsInterface(bytes4 interfaceID) public view override returns (bool) {
    return interfaceID == type(IRegistry).interfaceId || super.supportsInterface(interfaceID);
  }
}
