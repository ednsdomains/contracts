// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "./interfaces/ITldRecordFacet.sol";
import "./Facet.sol";
import "../../lib/TldClass.sol";
import "../../wrapper/interfaces/IWrapper.sol";

contract TldRecordFacet is ITldRecordFacet, Facet {
  /* ========== Modier ==========*/
  modifier onlyTldOwner(bytes32 tld) {
    require(_msgSender() == registryStorage().records[tld].owner || _isSelfExecution(), "ONLY_TLD_OWNER");
    _;
  }

  modifier onlyTldOwnerOrWrapper(bytes32 tld) {
    require(
      _msgSender() == registryStorage().records[tld].owner || _msgSender() == registryStorage().records[tld].wrapper.address_ || _isSelfExecution(),
      "ONLY_TLD_OWNER_OR_WRAPPER"
    );
    _;
  }

  /* ========== Mutative ==========*/

  function setRecord(Chain[] memory chains, bytes memory tld, address owner, address resolver, uint64 expiry, bool enable, TldClass class_) public onlyRole(ROOT_ROLE) {
    require(owner != address(0x0), "UNDEFINED_OWNER");
    require(resolver != address(0x0), "UNDEFINED_RESOLVER");

    RegistryStorage storage _ds = registryStorage();

    TldRecord storage _record = _ds.records[keccak256(tld)];
    _record.chains = chains;
    _record.name = tld;
    _record.owner = owner;
    _record.resolver = resolver;
    _record.expiry = expiry;
    _record.enable = enable;
    _record.class_ = class_;

    if (_ds.defaultWrapper != address(0)) {
      _setWrapper(keccak256(tld), true, _ds.defaultWrapper);
    }

    TokenRecord storage _tokenRecord = _ds.tokenRecords[getTokenId(tld)];
    _tokenRecord.kind = RecordKind.TLD;
    _tokenRecord.tld = keccak256(tld);

    emit NewTld(class_, tld, owner);
  }

  function setResolver(bytes32 tld, address resolver_) public onlyTldOwner(tld) {
    require(isExists(tld), "TLD_NOT_EXIST");

    RegistryStorage storage _ds = registryStorage();

    _ds.records[tld].resolver = resolver_;

    emit SetTldResolver(tld, resolver_);
  }

  function setOwner(bytes32 tld, address owner_) public onlyTldOwnerOrWrapper(tld) {
    require(isExists(tld), "TLD_NOT_EXIST");

    RegistryStorage storage _ds = registryStorage();

    _ds.records[tld].owner = owner_;

    emit SetTldOwner(tld, owner_);
  }

  function setEnable(bytes32 tld, bool enable) public onlyTldOwner(tld) {
    require(isExists(tld), "TLD_NOT_EXIST");

    RegistryStorage storage _ds = registryStorage();

    _ds.records[tld].enable = enable;

    emit SetTldEnable(tld, enable);
  }

  function _setWrapper(bytes32 tld, bool enable, address wrapper) internal {
    RegistryStorage storage _ds = registryStorage();
    WrapperRecord storage _wrapper = _ds.records[tld].wrapper;
    _wrapper.enable = enable;
    _wrapper.address_ = wrapper;
    emit SetTldWrapper(tld, wrapper, enable);
  }

  function setWrapper(bytes32 tld, bool enable, address wrapper) public onlyTldOwner(tld) {
    _setWrapper(tld, enable, wrapper);
  }

  function setExpiry(bytes32 tld, uint64 expiry) public onlyRole(ROOT_ROLE) {
    RegistryStorage storage _ds = registryStorage();

    require(expiry > _ds.records[tld].expiry && expiry > block.timestamp, "INVALID_EXPIRY");

    _ds.records[tld].expiry = expiry;

    emit SetTldExpiry(tld, expiry);
  }

  /* ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ */
  /* ⚠️⚠️⚠️⚠️⚠️❗❗❗❗❗🔞🔞🔞 START OF DESCTRUCTIVE 🔞🔞🔞❗❗❗❗❗⚠️⚠️⚠️⚠️⚠️ */
  function _remove(bytes32 tld) internal {
    RegistryStorage storage _ds = registryStorage();
    if (_ds.records[tld].wrapper.enable) {
      IWrapper(_ds.records[tld].wrapper.address_).burn(getTokenId(_ds.records[tld].name));
    }
    emit RemoveTld(tld);
    delete _ds.records[tld];
    delete _ds.tokenRecords[getTokenId(_ds.records[tld].name)];
  }

  /* ⚠️⚠️⚠️⚠️⚠️❗❗❗❗❗🔞🔞🔞 END OF DESCTRUCTIVE 🔞🔞🔞❗❗❗❗❗⚠️⚠️⚠️⚠️⚠️*/
  /* ⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️ */

  /* ========== Query - General ==========*/

  function getOwner(bytes32 tld) public view returns (address) {
    require(isExists(tld), "TLD_NOT_FOUND");
    return registryStorage().records[tld].owner;
  }

  function getResolver(bytes32 tld) public view returns (address) {
    require(isExists(tld), "TLD_NOT_FOUND");
    return registryStorage().records[tld].resolver;
  }

  function getExpiry(bytes32 tld) public view returns (uint64) {
    return registryStorage().records[tld].expiry;
  }

  function getClass(bytes32 tld) public view returns (TldClass) {
    return registryStorage().records[tld].class_;
  }

  function getChains(bytes32 tld) public view returns (Chain[] memory) {
    return registryStorage().records[tld].chains;
  }

  function getWrapper(bytes32 tld) public view returns (WrapperRecord memory) {
    return registryStorage().records[tld].wrapper;
  }

  /* ========== Query - Boolean ==========*/

  function isExists(bytes32 tld) public view returns (bool) {
    return registryStorage().records[tld].name.length > 0;
  }

  function isEnable(bytes32 tld) public view returns (bool) {
    return registryStorage().records[tld].enable;
  }

  /* ========== Utils ==========*/

  function getTokenId(bytes memory tld) public pure virtual returns (uint256) {
    return uint256(keccak256(tld));
  }

  /* ========== ERC-165 ==========*/
  function supportsInterface(bytes4 interfaceID) public view override returns (bool) {
    return interfaceID == type(ITldRecordFacet).interfaceId || super.supportsInterface(interfaceID);
  }
}
