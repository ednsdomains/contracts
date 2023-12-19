// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "../../diamond/upgradeInitializers/DiamondInit.sol";
import "../../diamond/storage/facets/AccessControlStorageFacet.sol";
import "../facets/interfaces/ITldRecordFacet.sol";
import "../facets/interfaces/IDomainRecordFacet.sol";
import "../facets/interfaces/IHostRecordFacet.sol";
import "../facets/interfaces/IBaseRegistryFacet.sol";
import "@openzeppelin/contracts/access/IAccessControl.sol";

contract RegistryInit is DiamondInit, AccessControlStorageFacet {
  function init() external {
    _init();
    LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
    ds.supportedInterfaces[type(ITldRecordFacet).interfaceId] = true;
    ds.supportedInterfaces[type(IDomainRecordFacet).interfaceId] = true;
    ds.supportedInterfaces[type(IHostRecordFacet).interfaceId] = true;
    ds.supportedInterfaces[type(IBaseRegistryFacet).interfaceId] = true;
    ds.supportedInterfaces[type(IAccessControl).interfaceId] = true;

    AccessControlStorage storage _acds = accessControlStorage();
    _acds.roles[0x00].members[msg.sender] = true;
  }
}
