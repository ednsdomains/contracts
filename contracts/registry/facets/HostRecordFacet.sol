// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "./interfaces/IHostRecordFacet.sol";
import "./interfaces/IDomainRecordFacet.sol";
import "./interfaces/ITldRecordFacet.sol";
import "./Facet.sol";
import "../../wrapper/interfaces/IWrapper.sol";
import "../../lib/TldClass.sol";
import "../../lib/RecordKind.sol";
import "../../lib/Timestamp.sol";
import "../../mortgage/interfaces/IMortgage.sol";

contract HostRecordFacet is IHostRecordFacet, Facet {
  /* ========== Modifier ==========*/

  modifier onlyWrapper(bytes32 tld) {
    require(_msgSender() == registryStorage().records[tld].wrapper.address_ || _isSelfExecution(), "ONLY_OWNER_OR_WRAPPER");
    _;
  }

  modifier onlyDomainUserOrOperator(bytes32 name, bytes32 tld) {
    require(
      _msgSender() == IDomainRecordFacet(_self()).getUser(name, tld) || IDomainRecordFacet(_self()).isOperator(name, tld, _msgSender()) || _isSelfExecution() || isPublicResolver(),
      "ONLY_DOMAIN_USER_OR_OPERATOR"
    );
    if (!_isSelfExecution() && registryStorage().mortgage != address(0)) require(IMortgage(registryStorage().mortgage).isFulfill(name, tld), "DOMAIN_MORTGAGE_NOT_FULFILLED");
    _;
  }

  modifier onlyLiveDomain(bytes32 name, bytes32 tld) {
    require(IDomainRecordFacet(_self()).isLive(name, tld), "DOMAIN_EXPIRED");
    _;
  }

  modifier onlyHostUser(
    bytes32 host,
    bytes32 name,
    bytes32 tld
  ) {
    require(_msgSender() == getUser(host, name, tld) || _isSelfExecution(), "ONLY_HOST_USER");
    if (!_isSelfExecution() && registryStorage().mortgage != address(0)) require(IMortgage(registryStorage().mortgage).isFulfill(name, tld), "DOMAIN_MORTGAGE_NOT_FULFILLED");
    _;
  }

  modifier onlyHostUserOrOperator(
    bytes32 host,
    bytes32 name,
    bytes32 tld
  ) {
    require(_msgSender() == getUser(host, name, tld) || isOperator(host, name, tld, _msgSender()) || _isSelfExecution(), "ONLY_HOST_USER_OR_OPERATOR");
    if (!_isSelfExecution() && registryStorage().mortgage != address(0)) require(IMortgage(registryStorage().mortgage).isFulfill(name, tld), "DOMAIN_MORTGAGE_NOT_FULFILLED");
    _;
  }

  /* ========== Mutative ==========*/

  function _setRecord(bytes memory host, bytes memory name, bytes memory tld, uint16 ttl) private {
    bytes32 host_ = keccak256(host);
    bytes32 name_ = keccak256(name);
    bytes32 tld_ = keccak256(tld);

    require(!isExists(host_, name_, tld_), "HOST_ALREADY_EXIST");

    RegistryStorage storage _ds = registryStorage();

    if (ttl == 0) {
      ttl = 3600;
    }

    HostRecord storage _record = _ds.records[tld_].domains[name_].hosts[host_];
    _record.name = host;
    _record.ttl = ttl;

    UserRecord storage _user = _ds.records[tld_].domains[name_].hosts[host_].user;
    _user.user = address(0);
    _user.expiry = uint64(0);

    emit NewHost(host, name, tld, ttl);

    TokenRecord storage _tokenRecord = _ds.tokenRecords[getTokenId(host, name, tld)];
    _tokenRecord.kind = RecordKind.HOST;
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

  function setOperator(bytes32 host, bytes32 name, bytes32 tld, address operator_, bool approved) public onlyHostUser(host, name, tld) onlyLiveDomain(name, tld) {
    require(isExists(host, name, tld), "HOST_NOT_EXIST");
    RegistryStorage storage _ds = registryStorage();
    _ds.records[tld].domains[name].hosts[host].operators[getUser(host, name, tld)][operator_] = approved;
    emit SetHostOperator(host, name, tld, operator_, approved);
  }

  function setUser(bytes32 host, bytes32 name, bytes32 tld, address newUser, uint64 expiry) public onlyWrapper(tld) onlyLiveDomain(name, tld) {
    require(isExists(host, name, tld), "HOST_NOT_EXISTS");

    RegistryStorage storage _ds = registryStorage();

    address owner = IDomainRecordFacet(_self()).getOwner(name, tld);
    address currUser = getUser(host, name, tld);

    if (owner == currUser && currUser != newUser) {
      _ds.unsyncHostUser[tld][name] += 1;
    } else if (currUser != owner && currUser == newUser) {
      if (_ds.unsyncHostUser[tld][name] > 0) {
        _ds.unsyncHostUser[tld][name] -= 1;
      }
    }

    if (expiry > uint64(0)) {
      if (Timestamp.isMillisecond(expiry)) {
        expiry = Timestamp.toSecond(expiry);
      }
      require(expiry > block.timestamp && Timestamp.isSecond(expiry), "INVALID_EXPIRY");
      require(expiry <= IDomainRecordFacet(_self()).getExpiry(name, tld), "EXPIRY_OVERFLOW");
      _ds.records[tld].domains[name].hosts[host].user.expiry = expiry;
    }

    _ds.records[tld].domains[name].hosts[host].user.user = newUser;
    emit SetHostUser(host, name, tld, newUser, expiry);
  }

  /* ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ */
  /* ⚠️⚠️⚠️⚠️⚠️❗❗❗❗❗🔞🔞🔞 START OF DESCTRUCTIVE 🔞🔞🔞❗❗❗❗❗⚠️⚠️⚠️⚠️⚠️ */
  function unsetRecord(bytes32 host, bytes32 name, bytes32 tld) public onlyLiveDomain(name, tld) {
    require(
      _msgSender() == IDomainRecordFacet(_self()).getUser(name, tld) &&
        _msgSender() == getUser(host, name, tld) &&
        IDomainRecordFacet(_self()).getUserExpiry(name, tld) > block.timestamp &&
        getUserExpiry(host, name, tld) > block.timestamp,
      "ONLY_USERS"
    );
    _unsetRecord(host, name, tld);
  }

  function _unsetRecord(bytes32 host, bytes32 name, bytes32 tld) internal {
    RegistryStorage storage _ds = registryStorage();
    delete _ds.records[tld].domains[name].hosts[host];
    delete _ds.tokenRecords[getTokenId(_ds.records[tld].domains[name].hosts[host].name, _ds.records[tld].domains[name].name, _ds.records[tld].name)];
    if (_ds.records[tld].wrapper.enable) {
      IWrapper(_ds.records[tld].wrapper.address_).burn(getTokenId(_ds.records[tld].domains[name].hosts[host].name, _ds.records[tld].domains[name].name, _ds.records[tld].name));
    }

    emit RemoveHost(host, name, tld);
  }

  /* ⚠️⚠️⚠️⚠️⚠️❗❗❗❗❗🔞🔞🔞 END OF DESCTRUCTIVE 🔞🔞🔞❗❗❗❗❗⚠️⚠️⚠️⚠️⚠️*/
  /* ⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️ */

  /* ========== Query - General ==========*/

  function getName(bytes32 host, bytes32 name, bytes32 tld) external view returns (bytes memory) {
    RegistryStorage storage _ds = registryStorage();
    return _ds.records[tld].domains[name].hosts[host].name;
  }

  function getUser(bytes32 host, bytes32 name, bytes32 tld) public view returns (address) {
    address user = registryStorage().records[tld].domains[name].hosts[host].user.user;
    if (user == address(0)) {
      return IDomainRecordFacet(_self()).getUser(name, tld);
    }
    return user;
  }

  function getUserExpiry(bytes32 host, bytes32 name, bytes32 tld) public view returns (uint64) {
    uint64 expiry = registryStorage().records[tld].domains[name].hosts[host].user.expiry;
    if (expiry == uint64(0)) {
      return IDomainRecordFacet(_self()).getUserExpiry(name, tld);
    }
    if (Timestamp.isMillisecond(expiry)) {
      return Timestamp.toSecond(expiry);
    } else {
      return expiry;
    }
  }

  function getTtl(bytes32 host, bytes32 name, bytes32 tld) public view returns (uint16) {
    return registryStorage().records[tld].domains[name].hosts[host].ttl;
  }

  /* ========== Query - Boolean ==========*/
  function isExists(bytes32 host, bytes32 name, bytes32 tld) public view returns (bool) {
    return registryStorage().records[tld].domains[name].hosts[host].name.length > 0;
  }

  function isOperator(bytes32 host, bytes32 name, bytes32 tld, address _operator) public view returns (bool) {
    return registryStorage().records[tld].domains[name].hosts[host].operators[getUser(host, name, tld)][_operator];
  }

  function isLive(bytes32 host, bytes32 name, bytes32 tld) public view returns (bool) {
    return getUserExpiry(host, name, tld) > block.timestamp;
  }

  /* ========== Utils ==========*/
  function getTokenId(bytes memory host, bytes memory name_, bytes memory tld) public pure virtual returns (uint256) {
    return uint256(keccak256(_join(host, name_, tld)));
  }

  /* ========== ERC-165 ==========*/
  function supportsInterface(bytes4 interfaceID) public view override returns (bool) {
    return interfaceID == type(IHostRecordFacet).interfaceId || super.supportsInterface(interfaceID);
  }
}
