// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./ILayerZeroReceiver.sol";
import "./ILayerZeroUserApplicationConfig.sol";

interface ILayerZeroApp is ILayerZeroReceiver, ILayerZeroUserApplicationConfig {}
