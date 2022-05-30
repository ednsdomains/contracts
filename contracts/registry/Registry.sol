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
    bool omni;
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
    _setRoleAdmin(ADMIN_ROLE, DEFAULT_ADMIN_ROLE);
    _setRoleAdmin(REGISTRAR_ROLE, ADMIN_ROLE);
    _setRoleAdmin(ROOT_ROLE, ADMIN_ROLE);
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(ADMIN_ROLE, _msgSender());
  }

  function setRecord(
    string memory tld,
    address owner_,
    address resolver_,
    bool enable_,
    bool omni
  ) external requireRoot {
    _setRecord(tld, owner_, resolver_, enable_, omni);
  }

  function setRecord(
    string memory domain,
    string memory tld,
    address owner_,
    address resolver_,
    uint256 expiry_
  ) external requireRegistrar {
    _setRecord(domain, tld, owner_, resolver_, expiry_);
  }

  function setRecord(
    string memory host,
    string memory domain,
    string memory tld
  ) external requirePublicResolver {
    _setRecord(host, domain, tld);
  }

  function setResolver(bytes32 tld, address resolver_) external requireRoot {
    _setResolver(tld, resolver_);
  }

  function setResolver(
    bytes32 domain,
    bytes32 tld,
    address resolver_
  ) external requireRoot {
    _setResolver(domain, tld, resolver_);
  }

  function setOwner(bytes32 tld, address owner_) external requireRoot {
    _setOwner(tld, owner_);
  }

  function setOwner(
    bytes32 domain,
    bytes32 tld,
    address owner_
  ) external requireRegistrar {
    _setOwner(domain, tld, owner_);
  }

  function setOperator(
    bytes32 domain,
    bytes32 tld,
    address operator_,
    bool approved
  ) public requireDomainOwner(domain, tld) {
    _setOperator(domain, tld, operator_, approved);
  }

  function setOperator(
    bytes32 host,
    bytes32 domain,
    bytes32 tld,
    address operator_,
    bool approved
  ) public requireDomainOperator(domain, tld) {
    _setOperator(host, domain, tld, operator_, approved);
  }

  function setExpiry(
    bytes32 domain,
    bytes32 tld,
    uint256 expiry_
  ) external requireRegistrar {
    _setExpiry(domain, tld, expiry_);
  }

  function setEnable(bytes32 tld, bool enable_) external requireRoot {
    _setEnable(tld, enable_);
  }

  function _setRecord(
    string memory tld,
    address owner_,
    address resolver_,
    bool enable_,
    bool omni
  ) internal {
    require(!exists(keccak256(abi.encodePacked(tld))), "TLD_EXIST");
    require(owner_ != address(0x0), "UNDEFINED_OWNER");
    require(resolver_ != address(0x0), "UNDEFINED_RESOLVER");
    TldRecord storage _record = _records[keccak256(abi.encodePacked(tld))];
    _record.name = tld;
    _record.owner = owner_;
    _record.resolver = resolver_;
    _record.enable = enable_;
    _record.omni = omni;
    emit NewTld(tld, owner_);
  }

  function _setRecord(
    string memory domain,
    string memory tld,
    address owner_,
    address resolver_,
    uint256 expiry_
  ) internal {
    require(owner_ != address(0x0), "UNDEFINED_OWNER");
    if (resolver_ == address(0x0)) resolver_ = _records[keccak256(abi.encodePacked(tld))].resolver;
    require(exists(keccak256(abi.encodePacked(tld))), "TLD_NOT_EXIST");
    DomainRecord storage _record = _records[keccak256(abi.encodePacked(tld))].domains[keccak256(abi.encodePacked(domain))];
    _record.name = domain;
    _record.owner = owner_;
    _record.resolver = resolver_;
    _record.expiry = expiry_;
    emit NewDomain(domain, tld, owner_);
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

  function _setResolver(bytes32 tld, address resolver_) internal {
    require(exists(tld), "TLD_NOT_EXIST");
    _records[tld].resolver = resolver_;
    emit NewResolver(_records[tld].name, resolver_);
  }

  function _setResolver(
    bytes32 domain,
    bytes32 tld,
    address resolver_
  ) internal {
    require(exists(domain, tld), "DOMAIN_NOT_EXIST");
    _records[tld].domains[domain].resolver = resolver_;
    emit NewResolver(string(abi.encodePacked(_records[tld].domains[domain].name, ".", _records[tld].name)), resolver_);
  }

  function _setOwner(bytes32 tld, address owner_) internal {
    require(exists(tld), "TLD_NOT_EXIST");
    _records[tld].owner = owner_;
    emit NewOwner(string(abi.encodePacked(_records[tld].name)), owner_);
  }

  function _setOwner(
    bytes32 domain,
    bytes32 tld,
    address owner_
  ) internal {
    require(exists(domain, tld), "DOMAIN_NOT_EXIST");
    _records[tld].domains[domain].owner = owner_;
    emit NewOwner(string(abi.encodePacked(_records[tld].domains[domain].name, ".", _records[tld].name)), owner_);
  }

  function _setOperator(
    bytes32 domain,
    bytes32 tld,
    address operator_,
    bool approved
  ) internal {
    require(exists(domain, tld), "DOMAIN_NOT_EXIST");
    _records[tld].domains[domain].operators[operator_] = approved;
    emit SetOperator(string(abi.encodePacked(_records[tld].domains[domain].name, ".", _records[tld].name)), operator_, approved);
  }

  function _setOperator(
    bytes32 host,
    bytes32 domain,
    bytes32 tld,
    address operator_,
    bool approved
  ) internal {
    require(exists(host, domain, tld), "HOST_NOT_EXIST");
    _records[tld].domains[domain].hosts[host].operators[operator_] = approved;
    emit SetOperator(
      string(abi.encodePacked(_records[tld].domains[domain].hosts[host].name, ".", _records[tld].domains[domain].name, ".", _records[tld].name)),
      operator_,
      approved
    );
  }

  function _setExpiry(
    bytes32 domain,
    bytes32 tld,
    uint256 expiry_
  ) internal {
    require(exists(domain, tld), "DOMAIN_NOT_EXIST");
    require(_records[tld].domains[domain].expiry + GRACE_PERIOD >= block.timestamp, "DOMAIN_EXPIRED");
    _records[tld].domains[domain].expiry = expiry_;
  }

  function _setEnable(bytes32 tld, bool enable_) internal {
    require(exists(tld), "TLD_NOT_EXIST");
    _records[tld].enable = enable_;
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

  function enable(bytes32 tld) public view returns (bool) {
    return _records[tld].enable;
  }

  function omni(bytes32 tld) public view returns (bool) {
    return _records[tld].omni;
  }

  function supportsInterface(bytes4 interfaceID) public view override returns (bool) {
    return interfaceID == type(IRegistry).interfaceId || super.supportsInterface(interfaceID);
  }
}
