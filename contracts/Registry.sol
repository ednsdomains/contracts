//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

// import "https://github.com/Arachnid/solidity-stringutils/blob/master/strings.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/MulticallUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "./IRegistry.sol";

contract Registry is IRegistry, AccessControlUpgradeable, MulticallUpgradeable {
  uint256 public constant GRACE_PERIOD = 30 days;

  bytes32 internal constant _AT_SIGN = keccak256("@");

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
    uint256 expiry;
    mapping(address => bool) operators;
    mapping(bytes32 => HostRecord) hosts;
  }

  struct HostRecord {
    string name;
    mapping(address => bool) operators;
  }

  mapping(bytes32 => TldRecord) internal _records;

  modifier requireAdmin() {
    require(hasRole(ADMIN_ROLE, _msgSender()), "FORBIDDEN_ACCESS");
    _;
  }

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
    __AccessControl_init();
    __Multicall_init();
    __ERC165_init();
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
    _setRecord(tld, owner, resolver);
  }

  function setRecord(
    string memory domain,
    string memory tld,
    address owner,
    address resolver,
    uint256 expiry
  ) external requireRegistrar {
    _setRecord(domain, tld, owner, resolver, expiry);
  }

  function setRecord(
    string memory host,
    string memory domain,
    string memory tld
  ) external requirePublicResolver {
    _setRecord(host, domain, tld);
  }

  function setResolver(bytes32 tld, address resolver) external requireRoot {
    _setResolver(tld, resolver);
  }

  function setResolver(
    bytes32 domain,
    bytes32 tld,
    address resolver
  ) external requireRoot {
    _setResolver(domain, tld, resolver);
  }

  function setOwner(
    bytes32 domain,
    bytes32 tld,
    address owner
  ) external requireRegistrar {
    _setOwner(domain, tld, owner);
  }

  function setOperator(
    bytes32 domain,
    bytes32 tld,
    address operator,
    bool approved
  ) public requireDomainOwner(domain, tld) {
    _setOperator(domain, tld, operator, approved);
  }

  function setOperator(
    bytes32 host,
    bytes32 domain,
    bytes32 tld,
    address operator,
    bool approved
  ) public requireDomainOperator(domain, tld) {
    _setOperator(host, domain, tld, operator, approved);
  }

  function setExpiry(
    bytes32 domain,
    bytes32 tld,
    uint256 expiry
  ) external requireRegistrar {
    _setExpiry(domain, tld, expiry);
  }

  function _setRecord(
    string memory tld,
    address owner,
    address resolver
  ) internal {
    require(!exists(keccak256(abi.encodePacked(tld))), "TLD_EXIST");
    require(owner != address(0x0), "UNDEFINED_OWNER");
    require(resolver != address(0x0), "UNDEFINED_RESOLVER");
    TldRecord storage _record = _records[keccak256(abi.encodePacked(tld))];
    _record.name = tld;
    _record.owner = owner;
    _record.resolver = resolver;
    emit NewTld(tld, owner);
  }

  function _setRecord(
    string memory domain,
    string memory tld,
    address owner,
    address resolver,
    uint256 expiry
  ) internal {
    require(owner != address(0x0), "UNDEFINED_OWNER");
    if (resolver == address(0x0)) resolver = _records[keccak256(abi.encodePacked(tld))].resolver;
    require(exists(keccak256(abi.encodePacked(tld))), "TLD_NOT_EXIST");
    DomainRecord storage _record = _records[keccak256(abi.encodePacked(tld))].domains[keccak256(abi.encodePacked(domain))];
    _record.name = domain;
    _record.owner = owner;
    _record.resolver = resolver;
    _record.expiry = expiry;
    emit NewDomain(domain, tld, owner);
  }

  function _setRecord(
    string memory host,
    string memory domain,
    string memory tld
  ) internal {
    require(exists(keccak256(abi.encodePacked(domain)), keccak256(abi.encodePacked(tld))), "DOMAIN_NOT_EXIST");
    HostRecord storage _record = _records[keccak256(abi.encodePacked(tld))].domains[keccak256(abi.encodePacked(domain))].hosts[keccak256(abi.encodePacked(host))];
    _record.name = host;
    emit NewHost(host, domain, tld);
  }

  function _setResolver(bytes32 tld, address resolver) internal {
    require(exists(tld), "TLD_NOT_EXIST");
    _records[tld].resolver = resolver;
    emit NewResolver(_records[tld].name, resolver);
  }

  function _setResolver(
    bytes32 domain,
    bytes32 tld,
    address resolver
  ) internal {
    require(exists(domain, tld), "DOMAIN_NOT_EXIST");
    _records[tld].domains[domain].resolver = resolver;
    emit NewResolver(string(abi.encodePacked(_records[tld].domains[domain].name, ".", _records[tld].name)), resolver);
  }

  function _setOwner(
    bytes32 domain,
    bytes32 tld,
    address owner
  ) internal {
    require(exists(domain, tld), "DOMAIN_NOT_EXIST");
    _records[tld].domains[domain].owner = owner;
    emit NewOwner(string(abi.encodePacked(_records[tld].domains[domain].name, ".", _records[tld].name)), owner);
  }

  function _setOperator(
    bytes32 domain,
    bytes32 tld,
    address operator,
    bool approved
  ) internal {
    require(exists(domain, tld), "DOMAIN_NOT_EXIST");
    _records[tld].domains[domain].operators[operator] = approved;
    emit SetOperator(string(abi.encodePacked(_records[tld].domains[domain].name, ".", _records[tld].name)), operator, approved);
  }

  function _setOperator(
    bytes32 host,
    bytes32 domain,
    bytes32 tld,
    address operator,
    bool approved
  ) internal {
    require(exists(host, domain, tld), "HOST_NOT_EXIST");
    _records[tld].domains[domain].hosts[host].operators[operator] = approved;
    emit SetOperator(
      string(abi.encodePacked(_records[tld].domains[domain].hosts[host].name, ".", _records[tld].domains[domain].name, ".", _records[tld].name)),
      operator,
      approved
    );
  }

  function _setExpiry(
    bytes32 domain,
    bytes32 tld,
    uint256 expiry
  ) internal {
    require(exists(domain, tld), "DOMAIN_NOT_EXIST");
    require(_records[tld].domains[domain].expiry + GRACE_PERIOD >= block.timestamp, "DOMAIN_EXPIRED");
    _records[tld].domains[domain].expiry = expiry;
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
    return abi.encodePacked(_records[tld].domains[domain].hosts[host].name).length > 0;
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

  function expiry(bytes32 domain, bytes32 tld) public view returns (uint256) {
    return _records[tld].domains[domain].expiry;
  }

  function gracePeriod() public pure returns (uint256) {
    return GRACE_PERIOD;
  }

  function live(bytes32 domain, bytes32 tld) public view returns (bool) {
    return _records[tld].domains[domain].expiry >= block.timestamp;
  }

  function supportsInterface(bytes4 interfaceID) public view override returns (bool) {
    return interfaceID == type(IRegistry).interfaceId || super.supportsInterface(interfaceID);
  }
}
