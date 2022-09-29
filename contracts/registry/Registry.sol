//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// import "https://github.com/Arachnid/solidity-bytesutils/blob/master/bytess.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/IERC721MetadataUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "../utils/LabelOperator.sol";
import "./interfaces/IRegistry.sol";
import "./lib/TldClass.sol";

contract Registry is IRegistry, LabelOperator, AccessControlUpgradeable {
  using AddressUpgradeable for address;

  string private _name;
  string private _symbol;
  mapping(address => uint256) private _balances;

  uint256 public constant GRACE_PERIOD = 30 days;

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");
  bytes32 public constant PUBLIC_RESOLVER_ROLE = keccak256("PUBLIC_RESOLVER_ROLE");
  bytes32 public constant ROOT_ROLE = keccak256("ROOT_ROLE");

  bytes internal __baseURI;

  mapping(bytes32 => TldRecord) internal _records;
  mapping(uint256 => TokenRecord) internal _tokenRecords;

  mapping(address => mapping(address => bool)) private _operatorApprovals;

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
      _msgSender() == _records[tld].domains[name].owner || _records[tld].domains[name].operators[_msgSender()] || _records[tld].domains[name].hosts[host].operators[_msgSender()],
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
    _name = "Omni Name Service";
    _symbol = "OMNS";
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

    TldRecord storage _record = _records[keccak256(tld)];
    _record.name = tld;
    _record.owner = owner_;
    _record.resolver = resolver_;
    _record.enable = enable_;
    _record.class_ = class_;
    emit NewTld(tld, owner_);

    TokenRecord storage _tokenRecord = _tokenRecords[getTokenId(tld)];
    _tokenRecord.class_ = RecordType.TLD;
    _tokenRecord.tld = keccak256(tld);
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

    uint256 id = uint256(keccak256(_join(name, tld)));
    if (isExists_) {
      _burn(id);
    }
    _mint(owner_, id);

    DomainRecord storage _record = _records[keccak256(tld)].domains[keccak256(name)];
    _record.name = name;
    _record.owner = owner_;
    _record.resolver = resolver_;
    _record.expires = expires_;
    if (!isExists_) {
      Rental storage _rental = _records[keccak256(tld)].domains[keccak256(name)].rental;
      _rental.user = owner_;
      _rental.expires = expires_;
      emit UpdateUser(id, owner_, expires_);
    }
    emit NewDomain(name, tld, owner_);

    TokenRecord storage _tokenRecord = _tokenRecords[getTokenId(tld)];
    _tokenRecord.class_ = RecordType.DOMAIN;
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

    HostRecord storage _record = _records[keccak256(tld)].domains[keccak256(name)].hosts[keccak256(host)];
    _record.name = host;

    if (!isExists_) {
      Rental storage _rental = _records[keccak256(tld)].domains[keccak256(name)].hosts[keccak256(host)].rental;
      _rental.user = getOwner(keccak256(name), keccak256(tld));
      _rental.expires = getExpires(keccak256(name), keccak256(tld));
      uint256 id = uint256(keccak256(_join(host, name, tld)));
      emit UpdateUser(id, getOwner(keccak256(name), keccak256(tld)), getExpires(keccak256(name), keccak256(tld)));
    }

    emit NewHost(host, name, tld);

    TokenRecord storage _tokenRecord = _tokenRecords[getTokenId(tld)];
    _tokenRecord.class_ = RecordType.HOST;
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

  function remove(bytes32 name, bytes32 tld) external onlyRegistrar {
    delete _records[tld].domains[name];
    _burn(getTokenId(_records[tld].domains[name].name, _records[tld].name));
  }

  function remove(
    bytes32 host,
    bytes32 name,
    bytes32 tld
  ) external onlyRegistrar {
    delete _records[tld].domains[name].hosts[host];
    _burn(getTokenId(_records[tld].domains[name].hosts[host].name, _records[tld].domains[name].name, _records[tld].name));
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

  function _getTokenRecord(uint256 tokenId_) internal view returns (TokenRecord memory) {
    return _tokenRecords[tokenId_];
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

  /* ========== ERC721 ==========*/

  function balanceOf(address owner_) public view override returns (uint256) {
    require(owner_ != address(0), "ERC721: balance query for the zero address");
    return _balances[owner_];
  }

  function ownerOf(uint256 tokenId_) public view returns (address) {
    TokenRecord memory tRecord_ = _getTokenRecord(tokenId_);
    if (tRecord_.class_ == RecordType.TLD) {
      return _records[tRecord_.tld].owner;
    } else if (tRecord_.class_ == RecordType.DOMAIN || tRecord_.class_ == RecordType.HOST) {
      return _records[tRecord_.tld].domains[tRecord_.domain].owner;
    } else {
      revert(""); // TODO:
    }
  }

  function safeTransferFrom(
    address from,
    address to,
    uint256 tokenId_
  ) public virtual override {
    safeTransferFrom(from, to, tokenId_, "");
  }

  function transferFrom(
    address from,
    address to,
    uint256 tokenId_
  ) public virtual override {
    //solhint-disable-next-line max-line-length
    require(_isApprovedOrOwner(_msgSender(), tokenId_), "ERC721: transfer caller is not owner nor approved");
    _transfer(from, to, tokenId_);
  }

  function approve(address to, uint256 tokenId_) public virtual override {
    address owner = ownerOf(tokenId_);
    require(to != owner, "ERC721: approval to current owner");
    require(_msgSender() == owner || isApprovedForAll(owner, _msgSender()), "ERC721: approve caller is not owner nor approved for all");

    _approve(to, tokenId_);
  }

  function getApproved(uint256 tokenId_) public view returns (address) {
    return ownerOf(tokenId_);
  }

  function setApprovalForAll(address operator, bool approved) public {
    _setApprovalForAll(_msgSender(), operator, approved);
  }

  function isApprovedForAll(address owner, address operator) public view returns (bool) {
    return _operatorApprovals[owner][operator];
  }

  function safeTransferFrom(
    address from,
    address to,
    uint256 tokenId_,
    bytes memory _data
  ) public {
    require(_isApprovedOrOwner(_msgSender(), tokenId_), "ERC721: transfer caller is not owner nor approved");
    _safeTransfer(from, to, tokenId_, _data);
  }

  function _safeTransfer(
    address from,
    address to,
    uint256 tokenId_,
    bytes memory _data
  ) internal virtual {
    _transfer(from, to, tokenId_);
    require(_checkOnERC721Received(from, to, tokenId_, _data), "ERC721: transfer to non ERC721Receiver implementer");
  }

  function _exists(uint256 tokenId_) internal view virtual returns (bool) {
    TokenRecord memory tRecord_ = _getTokenRecord(tokenId_);
    if (tRecord_.class_ == RecordType.TLD) {
      return _records[tRecord_.tld].owner != address(0);
    } else if (tRecord_.class_ == RecordType.DOMAIN) {
      return _records[tRecord_.tld].domains[tRecord_.domain].owner != address(0);
    } else if (tRecord_.class_ == RecordType.HOST) {
      return _records[tRecord_.tld].domains[tRecord_.domain].hosts[tRecord_.host].name.length > 0;
    }
  }

  function _isApprovedOrOwner(address spender, uint256 tokenId_) internal view virtual returns (bool) {
    require(_exists(tokenId_), "ERC721: operator query for nonexistent token");
    address owner = ownerOf(tokenId_);
    return (spender == owner || getApproved(tokenId_) == spender || isApprovedForAll(owner, spender));
  }

  function _mint(address to, uint256 tokenId_) internal virtual {
    require(to != address(0), "ERC721: mint to the zero address");
    require(!_exists(tokenId_), "ERC721: token already minted");
    _balances[to] += 1;
    emit Transfer(address(0), to, tokenId_);
  }

  function _burn(uint256 tokenId_) internal virtual {
    address owner = ownerOf(tokenId_);
    _approve(address(0), tokenId_);
    _balances[owner] -= 1;
    delete _tokenRecords[tokenId_];
    emit Transfer(owner, address(0), tokenId_);
  }

  function _transfer(
    address from,
    address to,
    uint256 tokenId_
  ) internal virtual {
    require(ownerOf(tokenId_) == from, "ERC721: transfer from incorrect owner");
    require(to != address(0), "ERC721: transfer to the zero address");
    TokenRecord memory tRecord_ = _getTokenRecord(tokenId_);
    if (tRecord_.class_ == RecordType.TLD) {
      _records[tRecord_.tld].owner = to;
    } else if (tRecord_.class_ == RecordType.DOMAIN) {
      _records[tRecord_.tld].domains[tRecord_.domain].owner = to;
    } else if (tRecord_.class_ == RecordType.HOST) {
      revert("ERC721: cannot transfer a host");
    }
    _approve(address(0), tokenId_);
    _balances[from] -= 1;
    _balances[to] += 1;
    emit Transfer(from, to, tokenId_);
  }

  function _approve(address to, uint256 tokenId_) internal virtual {
    TokenRecord memory tRecord_ = _getTokenRecord(tokenId_);
    if (tRecord_.class_ == RecordType.DOMAIN) {
      _records[tRecord_.tld].domains[tRecord_.domain].operators[to] = true;
    } else if (tRecord_.class_ == RecordType.HOST) {
      _records[tRecord_.tld].domains[tRecord_.domain].hosts[tRecord_.host].operators[to] = true;
    } else if (tRecord_.class_ == RecordType.TLD) {
      revert("ERC721: cannot approve for TLD");
    }
    emit Approval(ownerOf(tokenId_), to, tokenId_);
  }

  function _setApprovalForAll(
    address owner,
    address operator,
    bool approved
  ) internal virtual {
    require(owner != operator, "ERC721: approve to caller");
    _operatorApprovals[owner][operator] = approved;
    emit ApprovalForAll(owner, operator, approved);
  }

  function _checkOnERC721Received(
    address from,
    address to,
    uint256 tokenId_,
    bytes memory _data
  ) private returns (bool) {
    if (to.isContract()) {
      try IERC721ReceiverUpgradeable(to).onERC721Received(_msgSender(), from, tokenId_, _data) returns (bytes4 retval) {
        return retval == IERC721ReceiverUpgradeable.onERC721Received.selector;
      } catch (bytes memory reason) {
        if (reason.length == 0) {
          revert("ERC721: transfer to non ERC721Receiver implementer");
        } else {
          assembly {
            revert(add(32, reason), mload(reason))
          }
        }
      }
    } else {
      return true;
    }
  }

  /* ========== ERC721 Metadata ==========*/

  function name() public view virtual returns (string memory) {
    return _name;
  }

  function symbol() public view virtual returns (string memory) {
    return _symbol;
  }

  function tokenURI(uint256 tokenId_) public view returns (string memory) {
    require(_exists(tokenId_), "ERC721Metadata: URI query for nonexistent token");
    // `{_baseURI}/{chainId}/{contractAddress}/{tokenId}/metadata.json`
    return
    string(
      abi.encodePacked(
        __baseURI,
        "/",
        block.chainid,
        "/",
        StringsUpgradeable.toHexString(uint160(address(this)), 20),
        "/",
        StringsUpgradeable.toString(tokenId_),
        "/",
        "metadata.json"
      )
    );
  }

  function setBaseURI(string memory baseURI_) public virtual onlyAdmin {
    __baseURI = bytes(baseURI_);
  }

  /* ========== ERC4907 ==========*/
  function setUser(
    uint256 tokenId_,
    address user,
    uint64 expires
  ) public {
    require(userOf(tokenId_) == _msgSender(), "ERC4907: incorrect owner");
    TokenRecord memory tRecord_ = _getTokenRecord(tokenId_);
    if (tRecord_.class_ == RecordType.DOMAIN) {
      require(expires <= _records[tRecord_.tld].domains[tRecord_.domain].rental.expires, "ERC4907: exceed expires");
      _records[tRecord_.tld].domains[tRecord_.domain].rental.user = user;
      _records[tRecord_.tld].domains[tRecord_.domain].rental.expires = expires;
      emit UpdateUser(tokenId_, user, expires);
    } else if (tRecord_.class_ == RecordType.HOST) {
      require(expires <= _records[tRecord_.tld].domains[tRecord_.domain].hosts[tRecord_.host].rental.expires, "ERC4907: exceed expires");
      _records[tRecord_.tld].domains[tRecord_.domain].hosts[tRecord_.host].rental.user = user;
      _records[tRecord_.tld].domains[tRecord_.domain].hosts[tRecord_.host].rental.expires = expires;
    } else {
      revert("ERC4907: cannot set user for TLD or host");
    }
  }

  function userOf(uint256 tokenId_) public view returns (address) {
    TokenRecord memory tRecord_ = _getTokenRecord(tokenId_);
    if (tRecord_.class_ == RecordType.DOMAIN) {
      return _records[tRecord_.tld].domains[tRecord_.domain].rental.user;
    } else if (tRecord_.class_ == RecordType.HOST) {
      return _records[tRecord_.tld].domains[tRecord_.domain].hosts[tRecord_.host].rental.user;
    } else {
      revert("ERC4907: cannot get user of TLD of host");
    }
  }

  function userExpires(uint256 tokenId_) public view returns (uint256) {
    TokenRecord memory tRecord_ = _getTokenRecord(tokenId_);
    if (tRecord_.class_ == RecordType.DOMAIN) {
      return _records[tRecord_.tld].domains[tRecord_.domain].rental.expires;
    } else if (tRecord_.class_ == RecordType.HOST) {
      return _records[tRecord_.tld].domains[tRecord_.domain].hosts[tRecord_.host].rental.expires;
    } else {
      revert("ERC4907: cannot get user expiures of TLD of host");
    }
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

  function supportsInterface(bytes4 interfaceID) public view override(IERC165Upgradeable, AccessControlUpgradeable) returns (bool) {
    return
    interfaceID == type(IERC4907).interfaceId ||
    interfaceID == type(IERC721Upgradeable).interfaceId ||
    interfaceID == type(IERC721MetadataUpgradeable).interfaceId ||
    interfaceID == type(IRegistry).interfaceId ||
    super.supportsInterface(interfaceID);
  }
}
