// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../BaseResolver.sol";
import "./interfaces/IMultitTextResolver.sol";

abstract contract MultiTextResolver is IMultiTextResolver, BaseResolver {
    mapping(bytes32=>mapping(string=>string)) texts;

    function _setMultiText(
        bytes memory host,
        bytes memory name,
        bytes memory tld,
        string memory type_,
        string memory text
    ) internal {
        _setHostRecord(host, name, tld);
        bytes32 fqdn;
        if (keccak256(bytes(host)) == AT) {
            fqdn = keccak256(_join(name, tld));
        } else {
            require(_validHost(bytes(host)), "INVALID_HOST");
            fqdn = keccak256(_join(host, name, tld));
        }
        texts[fqdn][type_] = text;
        emit SetMultiText(host, name, tld,type_,text);
    }

    function setMultiText(
        bytes memory host,
        bytes memory name,
        bytes memory tld,
        string memory type_,
        string memory text
    ) public onlyLive(name, tld) onlyAuthorised(host, name, tld) {
        _setMultiText(host, name, tld, type_, text);
        // if (_registry.isOmni(keccak256(tld))) {
        //   uint16[] memory lzChainIds = _registry.getLzChainIds(keccak256(tld));
        //   _synchronizer.sync(lzChainIds, abi.encodeWithSignature("setMultiCoinAddress_SYNC(bytes,bytes,bytes,uint256,bytes)", host, name, tld, coin, address_));
        // }
    }

    function setMultiText_SYNC(
        bytes memory host,
        bytes memory name,
        bytes memory tld,
        string memory type_,
        string memory text
    ) public onlySynchronizer {
        _setMultiText(host, name, tld, type_, text);
    }

    function getMultiText(
        bytes memory host,
        bytes memory name,
        bytes memory tld,
        string memory type_
    ) public view onlyLive(name, tld) returns (string memory) {
        bytes32 fqdn;
        if (keccak256(bytes(host)) == AT) {
            fqdn = keccak256(_join(name, tld));
        } else {
            require(_validHost(bytes(host)), "INVALID_HOST");
            fqdn = keccak256(_join(host, name, tld));
        }
        return texts[fqdn][type_];
    }

    function supportsInterface(bytes4 interfaceID) public view virtual override returns (bool) {
        return interfaceID == type(MultiTextResolver).interfaceId || super.supportsInterface(interfaceID);
    }
}
