/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  Synchronizer,
  SynchronizerInterface,
} from "../../../contracts/crosschain/Synchronizer";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "previousAdmin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "AdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "enum SyncAction",
        name: "action",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "ApplicationError",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "beacon",
        type: "address",
      },
    ],
    name: "BeaconUpgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "enum SyncAction",
        name: "action",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "address",
        name: "target",
        type: "address",
      },
    ],
    name: "IncomingSync",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "enum SyncAction",
        name: "action",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "enum CrossChainProvider",
        name: "provider",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "enum Chain[]",
        name: "dstChains",
        type: "uint8[]",
      },
    ],
    name: "OutgoingSync",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    inputs: [],
    name: "ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "OPERATOR_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "REQUESTOR_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum SyncAction",
        name: "action",
        type: "uint8",
      },
      {
        internalType: "enum CrossChainProvider",
        name: "provider",
        type: "uint8",
      },
      {
        internalType: "enum Chain[]",
        name: "dstChains",
        type: "uint8[]",
      },
      {
        internalType: "bytes",
        name: "ews",
        type: "bytes",
      },
    ],
    name: "estimateSyncFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum Chain",
        name: "chain",
        type: "uint8",
      },
    ],
    name: "getRemoteSynchronizer",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserDefaultProvider",
    outputs: [
      {
        internalType: "enum CrossChainProvider",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum Chain",
        name: "selfChain",
        type: "uint8",
      },
      {
        internalType: "contract IRegistrar",
        name: "registrar_",
        type: "address",
      },
      {
        internalType: "contract IPortal",
        name: "portal_",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "proxiableUUID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "ctx",
        type: "bytes",
      },
    ],
    name: "receive_",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum Chain",
        name: "chain",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
    ],
    name: "setRemoteSynchronizer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "enum CrossChainProvider",
        name: "provider",
        type: "uint8",
      },
    ],
    name: "setUserDefaultProvider",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "sender",
        type: "address",
      },
      {
        internalType: "enum SyncAction",
        name: "action",
        type: "uint8",
      },
      {
        internalType: "enum CrossChainProvider",
        name: "provider",
        type: "uint8",
      },
      {
        internalType: "enum Chain[]",
        name: "dstChains",
        type: "uint8[]",
      },
      {
        internalType: "bytes",
        name: "ews",
        type: "bytes",
      },
    ],
    name: "sync",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
    ],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60a06040523060805234801561001457600080fd5b5060805161234761004c6000396000818161058e015281816105ce0152818161068d015281816106cd015261075c01526123476000f3fe60806040526004361061014b5760003560e01c80638456cb59116100b6578063d547741f1161006f578063d547741f146103d3578063d8d2afed146103f3578063e79805d314610413578063f443fb3514610433578063f5b541a61461046b578063f672d1ca1461048d57600080fd5b80638456cb591461030257806391d1485414610317578063a217fddf14610337578063ac139ae81461034c578063b886bc8a1461036c578063c0f05d9c146103b357600080fd5b80633f4ba83a116101085780633f4ba83a146102595780634f1ef2861461026e57806352d1902d146102815780635c975abb146102965780636343049c146102ae57806375b238fc146102ce57600080fd5b806301ffc9a7146101505780630872175614610185578063248a9ca3146101c75780632f2ff15d146101f757806336568abe146102195780633659cfe614610239575b600080fd5b34801561015c57600080fd5b5061017061016b3660046118cc565b6104a0565b60405190151581526020015b60405180910390f35b34801561019157600080fd5b506101b97f867da4c29ecfdb38427343b065ec173ab06ef9e52a3ea804eb8430b7d0e9f51e81565b60405190815260200161017c565b3480156101d357600080fd5b506101b96101e23660046118f6565b600090815260c9602052604090206001015490565b34801561020357600080fd5b50610217610212366004611924565b6104d7565b005b34801561022557600080fd5b50610217610234366004611924565b610501565b34801561024557600080fd5b50610217610254366004611954565b610584565b34801561026557600080fd5b50610217610663565b61021761027c366004611a38565b610683565b34801561028d57600080fd5b506101b961074f565b3480156102a257600080fd5b5060fb5460ff16610170565b3480156102ba57600080fd5b506102176102c9366004611a88565b610803565b3480156102da57600080fd5b506101b97fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c2177581565b34801561030e57600080fd5b5061021761098b565b34801561032357600080fd5b50610170610332366004611924565b6109ab565b34801561034357600080fd5b506101b9600081565b34801561035857600080fd5b506101b9610367366004611b75565b6109d6565b34801561037857600080fd5b506103a6610387366004611954565b6001600160a01b03166000908152610131602052604090205460ff1690565b60405161017c9190611c26565b3480156103bf57600080fd5b506102176103ce366004611c34565b610b02565b3480156103df57600080fd5b506102176103ee366004611924565b610b85565b3480156103ff57600080fd5b5061021761040e366004611c69565b610baa565b34801561041f57600080fd5b5061021761042e366004611c95565b610c09565b34801561043f57600080fd5b5061045361044e366004611cde565b610d16565b6040516001600160a01b03909116815260200161017c565b34801561047757600080fd5b506101b96000805160206122cb83398151915281565b61021761049b366004611cf9565b610d60565b60006001600160e01b03198216637965db0b60e01b14806104d157506301ffc9a760e01b6001600160e01b03198316145b92915050565b600082815260c960205260409020600101546104f281610d9f565b6104fc8383610da9565b505050565b6001600160a01b03811633146105765760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b6105808282610e2f565b5050565b6001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001630036105cc5760405162461bcd60e51b815260040161056d90611d93565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166106156000805160206122ab833981519152546001600160a01b031690565b6001600160a01b03161461063b5760405162461bcd60e51b815260040161056d90611ddf565b61064481610e96565b6040805160008082526020820190925261066091839190610ec0565b50565b6000805160206122cb83398151915261067b81610d9f565b61066061102b565b6001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001630036106cb5760405162461bcd60e51b815260040161056d90611d93565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166107146000805160206122ab833981519152546001600160a01b031690565b6001600160a01b03161461073a5760405162461bcd60e51b815260040161056d90611ddf565b61074382610e96565b61058082826001610ec0565b6000306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146107ef5760405162461bcd60e51b815260206004820152603860248201527f555550535570677261646561626c653a206d757374206e6f742062652063616c60448201527f6c6564207468726f7567682064656c656761746563616c6c0000000000000000606482015260840161056d565b506000805160206122ab8339815191525b90565b60008061080f8361107d565b90925090506000600283600281111561082a5761082a611bfc565b03610847575061012d5461010090046001600160a01b031661086f565b600083600281111561085b5761085b611bfc565b0361086f575061012f546001600160a01b03165b6001600160a01b0381161561098557604051634b8b755d60e11b81526001600160a01b03821690639716eaba906108aa908590600401611e7b565b600060405180830381600087803b1580156108c457600080fd5b505af19250505080156108d5575060015b61094b576108e1611e8e565b806308c379a00361093f57506108f5611ea9565b806109005750610941565b7fbe24a3ce5d2640b6ef55cd1aa9f5d45e6e309718801eaab5841ab8618e1552808482604051610931929190611f43565b60405180910390a150610985565b505b3d6000803e3d6000fd5b7f3250cba2fc944640ef685d650a4d59a7fdbfa15d12000d89d55ee50f05fde41e838260405161097c929190611f63565b60405180910390a15b50505050565b6000805160206122cb8339815191526109a381610d9f565b61066061109e565b600091825260c9602090815260408084206001600160a01b0393909316845291905290205460ff1690565b600080805b8451811015610af65760008582815181106109f8576109f8611f89565b602090810291909101015161012d5490915060ff16600f811115610a1e57610a1e611bfc565b81600f811115610a3057610a30611bfc565b14610ae3576000610a4082610d16565b90506000610a4e8a886110db565b90506000610a5c8383611107565b61012e5460405163610b433760e11b81529192506001600160a01b03169063c216866e90610a929087908e908690600401611faf565b602060405180830381865afa158015610aaf573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ad39190611fe5565b610add9087612014565b95505050505b5080610aee81612027565b9150506109db565b5090505b949350505050565b6001600160a01b0382163314610b465760405162461bcd60e51b815260206004820152600960248201526827a7262cafa9a2a62360b91b604482015260640161056d565b6001600160a01b038216600090815261013160205260409020805482919060ff19166001836003811115610b7c57610b7c611bfc565b02179055505050565b600082815260c96020526040902060010154610ba081610d9f565b6104fc8383610e2f565b80610130600084600f811115610bc257610bc2611bfc565b600f811115610bd357610bd3611bfc565b815260200190815260200160002060006101000a8154816001600160a01b0302191690836001600160a01b031602179055505050565b600054610100900460ff1615808015610c295750600054600160ff909116105b80610c435750303b158015610c43575060005460ff166001145b610ca65760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b606482015260840161056d565b6000805460ff191660011790558015610cc9576000805461ff0019166101001790555b610cd484848461111c565b8015610985576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200161097c565b6000610130600083600f811115610d2f57610d2f611bfc565b600f811115610d4057610d40611bfc565b81526020810191909152604001600020546001600160a01b031692915050565b7f867da4c29ecfdb38427343b065ec173ab06ef9e52a3ea804eb8430b7d0e9f51e610d8a81610d9f565b610d97868686868661114e565b505050505050565b6106608133611315565b610db382826109ab565b61058057600082815260c9602090815260408083206001600160a01b03851684529091529020805460ff19166001179055610deb3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b610e3982826109ab565b1561058057600082815260c9602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b7fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c2177561058081610d9f565b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd91435460ff1615610ef3576104fc8361136e565b826001600160a01b03166352d1902d6040518163ffffffff1660e01b8152600401602060405180830381865afa925050508015610f4d575060408051601f3d908101601f19168201909252610f4a91810190611fe5565b60015b610fb05760405162461bcd60e51b815260206004820152602e60248201527f45524331393637557067726164653a206e657720696d706c656d656e7461746960448201526d6f6e206973206e6f74205555505360901b606482015260840161056d565b6000805160206122ab833981519152811461101f5760405162461bcd60e51b815260206004820152602960248201527f45524331393637557067726164653a20756e737570706f727465642070726f786044820152681a58589b195555525160ba1b606482015260840161056d565b506104fc83838361140a565b61103361142f565b60fb805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b60006060828060200190518101906110959190612040565b91509150915091565b6110a661147a565b60fb805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a2586110603390565b606082826040516020016110f0929190611f43565b604051602081830303815290604052905092915050565b606082826040516020016110f09291906120d8565b600054610100900460ff166111435760405162461bcd60e51b815260040161056d906120fc565b6104fc8383836114c0565b600061115a85836110db565b905060005b83518110156112d157600084828151811061117c5761117c611f89565b602090810291909101015161012d5490915060ff16600f8111156111a2576111a2611bfc565b81600f8111156111b4576111b4611bfc565b146112be5760006111c482610d16565b905060006111d28286611107565b61012e5460405163610b433760e11b81529192506000916001600160a01b039091169063c216866e9061120d9087908d908790600401611faf565b602060405180830381865afa15801561122a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061124e9190611fe5565b61012e54604051630967312560e21b81529192506001600160a01b03169063259cc494908390611288908f9089908f908990600401612147565b6000604051808303818588803b1580156112a157600080fd5b505af11580156112b5573d6000803e3d6000fd5b50505050505050505b50806112c981612027565b91505061115f565b507ffbd254fbcd9e38f270e54c028f677f1d0fa18a31f015390290a7b4cede875f4e85858560405161130593929190612183565b60405180910390a1505050505050565b61131f82826109ab565b6105805761132c816115a1565b6113378360206115b3565b6040516020016113489291906121eb565b60408051601f198184030181529082905262461bcd60e51b825261056d91600401611e7b565b6001600160a01b0381163b6113db5760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b606482015260840161056d565b6000805160206122ab83398151915280546001600160a01b0319166001600160a01b0392909216919091179055565b61141383611756565b6000825111806114205750805b156104fc576109858383611796565b60fb5460ff166114785760405162461bcd60e51b815260206004820152601460248201527314185d5cd8589b194e881b9bdd081c185d5cd95960621b604482015260640161056d565b565b60fb5460ff16156114785760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b604482015260640161056d565b600054610100900460ff166114e75760405162461bcd60e51b815260040161056d906120fc565b61012d8054610100600160a81b031981166101006001600160a01b0386811691909102918217845561012e80546001600160a01b0319169186169190911790558592916001600160a81b03191660ff1990911617600183600f81111561154f5761154f611bfc565b021790555061155f600033610da9565b6115897fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c2177533610da9565b6104fc6000805160206122cb83398151915233610da9565b60606104d16001600160a01b03831660145b606060006115c2836002612260565b6115cd906002612014565b67ffffffffffffffff8111156115e5576115e5611971565b6040519080825280601f01601f19166020018201604052801561160f576020820181803683370190505b509050600360fc1b8160008151811061162a5761162a611f89565b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811061165957611659611f89565b60200101906001600160f81b031916908160001a905350600061167d846002612260565b611688906001612014565b90505b6001811115611700576f181899199a1a9b1b9c1cb0b131b232b360811b85600f16601081106116bc576116bc611f89565b1a60f81b8282815181106116d2576116d2611f89565b60200101906001600160f81b031916908160001a90535060049490941c936116f981612277565b905061168b565b50831561174f5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e74604482015260640161056d565b9392505050565b61175f8161136e565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b606061174f83836040518060600160405280602781526020016122eb602791396060600080856001600160a01b0316856040516117d3919061228e565b600060405180830381855af49150503d806000811461180e576040519150601f19603f3d011682016040523d82523d6000602084013e611813565b606091505b50915091506118248683838761182e565b9695505050505050565b6060831561189d578251600003611896576001600160a01b0385163b6118965760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604482015260640161056d565b5081610afa565b610afa83838151156118b25781518083602001fd5b8060405162461bcd60e51b815260040161056d9190611e7b565b6000602082840312156118de57600080fd5b81356001600160e01b03198116811461174f57600080fd5b60006020828403121561190857600080fd5b5035919050565b6001600160a01b038116811461066057600080fd5b6000806040838503121561193757600080fd5b8235915060208301356119498161190f565b809150509250929050565b60006020828403121561196657600080fd5b813561174f8161190f565b634e487b7160e01b600052604160045260246000fd5b601f8201601f1916810167ffffffffffffffff811182821017156119ad576119ad611971565b6040525050565b600067ffffffffffffffff8211156119ce576119ce611971565b50601f01601f191660200190565b600082601f8301126119ed57600080fd5b81356119f8816119b4565b604051611a058282611987565b828152856020848701011115611a1a57600080fd5b82602086016020830137600092810160200192909252509392505050565b60008060408385031215611a4b57600080fd5b8235611a568161190f565b9150602083013567ffffffffffffffff811115611a7257600080fd5b611a7e858286016119dc565b9150509250929050565b600060208284031215611a9a57600080fd5b813567ffffffffffffffff811115611ab157600080fd5b610afa848285016119dc565b6003811061066057600080fd5b803560048110611ad957600080fd5b919050565b803560108110611ad957600080fd5b600082601f830112611afe57600080fd5b8135602067ffffffffffffffff821115611b1a57611b1a611971565b8160051b604051611b2d83830182611987565b92835284810182019282810187851115611b4657600080fd5b83870192505b84831015611b6a57611b5d83611ade565b8152918301918301611b4c565b509695505050505050565b60008060008060808587031215611b8b57600080fd5b8435611b9681611abd565b9350611ba460208601611aca565b9250604085013567ffffffffffffffff80821115611bc157600080fd5b611bcd88838901611aed565b93506060870135915080821115611be357600080fd5b50611bf0878288016119dc565b91505092959194509250565b634e487b7160e01b600052602160045260246000fd5b60048110611c2257611c22611bfc565b9052565b602081016104d18284611c12565b60008060408385031215611c4757600080fd5b8235611c528161190f565b9150611c6060208401611aca565b90509250929050565b60008060408385031215611c7c57600080fd5b611c8583611ade565b915060208301356119498161190f565b600080600060608486031215611caa57600080fd5b611cb384611ade565b92506020840135611cc38161190f565b91506040840135611cd38161190f565b809150509250925092565b600060208284031215611cf057600080fd5b61174f82611ade565b600080600080600060a08688031215611d1157600080fd5b8535611d1c8161190f565b94506020860135611d2c81611abd565b9350611d3a60408701611aca565b9250606086013567ffffffffffffffff80821115611d5757600080fd5b611d6389838a01611aed565b93506080880135915080821115611d7957600080fd5b50611d86888289016119dc565b9150509295509295909350565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b19195b1959d85d1958d85b1b60a21b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b6163746976652070726f787960a01b606082015260800190565b60005b83811015611e46578181015183820152602001611e2e565b50506000910152565b60008151808452611e67816020860160208601611e2b565b601f01601f19169290920160200192915050565b60208152600061174f6020830184611e4f565b600060033d11156108005760046000803e5060005160e01c90565b600060443d1015611eb75790565b6040516003193d81016004833e81513d67ffffffffffffffff8160248401118184111715611ee757505050505090565b8285019150815181811115611eff5750505050505090565b843d8701016020828501011115611f195750505050505090565b611f2860208286010187611987565b509095945050505050565b60038110611c2257611c22611bfc565b611f4d8184611f33565b604060208201526000610afa6040830184611e4f565b60408101611f718285611f33565b6001600160a01b039290921660209190910152919050565b634e487b7160e01b600052603260045260246000fd5b60108110611c2257611c22611bfc565b611fb98185611f9f565b611fc66020820184611c12565b606060408201526000611fdc6060830184611e4f565b95945050505050565b600060208284031215611ff757600080fd5b5051919050565b634e487b7160e01b600052601160045260246000fd5b808201808211156104d1576104d1611ffe565b60006001820161203957612039611ffe565b5060010190565b6000806040838503121561205357600080fd5b825161205e81611abd565b602084015190925067ffffffffffffffff81111561207b57600080fd5b8301601f8101851361208c57600080fd5b8051612097816119b4565b6040516120a48282611987565b8281528760208486010111156120b957600080fd5b6120ca836020830160208701611e2b565b809450505050509250929050565b6001600160a01b0383168152604060208201819052600090610afa90830184611e4f565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b6001600160a01b03851681526121606020820185611f9f565b61216d6040820184611c12565b6080606082015260006118246080830184611e4f565b6000606082016121938387611f33565b60206121a181850187611c12565b6060604085015284519182905280850191608085019060005b818110156121dd576121cd838651611f9f565b93830193918301916001016121ba565b509098975050505050505050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351612223816017850160208801611e2b565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351612254816028840160208801611e2b565b01602801949350505050565b80820281158282048414176104d1576104d1611ffe565b60008161228657612286611ffe565b506000190190565b600082516122a0818460208701611e2b565b919091019291505056fe360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a2646970667358221220310eceaa0d6c18932d930c5cede27185dbf88cc523bc48c01edd5cf531da8f7a64736f6c63430008110033";

type SynchronizerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SynchronizerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Synchronizer__factory extends ContractFactory {
  constructor(...args: SynchronizerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      Synchronizer & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): Synchronizer__factory {
    return super.connect(runner) as Synchronizer__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SynchronizerInterface {
    return new Interface(_abi) as SynchronizerInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): Synchronizer {
    return new Contract(address, _abi, runner) as unknown as Synchronizer;
  }
}
