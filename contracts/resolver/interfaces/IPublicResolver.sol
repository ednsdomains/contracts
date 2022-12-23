// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../profile/interfaces/IAddressResolver.sol";
import "../profile/interfaces/IMultiCoinAddressResolver.sol";
import "../profile/interfaces/INFTResolver.sol";
import "../profile/interfaces/ITextResolver.sol";
import "../profile/interfaces/ITypedTextResolver.sol";

interface IPublicResolver is IAddressResolver, IMultiCoinAddressResolver, INFTResolver, ITextResolver, ITypedTextResolver {}
