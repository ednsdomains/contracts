// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../profile/interfaces/IAddressResolver.sol";
import "../profile/interfaces/INFTResolver.sol";

interface IPublicResolver is IAddressResolver, INFTResolver {}
