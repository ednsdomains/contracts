// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct AppStorage {
  bytes32 AT;
  bytes32 GRACE_PERIOD;
  bytes32 ADMIN_ROLE;
  bytes32 OPERATOR_ROLE;
  bytes32 REGISTRAR_ROLE;
  bytes32 ROOT_ROLE;
  bytes32 WRAPPER_ROLE;
  bytes32 BRIDGE_ROLE;
  address defaultWrapper;
  address publicResolver;
}
