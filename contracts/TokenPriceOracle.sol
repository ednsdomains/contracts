//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

// https://docs.chain.link/docs/existing-job-request/

contract TokenPriceOracle is ChainlinkClient, ConfirmedOwner {
  using Chainlink for Chainlink.Request;
}
