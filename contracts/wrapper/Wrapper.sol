//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../registry/interfaces/IRegistry.sol";
import "./interfaces/IWrapper.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/IERC721MetadataUpgradeable.sol";

contract Wrapper is IWrapper, AccessControlUpgradeable, OwnableUpgradeable, UUPSUpgradeable {
  IRegistry private _registry;

  using AddressUpgradeable for address;
  using StringsUpgradeable for uint256;

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant RENTAL_ROLE = keccak256("RENTAL_ROLE");

  string private _name;
  string private _symbol;
  bytes internal __baseURI;

  mapping(address => uint256) private _balances;
  mapping(uint256 => address) private _tokenApprovals;
  mapping(address => mapping(address => bool)) private _operatorApprovals;

  modifier onlyRegistry() {
    require(_msgSender() == address(_registry), "ONLY_REGISTRY");
    _;
  }

  /* ========== Initializer ==========*/

  function initialize(
    IRegistry registry_,
    string memory name_,
    string memory symbol_
  ) public initializer {
    __Wrapper_init(registry_, name_, symbol_);
  }

  function __Wrapper_init(
    IRegistry registry_,
    string memory name_,
    string memory symbol_
  ) internal onlyInitializing {
    __Wrapper_init_unchained(registry_, name_, symbol_);
    __Ownable_init();
    __AccessControl_init();
    __ERC165_init();
  }

  function __Wrapper_init_unchained(
    IRegistry registry_,
    string memory name_,
    string memory symbol_
  ) internal onlyInitializing {
    _registry = registry_;
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _grantRole(ADMIN_ROLE, _msgSender());
    _name = name_;
    _symbol = symbol_;
  }

  /* ========== ERC-721 ==========*/

  function balanceOf(address owner_) public view returns (uint256) {
    require(owner_ != address(0), "ERC721: balance query for the zero address");
    return _balances[owner_];
  }

  function ownerOf(uint256 tokenId) public view returns (address) {
    TokenRecord.TokenRecord memory _tokenRecord = _registry.getTokenRecord(tokenId);
    if (_tokenRecord.type_ == RecordType.RecordType.TLD) {
      return _registry.getOwner(_tokenRecord.tld);
    } else if (_tokenRecord.type_ == RecordType.RecordType.DOMAIN || _tokenRecord.type_ == RecordType.RecordType.HOST) {
      return _registry.getOwner(_tokenRecord.domain, _tokenRecord.tld);
    } else {
      revert(""); // TODO:
    }
  }

  function _transfer(
    address from,
    address to,
    uint256 tokenId
  ) internal {
    require(ownerOf(tokenId) == from, "ERC721: transfer from incorrect owner");
    require(to != address(0), "ERC721: transfer to the zero address");
    delete _tokenApprovals[tokenId];
    unchecked {
      _balances[from] -= 1;
      _balances[to] += 1;
    }
    emit Transfer(from, to, tokenId);
    TokenRecord.TokenRecord memory _tokenRecord = _registry.getTokenRecord(tokenId);
    if (_tokenRecord.type_ != RecordType.RecordType.TLD) {
      _registry.setOwner(_tokenRecord.tld, to);
    } else if (_tokenRecord.type_ != RecordType.RecordType.DOMAIN) {
      _registry.setOwner(_tokenRecord.domain, _tokenRecord.tld, to);
    } else {
      revert(""); // TODO:
    }
  }

  function _safeTransfer(
    address from,
    address to,
    uint256 tokenId,
    bytes memory data
  ) internal virtual {
    _transfer(from, to, tokenId);
    require(_checkOnERC721Received(from, to, tokenId, data), "ERC721: transfer to non ERC721Receiver implementer");
  }

  function safeTransferFrom(
    address from,
    address to,
    uint256 tokenId,
    bytes memory _data
  ) public {
    require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner or approved");
    _safeTransfer(from, to, tokenId, _data);
  }

  function safeTransferFrom(
    address from,
    address to,
    uint256 tokenId
  ) public {
    safeTransferFrom(from, to, tokenId, "");
  }

  function _isApprovedOrOwner(address spender, uint256 tokenId) internal view virtual returns (bool) {
    address owner = ownerOf(tokenId);
    return (spender == owner || isApprovedForAll(owner, spender) || getApproved(tokenId) == spender);
  }

  function transferFrom(
    address from,
    address to,
    uint256 tokenId
  ) public {
    //solhint-disable-next-line max-line-length
    require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner or approved");
    _transfer(from, to, tokenId);
  }

  function _approve(address to, uint256 tokenId) internal virtual {
    _tokenApprovals[tokenId] = to;
    emit Approval(ownerOf(tokenId), to, tokenId);
  }

  function approve(address to, uint256 tokenId) public {
    address owner = ownerOf(tokenId);
    require(to != owner, "ERC721: approval to current owner");
    require(_msgSender() == owner || isApprovedForAll(owner, _msgSender()), "ERC721: approve caller is not token owner or approved for all");
    _approve(to, tokenId);
  }

  function getApproved(uint256 tokenId) public view returns (address) {
    return ownerOf(tokenId);
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

  function setApprovalForAll(address operator, bool approved) public {
    _setApprovalForAll(_msgSender(), operator, approved);
  }

  function isApprovedForAll(address owner, address operator) public view returns (bool) {
    return _operatorApprovals[owner][operator];
  }

  function mint(address to, uint256 tokenId) external onlyRegistry {
    _balances[to] += 1;
    emit Transfer(address(0), to, tokenId);
  }

  function burn(uint256 tokenId) external onlyRegistry {
    address owner = ownerOf(tokenId);
    delete _tokenApprovals[tokenId];
    emit Transfer(owner, address(0), tokenId);
  }

  function _checkOnERC721Received(
    address from,
    address to,
    uint256 tokenId,
    bytes memory data
  ) private returns (bool) {
    if (to.isContract()) {
      try IERC721ReceiverUpgradeable(to).onERC721Received(_msgSender(), from, tokenId, data) returns (bytes4 retval) {
        return retval == IERC721ReceiverUpgradeable.onERC721Received.selector;
      } catch (bytes memory reason) {
        if (reason.length == 0) {
          revert("ERC721: transfer to non ERC721Receiver implementer");
        } else {
          /// @solidity memory-safe-assembly
          assembly {
            revert(add(32, reason), mload(reason))
          }
        }
      }
    } else {
      return true;
    }
  }

  /* ========== ERC-721 Metadata ==========*/

  function name() public view virtual returns (string memory) {
    return _name;
  }

  function setName(string memory name_) public onlyRole(ADMIN_ROLE) {
    _name = name_;
  }

  function symbol() public view virtual returns (string memory) {
    return _symbol;
  }

  function setSymbol(string memory symbol_) public onlyRole(ADMIN_ROLE) {
    _symbol = symbol_;
  }

  function tokenURI(uint256 tokenId) public view returns (string memory) {
    return string(abi.encodePacked(__baseURI, "/", StringsUpgradeable.toString(tokenId), "/", "payload.json"));
  }

  function setBaseURI(string memory baseURI_) public virtual onlyRole(ADMIN_ROLE) {
    __baseURI = bytes(baseURI_);
  }

  /* ========== ERC-4907 ==========*/

  function setUser(
    uint256 tokenId,
    address user,
    uint64 expiry
  ) public {
    TokenRecord.TokenRecord memory _tokenRecord = _registry.getTokenRecord(tokenId);
    require(
      hasRole(RENTAL_ROLE, _msgSender()) ||
        (ownerOf(tokenId) == _msgSender() && userOf(tokenId) == _msgSender() && expiry <= _registry.getExpiry(_tokenRecord.domain, _tokenRecord.tld)) || // User is Owner
        (ownerOf(tokenId) == _msgSender() && userOf(tokenId) != _msgSender() && userExpiry(tokenId) <= block.timestamp) || // User is NOT Owner, but user expiry
        (userOf(tokenId) == _msgSender() && userExpiry(tokenId) > block.timestamp && userExpiry(tokenId) >= expiry),
      "ERC4907: forbidden access"
    );
    if (_tokenRecord.type_ == RecordType.RecordType.DOMAIN) {
      _registry.setUser(_tokenRecord.domain, _tokenRecord.tld, user, expiry);
    } else if (_tokenRecord.type_ == RecordType.RecordType.HOST) {
      _registry.setUser(_tokenRecord.host, _tokenRecord.domain, _tokenRecord.tld, user, expiry);
    } else {
      revert(""); // TODO:
    }
    emit UpdateUser(tokenId, user, expiry);
  }

  function userOf(uint256 tokenId) public view returns (address) {
    TokenRecord.TokenRecord memory _tokenRecord = _registry.getTokenRecord(tokenId);
    if (_tokenRecord.type_ == RecordType.RecordType.DOMAIN) {
      return _registry.getUser(_tokenRecord.domain, _tokenRecord.tld);
    } else if (_tokenRecord.type_ == RecordType.RecordType.HOST) {
      return _registry.getUser(_tokenRecord.host, _tokenRecord.domain, _tokenRecord.tld);
    } else {
      revert(""); // TODO:
    }
  }

  function userExpiry(uint256 tokenId) public view returns (uint256) {
    TokenRecord.TokenRecord memory _tokenRecord = _registry.getTokenRecord(tokenId);
    if (_tokenRecord.type_ == RecordType.RecordType.DOMAIN) {
      return _registry.getUserExpiry(_tokenRecord.domain, _tokenRecord.tld);
    } else if (_tokenRecord.type_ == RecordType.RecordType.HOST) {
      return _registry.getUserExpiry(_tokenRecord.host, _tokenRecord.domain, _tokenRecord.tld);
    } else {
      revert(""); // TODO:
    }
  }

  function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}

  function supportsInterface(bytes4 interfaceID) public view override(IERC165Upgradeable, AccessControlUpgradeable) returns (bool) {
    return
      interfaceID == type(IWrapper).interfaceId ||
      interfaceID == type(IERC721Upgradeable).interfaceId ||
      interfaceID == type(IERC721MetadataUpgradeable).interfaceId ||
      interfaceID == type(IERC4907).interfaceId ||
      super.supportsInterface(interfaceID);
  }
}
