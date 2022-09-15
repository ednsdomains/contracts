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
    bool enable; // Is this TLD enable to register new domain
    bool omni;
    uint16[] lzChainIds;
    bool allowRental;
    mapping(bytes32 => DomainRecord) domains;
  }

  struct DomainRecord {
    bytes name; // The name of the domain name, if the FQDN is `edns.meta`, then this will be `bytes('edns')`
    address owner; // The owner of the domain
    address resolver; //  The contract address of the resolver, it used the `PublicResolver` as default
    uint256 expires; // The expiry unix timestamp of the domain
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

  modifier onlyDomainOwner(bytes32 domain, bytes32 tld) {
    require(_msgSender() == _records[tld].domains[domain].owner, "ONLY_OWNER");
    _;
  }

  modifier onlyDomainUser(bytes32 domain, bytes32 tld) {
    require(_msgSender() == _records[tld].domains[domain].rental.user, "ONLY_USER");
    _;
  }

  modifier onlyDomainOperator(bytes32 domain, bytes32 tld) {
    require(_msgSender() == _records[tld].domains[domain].rental.user || _records[tld].domains[domain].operators[_msgSender()], "ONLY_OPERATOR");
    _;
  }

  modifier onlyHostOperator(
    bytes32 host,
    bytes32 domain,
    bytes32 tld
  ) {
    require(
      _msgSender() == _records[tld].domains[domain].owner ||
        _records[tld].domains[domain].operators[_msgSender()] ||
        _records[tld].domains[domain].hosts[host].operators[_msgSender()],
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

  //Add domain
  function setRecord(
    bytes memory domain,
    bytes memory tld,
    address owner_,
    address resolver_,
    uint256 expires_
  ) external onlyRegistrar {
    require(owner_ != address(0x0), "UNDEFINED_OWNER");
    if (resolver_ == address(0x0)) resolver_ = _records[keccak256(tld)].resolver;
    require(isExists(keccak256(tld)), "TLD_NOT_EXIST");
    DomainRecord storage _record = _records[keccak256(tld)].domains[keccak256(domain)];
    _record.name = domain;
    _record.owner = owner_;
    _record.resolver = resolver_;
    _record.expires = expires_;
    RentalRecord storage _rental = _records[keccak256(tld)].domains[keccak256(domain)].rental;
    _rental.user = owner_;
    _rental.expires = expires_;
    emit NewDomain(domain, tld, owner_);
  }

  //Sub Domain
  function setRecord(
    bytes memory host,
    bytes memory domain,
    bytes memory tld
  ) external onlyResolver {
    require(isExists(keccak256(domain), keccak256(tld)), "DOMAIN_NOT_EXIST");
    HostRecord storage _record = _records[keccak256(tld)].domains[keccak256(domain)].hosts[keccak256(host)];
    _record.name = host;
    emit NewHost(host, domain, tld);
  }

  //set tld resolve
  function setResolver(bytes32 tld, address resolver_) external onlyRoot {
    require(isExists(tld), "TLD_NOT_EXIST");
    _records[tld].resolver = resolver_;
    emit NewResolver(_records[tld].name, resolver_);
  }

  function setResolver(
    bytes32 domain,
    bytes32 tld,
    address resolver_
  ) external onlyRoot {
    require(isExists(domain, tld), "DOMAIN_NOT_EXIST");
    _records[tld].domains[domain].resolver = resolver_;
    emit NewResolver(abi.encodePacked(_records[tld].domains[domain].name, DOT, _records[tld].name), resolver_);
  }

  function setOwner(bytes32 tld, address owner_) external onlyRoot {
    require(isExists(tld), "TLD_NOT_EXIST");
    _records[tld].owner = owner_;
    emit NewOwner(abi.encodePacked(_records[tld].name), owner_);
  }

  function setOwner(
    bytes32 domain,
    bytes32 tld,
    address owner_
  ) external onlyRegistrar {
    require(isExists(domain, tld), "DOMAIN_NOT_EXIST");
    _records[tld].domains[domain].owner = owner_;
    emit NewOwner(abi.encodePacked(_records[tld].domains[domain].name, DOT, _records[tld].name), owner_);
  }

  function setOperator(
    bytes32 domain,
    bytes32 tld,
    address operator_,
    bool approved
  ) public onlyDomainOwner(domain, tld) {
    require(isExists(domain, tld), "DOMAIN_NOT_EXIST");
    _records[tld].domains[domain].operators[operator_] = approved;
    emit SetOperator(abi.encodePacked(_records[tld].domains[domain].name, DOT, _records[tld].name), operator_, approved);
  }

  function setOperator(
    bytes32 host,
    bytes32 domain,
    bytes32 tld,
    address operator_,
    bool approved
  ) public onlyDomainOperator(domain, tld) {
    require(isExists(host, domain, tld), "HOST_NOT_EXIST");
    _records[tld].domains[domain].hosts[host].operators[operator_] = approved;
    emit SetOperator(abi.encodePacked(_records[tld].domains[domain].hosts[host].name, DOT, _records[tld].domains[domain].name, DOT, _records[tld].name), operator_, approved);
  }

  function setExpires(
    bytes32 domain,
    bytes32 tld,
    uint256 expires_
  ) external onlyRegistrar {
    require(isExists(domain, tld), "DOMAIN_NOT_EXIST");
    require(_records[tld].domains[domain].expires + GRACE_PERIOD >= block.timestamp, "DOMAIN_EXPIRED");
    _records[tld].domains[domain].expires = expires_;
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

  function getOwner(bytes32 domain, bytes32 tld) public view returns (address) {
    require(isExists(domain, tld), "DOMAIN_NOT_FOUND");
    return _records[tld].domains[domain].owner;
  }

  function getResolver(bytes32 tld) public view returns (address) {
    require(isExists(tld), "TLD_NOT_FOUND");
    return _records[tld].resolver;
  }

  function getResolver(bytes32 domain, bytes32 tld) public view returns (address) {
    require(isExists(domain, tld), "DOMAIN_NOT_FOUND");
    return _records[tld].domains[domain].resolver;
  }

  // Get the expires date of the domain in unix timestamp
  function getExpires(bytes32 domain, bytes32 tld) public view returns (uint256) {
    return _records[tld].domains[domain].expires;
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

  function isExists(bytes32 domain, bytes32 tld) public view returns (bool) {
    return _records[tld].domains[domain].name.length > 0;
  }

  function isExists(
    bytes32 host,
    bytes32 domain,
    bytes32 tld
  ) public view returns (bool) {
    return _records[tld].domains[domain].hosts[host].name.length > 0;
  }

  function isOperator(
    bytes32 domain,
    bytes32 tld,
    address _operator
  ) public view returns (bool) {
    return _records[tld].domains[domain].operators[_operator];
  }

  function isOperator(
    bytes32 host,
    bytes32 domain,
    bytes32 tld,
    address _operator
  ) public view returns (bool) {
    return _records[tld].domains[domain].hosts[host].operators[_operator];
  }

  function isOperator(bytes32 domain, bytes32 tld) public view returns (bool) {
    return _records[tld].domains[domain].operators[_msgSender()];
  }

  function isOperator(
    bytes32 host,
    bytes32 domain,
    bytes32 tld
  ) public view returns (bool) {
    return _records[tld].domains[domain].hosts[host].operators[_msgSender()];
  }

  // Is the domain still alive (not yet expired)
  function isLive(bytes32 domain, bytes32 tld) public view returns (bool) {
    return _records[tld].domains[domain].expires >= block.timestamp;
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
