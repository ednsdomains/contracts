//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

// import "https://github.com/Arachnid/solidity-stringutils/blob/master/strings.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/MulticallUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "./IRegistry.sol";

contract Registry is IRegistry, AccessControlUpgradeable, MulticallUpgradeable {
  uint256 public constant DEFAULT_TTL = 604800; // 7 days

  bytes32 private constant _AT_SIGN = keccak256("@");

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");
  bytes32 public constant PUBLIC_RESOLVER_ROLE = keccak256("PUBLIC_RESOLVER_ROLE");
  bytes32 public constant ROOT_ROLE = keccak256("ROOT_ROLE");

  struct TldRecord {
    string name;
    address owner;
    address resolver;
    bool enable;
    mapping(bytes32 => DomainRecord) domains;
  }

  struct DomainRecord {
    string name;
    address owner;
    address resolver;
    uint256 ttl;
    mapping(address => bool) operators;
    mapping(bytes32 => HostRecord) hosts;
  }

  struct HostRecord {
    string name;
    uint256 ttl;
    mapping(address => bool) operators;
  }

  mapping(bytes32 => TldRecord) private _records;

  modifier requireRoot() {
    require(hasRole(ROOT_ROLE, _msgSender()), "FORBIDDEN_ACCESS");
    _;
  }

  modifier requireRegistrar() {
    require(hasRole(REGISTRAR_ROLE, _msgSender()), "FORBIDDEN_ACCESS");
    _;
  }

  modifier requirePublicResolver() {
    require(hasRole(PUBLIC_RESOLVER_ROLE, _msgSender()), "FORBIDDEN_ACCESS");
    _;
  }

  modifier requireDomainOwner(bytes32 domain, bytes32 tld) {
    require(_msgSender() == _records[tld].domains[domain].owner, "FORBIDDEN_ACCESS");
    _;
  }

  modifier requireDomainOperator(bytes32 domain, bytes32 tld) {
    require(_msgSender() == _records[tld].domains[domain].owner || _records[tld].domains[domain].operators[_msgSender()], "FORBIDDEN_ACCESS");
    _;
  }

  modifier requireHostOperator(
    bytes32 host,
    bytes32 domain,
    bytes32 tld
  ) {
    require(
      _msgSender() == _records[tld].domains[domain].owner ||
        _records[tld].domains[domain].operators[_msgSender()] ||
        _records[tld].domains[domain].hosts[host].operators[_msgSender()],
      "FORBIDDEN_ACCESS"
    );
    _;
  }

  function initialize() public initializer {
    __Registry_init();
  }

  function __Registry_init() internal onlyInitializing {
    __Registry_init_unchained();
    __AccessControl_init_unchained();
    __Multicall_init_unchained();
  }

  function __Registry_init_unchained() internal onlyInitializing {
    _setRoleAdmin(ADMIN_ROLE, ADMIN_ROLE);
    _setRoleAdmin(REGISTRAR_ROLE, ADMIN_ROLE);
    _setRoleAdmin(ROOT_ROLE, ADMIN_ROLE);
    _setupRole(ADMIN_ROLE, _msgSender());
  }

  function setRecord(
    string memory tld,
    address owner,
    address resolver
  ) external requireRoot {
    require(!exists(keccak256(abi.encodePacked(tld))), "TLD_EXIST");
    require(owner != address(0x0), "UNDEFINED_OWNER");
    require(resolver != address(0x0), "UNDEFINED_RESOLVER");
    TldRecord storage _record = _records[keccak256(abi.encodePacked(tld))];
    _record.name = tld;
    _record.owner = owner;
    _record.resolver = resolver;
    emit NewTld(tld, owner);
  }

  function setRecord(
    string memory domain,
    string memory tld,
    address owner,
    address resolver,
    uint256 ttl
  ) external requireRegistrar {
    require(owner != address(0x0), "UNDEFINED_OWNER");
    require(resolver != address(0x0), "UNDEFINED_RESOLVER");
    require(ttl >= 60, "TTL_TOO_LOW");
    require(exists(keccak256(abi.encodePacked(tld))), "TLD_NOT_EXIST");
    DomainRecord storage _record = _records[keccak256(abi.encodePacked(tld))].domains[keccak256(abi.encodePacked(domain))];
    _record.name = domain;
    _record.owner = owner;
    _record.resolver = resolver;
    _record.ttl = ttl;
    emit NewDomain(domain, tld, owner);
  }

  function setRecord(
    string memory host,
    string memory domain,
    string memory tld,
    uint256 ttl
  ) external requirePublicResolver {
    require(exists(keccak256(abi.encodePacked(domain)), keccak256(abi.encodePacked(tld))), "DOMAIN_NOT_EXIST");
    HostRecord storage _record = _records[keccak256(abi.encodePacked(tld))].domains[keccak256(abi.encodePacked(domain))].hosts[keccak256(abi.encodePacked(host))];
    _record.name = host;
    _record.ttl = ttl;
    emit NewHost(host, domain, tld);
  }

  function setResolver(bytes32 tld, address resolver) external requireRoot {
    require(exists(tld), "TLD_NOT_EXIST");
    _records[tld].resolver = resolver;
    emit NewResolver(_records[tld].name, resolver);
  }

  function setResolver(
    bytes32 domain,
    bytes32 tld,
    address resolver
  ) external requireRoot {
    require(exists(domain, tld), "DOMAIN_NOT_EXIST");
    _records[tld].domains[domain].resolver = resolver;
    emit NewResolver(string(abi.encodePacked(_records[tld].domains[domain].name, ".", _records[tld].name)), resolver);
  }

  function setOwner(
    bytes32 domain,
    bytes32 tld,
    address owner
  ) external requireRegistrar {
    require(exists(domain, tld), "DOMAIN_NOT_EXIST");
    _records[tld].domains[domain].owner = owner;
    emit NewOwner(string(abi.encodePacked(_records[tld].domains[domain].name, ".", _records[tld].name)), owner);
  }

  function setOperator(
    bytes32 domain,
    bytes32 tld,
    address operator,
    bool approved
  ) public requireDomainOwner(domain, tld) {
    require(exists(domain, tld), "DOMAIN_NOT_EXIST");
    _records[tld].domains[domain].operators[operator] = approved;
    emit SetOperator(string(abi.encodePacked(_records[tld].domains[domain].name, ".", _records[tld].name)), operator, approved);
  }

  function setOperator(
    bytes32 host,
    bytes32 domain,
    bytes32 tld,
    address operator,
    bool approved
  ) public requireDomainOperator(domain, tld) {
    require(exists(host, domain, tld), "HOST_NOT_EXIST");
    _records[tld].domains[domain].hosts[host].operators[operator] = approved;
    emit SetOperator(
      string(abi.encodePacked(_records[tld].domains[domain].hosts[host].name, ".", _records[tld].domains[domain].name, ".", _records[tld].name)),
      operator,
      approved
    );
  }

  function setTtl(
    bytes32 domain,
    bytes32 tld,
    uint256 ttl
  ) public requireDomainOwner(domain, tld) {
    require(exists(domain, tld), "DOMAIN_NOT_EXIST");
    _records[tld].domains[domain].ttl = ttl;
    emit SetTtl(string(abi.encodePacked(_records[tld].domains[domain].name, ".", _records[tld].name)), ttl);
  }

  function setTtl(
    bytes32 host,
    bytes32 domain,
    bytes32 tld,
    uint256 ttl
  ) public requireDomainOperator(domain, tld) {
    require(exists(host, domain, tld), "HOST_NOT_EXIST");
    _records[tld].domains[domain].hosts[host].ttl = ttl;
    emit SetTtl(string(abi.encodePacked(_records[tld].domains[domain].hosts[host].name, ".", _records[tld].domains[domain].name, ".", _records[tld].name)), ttl);
  }

  function owner(bytes32 tld) public view returns (address) {
    require(exists(tld), "TLD_NOT_FOUND");
    return _records[tld].owner;
  }

  function owner(bytes32 domain, bytes32 tld) public view returns (address) {
    require(exists(domain, tld), "DOMAIN_NOT_FOUND");
    return _records[tld].domains[domain].owner;
  }

  function resolver(bytes32 tld) public view returns (address) {
    require(exists(tld), "TLD_NOT_FOUND");
    return _records[tld].resolver;
  }

  function resolver(bytes32 domain, bytes32 tld) public view returns (address) {
    require(exists(domain, tld), "DOMAIN_NOT_FOUND");
    return _records[tld].domains[domain].resolver;
  }

  function exists(bytes32 tld) public view returns (bool) {
    return _records[tld].owner != address(0x0);
  }

  function exists(bytes32 domain, bytes32 tld) public view returns (bool) {
    return _records[tld].domains[domain].owner != address(0x0);
  }

  function exists(
    bytes32 host,
    bytes32 domain,
    bytes32 tld
  ) public view returns (bool) {
    return _records[tld].domains[domain].hosts[host].ttl != 0;
  }

  function operator(
    bytes32 domain,
    bytes32 tld,
    address _operator
  ) public view returns (bool) {
    return _records[tld].domains[domain].operators[_operator];
  }

  function operator(
    bytes32 host,
    bytes32 domain,
    bytes32 tld,
    address _operator
  ) public view returns (bool) {
    return _records[tld].domains[domain].hosts[host].operators[_operator];
  }

  function operator(bytes32 domain, bytes32 tld) public view returns (bool) {
    return _records[tld].domains[domain].operators[_msgSender()];
  }

  function operator(
    bytes32 host,
    bytes32 domain,
    bytes32 tld
  ) public view returns (bool) {
    return _records[tld].domains[domain].hosts[host].operators[_msgSender()];
  }
}
