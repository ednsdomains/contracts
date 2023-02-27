// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "../../diamond/access/AccessControl.sol";
import "../storage/facets/RegistryStorageFacet.sol";
import "./interfaces/IHostRecordFacet.sol";
import "./interfaces/IDomainRecordFacet.sol";
import "./interfaces/ITldRecordFacet.sol";

abstract contract Facet is RegistryStorageFacet, AccessControl {
  bytes32 internal constant AT = keccak256(bytes("@"));
  uint256 public constant GRACE_PERIOD = 30 days;
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
  bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");
  bytes32 public constant ROOT_ROLE = keccak256("ROOT_ROLE");
  bytes32 public constant WRAPPER_ROLE = keccak256("WRAPPER_ROLE");
  bytes32 public constant BRIDGE_ROLE = keccak256("BRIDGE_ROLE");

  uint256 public constant MAX_LABEL_LENGTH = 128;
  uint256 public constant MIN_LABEL_LENGTH = 1;
  bytes internal constant DOT = bytes(".");

  ITldRecordFacet internal _TldRecordFacet = ITldRecordFacet(address(this));
  IDomainRecordFacet internal _DomainRecordFacet = IDomainRecordFacet(address(this));
  IHostRecordFacet internal _HostRecordFacet = IHostRecordFacet(address(this));

  function _isSelfExecution() internal view returns (bool) {
    return _msgSender() == address(this);
  }

  function _join(
    bytes memory host,
    bytes memory name,
    bytes memory tld
  ) internal pure returns (bytes memory) {
    return abi.encodePacked(host, DOT, name, DOT, tld);
  }

  function _join(bytes memory name, bytes memory tld) internal pure returns (bytes memory) {
    return abi.encodePacked(name, DOT, tld);
  }
}
