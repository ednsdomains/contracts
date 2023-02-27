// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "./interfaces/ISynchronizer.sol";
import "./interfaces/ISynchronizerApplication.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";

abstract contract SynchronizerApplication is ISynchronizerApplication, ContextUpgradeable {
  ISynchronizer internal _synchronizer;

  function _requestSync(
    address payable sender,
    SyncAction action,
    Chain[] memory dstChains,
    bytes memory ews
  ) internal virtual {
    CrossChainProvider provider = _synchronizer.getUserDefaultProvider(_msgSender());
    // require(msg.value >= _synchronizer.estimateSyncFee(action, provider, dstChains, ews), "INSUFFICIENT_FEE");
    try _synchronizer.sync{ value: msg.value }(sender, action, provider, dstChains, ews) {
      emit RequestSync(ews);
    } catch (bytes memory reason) {
      emit SyncError(ews, reason);
    }
  }

  function receiveSync(bytes memory ews) external virtual {
    require(_msgSender() == address(_synchronizer), "ONLY_SYNCHRONIZER");
    (bool success, ) = address(this).call(ews);
    emit ExecuteSync(success, ews);
  }

  function _setSynchronizer(ISynchronizer synchronizer_) internal {
    _synchronizer = synchronizer_;
  }
}
