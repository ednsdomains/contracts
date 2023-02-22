// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "./ISynchronizer.sol";

interface ISynchronizerApplication {
  event IncomingSync(bool success, bytes ews);
  event OutgoingSync(bytes ews);
  event IncomingSyncError(bytes ews, bytes reason);
  event OutgoingSyncError(bytes ews, bytes reason);

  function receiveSync(bytes memory ews) external; // Incoming sync action

  function setSynchronizer(ISynchronizer synchronizer_) external;
}
