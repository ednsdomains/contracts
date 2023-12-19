// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;
import "../diamond/Diamond.sol";

contract Registry is Diamond {
  constructor(address _contractOwner, address _diamondCutFacet) payable Diamond(_contractOwner, _diamondCutFacet) {}
}
