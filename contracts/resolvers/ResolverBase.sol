// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./SupportsInterface.sol";

abstract contract ResolverBase is SupportsInterface {
    function isAuthorised(bytes32 node) public view virtual returns (bool);

    modifier authorised(bytes32 node) {
        require(isAuthorised(node), "Is not authorised");
        _;
    }
}
