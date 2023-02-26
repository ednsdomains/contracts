// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "./ILayerZeroReceiver.sol";
import "./ILayerZeroUserApplicationConfig.sol";

interface ILayerZeroApp is ILayerZeroReceiver, ILayerZeroUserApplicationConfig {
  event SendError(string reason);
  event LowLevelError(bytes reason);
}
