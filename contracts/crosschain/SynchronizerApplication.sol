// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "./interfaces/ISynchronizer.sol";
import "./interfaces/ISynchronizerApplication.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";

abstract contract SynchronizerApplication is ISynchronizerApplication, ContextUpgradeable {
  ISynchronizer internal _synchronizer;

  function _requestSync(
    SyncAction.SyncAction action,
    Chain.Chain[] memory dstChains,
    bytes memory ews
  ) internal virtual {
    CrossChainProvider.CrossChainProvider provider = _synchronizer.getUserDefaultProvider(_msgSender());
    try _synchronizer.sync(action, provider, dstChains, ews) {
      emit OutgoingSync(ews);
    } catch (bytes memory reason) {
      emit OutgoingSyncError(ews, reason);
    }
  }

  function receiveSync(bytes memory ews) external virtual {
    require(_msgSender() == address(_synchronizer), "ONLY_SYNCHRONIZER");
    (bool success, ) = address(this).call(ews);
    // if (!success) emit IncomingSyncError(ews);
    emit IncomingSync(success, ews);
  }

  function _setSynchronizer(ISynchronizer synchronizer_) internal {
    _synchronizer = synchronizer_;
  }
}
