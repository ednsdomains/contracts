// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "./interfaces/IBaseRegistryFacet.sol";
import "./Facet.sol";

contract BaseRegistryFacet is IBaseRegistryFacet, Facet {
  function getTokenRecord(uint256 tokenId_) public view returns (TokenRecord memory) {
    return registryStorage().tokenRecords[tokenId_];
  }

  function getGracePeriod() public pure returns (uint256) {
    return GRACE_PERIOD;
  }

  function setDefaultWrapper(address defaultWrapper) external onlyRole(OPERATOR_ROLE) {
    RegistryStorage storage _ds = registryStorage();
    _ds.defaultWrapper = defaultWrapper;
    emit SetDefaultWrapper(defaultWrapper);
  }
}
