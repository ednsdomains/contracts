// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "../facets/interfaces/ITldRecordFacet.sol";
import "../facets/interfaces/IDomainRecordFacet.sol";
import "../facets/interfaces/IHostRecordFacet.sol";
import "../facets/interfaces/IBaseRegistryFacet.sol";
import "../facets/Facet.sol";
import "@openzeppelin/contracts/access/IAccessControl.sol";

abstract contract IRegistry is ITldRecordFacet, IDomainRecordFacet, IHostRecordFacet, IBaseRegistryFacet, IAccessControl, Facet {}
