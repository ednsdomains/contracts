// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "./interfaces/IBaseRegistryFacet.sol";
import "./Facet.sol";
import "../../mortgage/interfaces/IMortgage.sol";

contract BaseRegistryFacet is IBaseRegistryFacet, Facet {
  IMortgage internal _mortgage;

  function getTokenRecord(uint256 tokenId_) public view returns (TokenRecord memory) {
    return registryStorage().tokenRecords[tokenId_];
  }

  function getGracePeriod() public pure returns (uint256) {
    return GRACE_PERIOD;
  }

  function getDefaultWrapper() external view returns (address) {
    RegistryStorage storage _ds = registryStorage();
    return _ds.defaultWrapper;
  }

  function getPublicResolver() external view returns (address) {
    RegistryStorage storage _ds = registryStorage();
    return _ds.publicResolver;
  }

  function getMortgage() external view returns (address) {
    RegistryStorage storage _ds = registryStorage();
    return _ds.mortgage;
  }

  function setDefaultWrapper(address defaultWrapper) external onlyRole(OPERATOR_ROLE) {
    RegistryStorage storage _ds = registryStorage();
    _ds.defaultWrapper = defaultWrapper;
    emit SetDefaultWrapper(defaultWrapper);
  }

  function setPublicResolver(address publicResolver) external onlyRole(OPERATOR_ROLE) {
    RegistryStorage storage _ds = registryStorage();
    _ds.publicResolver = publicResolver;
    emit SetPublicResolver(publicResolver);
  }

  function setMortgage(address mortgage) external onlyRole(OPERATOR_ROLE) {
    RegistryStorage storage _ds = registryStorage();
    _ds.mortgage = mortgage;
    emit SetMortgage(mortgage);
  }
}
