// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.13;

library SyncAction {
  enum SyncAction {
    RESOLVER_RECORD,
    REGISTER_DOMAIN,
    RENEW_DOMAIN
  }
}
