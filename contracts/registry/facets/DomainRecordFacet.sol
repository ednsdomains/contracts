// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "./interfaces/IHostRecordFacet.sol";
import "./interfaces/IDomainRecordFacet.sol";
import "./interfaces/ITldRecordFacet.sol";
import "./Facet.sol";
import "../../wrapper/interfaces/IWrapper.sol";
import "../../lib/TldClass.sol";
import "../../lib/RecordKind.sol";
import  "../../lib/Timestamp.sol";

contract DomainRecordFacet is IDomainRecordFacet, Facet {
  /* ========== Modifier ==========*/

  modifier onlyWrapper(bytes32 tld) {
    require(_msgSender() == registryStorage().records[tld].wrapper.address_ || _isSelfExecution(), "ONLY_OWNER_OR_WRAPPER");
    _;
  }

  modifier onlyDomainOwner(bytes32 name, bytes32 tld) {
    require(_msgSender() == registryStorage().records[tld].domains[name].owner || _isSelfExecution(), "ONLY_OWNER");
    _;
  }
  modifier onlyDomainOwnerOrWrapper(bytes32 name, bytes32 tld) {
    require(
      _msgSender() == registryStorage().records[tld].domains[name].owner || _msgSender() == registryStorage().records[tld].wrapper.address_ || _isSelfExecution(),
      "ONLY_OWNER_OR_WRAPPER"
    );
    _;
  }

  modifier onlyDomainUser(bytes32 name, bytes32 tld) {
    require(_msgSender() == getUser(name, tld) || _isSelfExecution(), "ONLY_DOMAIN_USER");
    _;
  }

  modifier onlyDomainUserOrOperator(bytes32 name, bytes32 tld) {
    require(_msgSender() == getUser(name, tld) || isOperator(name, tld, _msgSender()) || _isSelfExecution(), "ONLY_DOMAIN_USER_OR_OPERATOR");
    _;
  }

  modifier onlyLiveDomain(bytes32 name, bytes32 tld) {
    require(isLive(name, tld), "DOMAIN_EXPIRED");
    _;
  }

  /* ========== Mutative ==========*/
  function setRecord(bytes memory name, bytes memory tld, address owner, address resolver, uint64 expiry) public {
    require(hasRole(REGISTRAR_ROLE, _msgSender()) || hasRole(BRIDGE_ROLE, _msgSender()), "ONLY_AUTHORIZED");
    require(owner != address(0x0), "UNDEFINED_OWNER");
    require(ITldRecordFacet(_self()).isExists(keccak256(tld)), "TLD_NOT_EXIST");

    if (Timestamp.isMillisecond(expiry)) {
      expiry = Timestamp.toSecond(expiry);
    }
    require(expiry > block.timestamp && Timestamp.isSecond(expiry), "INVALID_EXPIRY");

    RegistryStorage storage _ds = registryStorage();

    if (resolver == address(0x0)) {
      resolver = _ds.records[keccak256(tld)].resolver;
    }

    uint256 id = getTokenId(name, tld);
    if (_ds.records[keccak256(tld)].wrapper.enable) {
      IWrapper(_ds.records[keccak256(tld)].wrapper.address_).mint(owner, id);
      if (isExists(keccak256(name), keccak256(tld))) {
        _remove(keccak256(name), keccak256(tld));
        IWrapper(_ds.records[keccak256(tld)].wrapper.address_).burn(id);
      }
    }

    DomainRecord storage _record = _ds.records[keccak256(tld)].domains[keccak256(name)];
    _record.name = name;
    _record.owner = owner;
    _record.resolver = resolver;
    _record.expiry = expiry;
    _record.user = UserRecord({ user: address(0), expiry: uint64(0) });
    emit NewDomain(name, tld, owner, expiry);

    TokenRecord storage _tokenRecord = _ds.tokenRecords[id];
    _tokenRecord.kind = RecordKind.DOMAIN;
    _tokenRecord.tld = keccak256(tld);
    _tokenRecord.domain = keccak256(name);

    if (!IHostRecordFacet(_self()).isExists(keccak256("@"), keccak256(name), keccak256(tld))) {
      IHostRecordFacet(_self()).setRecord(bytes("@"), name, tld, 3600); // TODO:
    }
  }

  function setResolver(bytes32 name, bytes32 tld, address resolver_) public onlyDomainUserOrOperator(name, tld) onlyLiveDomain(name, tld) {
    require(isExists(name, tld), "DOMAIN_NOT_EXIST");

    RegistryStorage storage _ds = registryStorage();

    _ds.records[tld].domains[name].resolver = resolver_;

    emit SetDomainResolver(name, tld, resolver_);
  }

  function setOwner(bytes32 name, bytes32 tld, address newOwner) public onlyDomainOwnerOrWrapper(name, tld) {
    require(isExists(name, tld), "DOMAIN_NOT_EXIST");

    RegistryStorage storage _ds = registryStorage();

    _ds.records[tld].domains[name].owner = newOwner;

    emit SetDomainOwner(name, tld, newOwner);
  }

  function setOperator(bytes32 name, bytes32 tld, address operator_, bool approved) public onlyDomainUser(name, tld) onlyLiveDomain(name, tld) {
    require(isExists(name, tld), "DOMAIN_NOT_EXIST");

    RegistryStorage storage _ds = registryStorage();

    _ds.records[tld].domains[name].operators[getOwner(name, tld)][operator_] = approved;

    emit SetDomainOperator(name, tld, operator_, approved);
  }

  function setUser(bytes32 name, bytes32 tld, address user, uint64 expiry) public onlyWrapper(tld) onlyLiveDomain(name, tld) {
    RegistryStorage storage _ds = registryStorage();

    _ds.records[tld].domains[name].user.user = user;

    if (expiry > uint64(0)) {
      if (Timestamp.isMillisecond(expiry)) {
        expiry = Timestamp.toSecond(expiry);
      }
      require(expiry > block.timestamp && Timestamp.isSecond(expiry), "INVALID_EXPIRY");
      require(expiry <= getExpiry(name, tld), "EXPIRY_OVERFLOW");
    }
    _ds.records[tld].domains[name].user.expiry = expiry;

    emit SetDomainUser(name, tld, user, expiry);
  }

  function setExpiry(bytes32 name, bytes32 tld, uint64 expiry) public onlyRole(REGISTRAR_ROLE) onlyLiveDomain(name, tld) {
    RegistryStorage storage _ds = registryStorage();

    if (Timestamp.isMillisecond(expiry)) {
      expiry = Timestamp.toSecond(expiry);
    }
    require(expiry > block.timestamp && Timestamp.isSecond(expiry), "INVALID_EXPIRY");

    require(expiry > _ds.records[tld].domains[name].expiry && expiry > block.timestamp, "INVALID_EXPIRY");

    _ds.records[tld].domains[name].expiry = expiry;

    emit SetDomainExpiry(name, tld, expiry);
  }

  /* ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ */
  /* ⚠️⚠️⚠️⚠️⚠️❗❗❗❗❗🔞🔞🔞 START OF DESCTRUCTIVE 🔞🔞🔞❗❗❗❗❗⚠️⚠️⚠️⚠️⚠️ */
  function _remove(bytes32 name, bytes32 tld) internal {
    RegistryStorage storage _ds = registryStorage();

    if (_ds.records[tld].wrapper.enable) {
      IWrapper(_ds.records[tld].wrapper.address_).burn(getTokenId(_ds.records[tld].domains[name].name, _ds.records[tld].name));
    }

    delete _ds.records[tld].domains[name];
    delete _ds.tokenRecords[getTokenId(_ds.records[tld].domains[name].name, _ds.records[tld].name)];

    emit RemoveDomain(name, tld);
  }

  /* ⚠️⚠️⚠️⚠️⚠️❗❗❗❗❗🔞🔞🔞 END OF DESCTRUCTIVE 🔞🔞🔞❗❗❗❗❗⚠️⚠️⚠️⚠️⚠️*/
  /* ⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️ */

  function bridge(bytes32 name, bytes32 tld) public onlyRole(BRIDGE_ROLE) {
    RegistryStorage storage _ds = registryStorage();
    require(_ds.unsyncHostUser[tld][name] == 0, "UNSYNC_HOST_USER_EXISTS");
    _remove(name, tld);
  }

  /* ========== Query - General ==========*/

  function getName(bytes32 name, bytes32 tld) external view returns (bytes memory) {
    RegistryStorage storage _ds = registryStorage();
    return _ds.records[tld].domains[name].name;
  }

  function getOwner(bytes32 name, bytes32 tld) public view returns (address) {
    require(isExists(name, tld), "DOMAIN_NOT_FOUND");
    return registryStorage().records[tld].domains[name].owner;
  }

  function getResolver(bytes32 name, bytes32 tld) public view returns (address) {
    require(isExists(name, tld), "DOMAIN_NOT_FOUND");
    return registryStorage().records[tld].domains[name].resolver;
  }

  function getExpiry(bytes32 name, bytes32 tld) public view returns (uint64) {
    uint64 expiry = registryStorage().records[tld].domains[name].expiry;
    if (Timestamp.isMillisecond(expiry)) {
      return Timestamp.toSecond(expiry);
    } else {
      return expiry;
    }
  }

  function getUser(bytes32 name, bytes32 tld) public view returns (address) {
    address user = registryStorage().records[tld].domains[name].user.user;
    if (user == address(0)) {
      return getOwner(name, tld);
    }
    return user;
  }

  function getUserExpiry(bytes32 name, bytes32 tld) public view returns (uint64) {
    uint64 expiry = registryStorage().records[tld].domains[name].user.expiry;
    if (expiry == uint64(0)) {
      return getExpiry(name, tld);
    }
    if (Timestamp.isMillisecond(expiry)) {
      return Timestamp.toSecond(expiry);
    } else {
      return expiry;
    }
  }

  /* ========== Query - Boolean ==========*/

  function isExists(bytes32 name, bytes32 tld) public view returns (bool) {
    return registryStorage().records[tld].domains[name].name.length > 0;
  }

  function isOperator(bytes32 name, bytes32 tld, address _operator) public view returns (bool) {
    return registryStorage().records[tld].domains[name].operators[getOwner(name, tld)][_operator];
  }

  function isLive(bytes32 name, bytes32 tld) public view returns (bool) {
    return registryStorage().records[tld].domains[name].expiry > block.timestamp;
  }

  /* ========== Utils ==========*/
  function getTokenId(bytes memory name_, bytes memory tld) public pure virtual returns (uint256) {
    return uint256(keccak256(_join(name_, tld)));
  }

  /* ========== ERC-165 ==========*/

  function supportsInterface(bytes4 interfaceID) public view override returns (bool) {
    return interfaceID == type(IDomainRecordFacet).interfaceId || super.supportsInterface(interfaceID);
  }
}
