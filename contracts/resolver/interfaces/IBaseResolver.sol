// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "../../crosschain/interfaces/ISynchronizer.sol";
import "../../lib/CrossChainProvider.sol";

interface IBaseResolver {
  event IncomingSync(bool success, uint256 nonce, bytes ctx);
  event OutgoingSync(bytes ctx);

  function receiveSync(uint256 nonce, bytes memory ctx) external; // Incoming sync action

  function setSynchronizer(ISynchronizer synchronizer_) external;

  function getSynchronizerProvider() external view returns (CrossChainProvider.CrossChainProvider);

  function setSynchronizerProvider(CrossChainProvider.CrossChainProvider provider) external;
}
