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
import type { NonPayableOverrides } from "../../../../common";
import type {
  DomainRecordFacet,
  DomainRecordFacetInterface,
} from "../../../../contracts/registry/facets/DomainRecordFacet";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "enum Chain",
        name: "dstChain",
        type: "uint8",
      },
    ],
    name: "DomainBridged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "expiry",
        type: "uint64",
      },
    ],
    name: "NewDomain",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
    ],
    name: "RemoveDomain",
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
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "expiry",
        type: "uint64",
      },
    ],
    name: "SetDomainExpiry",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "SetDomainOperator",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "SetDomainOwner",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newResolver",
        type: "address",
      },
    ],
    name: "SetDomainResolver",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newUser",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "expiry",
        type: "uint64",
      },
    ],
    name: "SetDomainUser",
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
    name: "BRIDGE_ROLE",
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
    name: "REGISTRAR_ROLE",
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
    name: "ROOT_ROLE",
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
    name: "WRAPPER_ROLE",
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
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
    ],
    name: "bridge",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
    ],
    name: "getExpiry",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
    ],
    name: "getOwner",
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
        name: "name",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
    ],
    name: "getResolver",
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
        internalType: "bytes",
        name: "name_",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
    ],
    name: "getTokenId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
    ],
    name: "getUser",
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
        name: "name",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
    ],
    name: "getUserExpiry",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
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
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
    ],
    name: "isExists",
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
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
    ],
    name: "isLive",
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
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_operator",
        type: "address",
      },
    ],
    name: "isOperator",
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
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
      {
        internalType: "uint64",
        name: "expiry",
        type: "uint64",
      },
    ],
    name: "setExpiry",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "operator_",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setOperator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "setOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "resolver",
        type: "address",
      },
      {
        internalType: "uint64",
        name: "expiry",
        type: "uint64",
      },
    ],
    name: "setRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "resolver_",
        type: "address",
      },
    ],
    name: "setResolver",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint64",
        name: "expiry",
        type: "uint64",
      },
    ],
    name: "setUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceID",
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
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b5061254e806100206000396000f3fe608060405234801561001057600080fd5b50600436106101ce5760003560e01c80637e8c7f0811610104578063d3e120fb116100a2578063ed40e23711610071578063ed40e23714610448578063f5b541a61461045b578063f68e955314610482578063fc199b46146104a957600080fd5b8063d3e120fb146103fc578063d547741f1461040f578063d8c6608314610422578063df5164b51461043557600080fd5b8063a217fddf116100de578063a217fddf146103a7578063a566e2e3146103af578063b5bfddea146103c2578063c39aee52146103e957600080fd5b80637e8c7f081461035a57806381805c491461038157806391d148541461039457600080fd5b80632f8928f9116101715780634b7c78ed1161014b5780634b7c78ed146102fa5780634d844e151461030d578063569cd5951461032057806375b238fc1461033357600080fd5b80632f8928f91461029557806336568abe146102c057806341ce7248146102d357600080fd5b8063248a9ca3116101ad578063248a9ca3146102235780632492191a1461024457806326c086d6146102575780632f2ff15d1461028257600080fd5b8062f6c286146101d357806301ffc9a7146101e8578063057c66b614610210575b600080fd5b6101e66101e1366004611ddc565b6104bc565b005b6101fb6101f6366004611e11565b61063d565b60405190151581526020015b60405180910390f35b6101e661021e366004611e52565b610668565b610236610231366004611e98565b6108cf565b604051908152602001610207565b6101fb610252366004611eb1565b6108f1565b61026a610265366004611eb1565b610939565b6040516001600160a01b039091168152602001610207565b6101e6610290366004611ed3565b6109ba565b6102a86102a3366004611eb1565b6109db565b6040516001600160401b039091168152602001610207565b6101e66102ce366004611ed3565b610a1a565b6102367f44674c7a3dadbc647cc1c715644fb9e12bedb87e49073fca9375f19f3840275181565b6101e6610308366004611eb1565b610a98565b6101fb61031b366004611eb1565b610b48565b6101e661032e366004611eff565b610b89565b6102367fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c2177581565b6102367f79e553c6f53701daa99614646285e66adb98ff0fcc1ef165dd2718e5c873bee681565b6101e661038f366004611f39565b610d0b565b6101fb6103a2366004611ed3565b610eac565b610236600081565b6101e66103bd366004612023565b610ee4565b6102367f52ba824bfabc2bcfcdf7f0edbb486ebb05e1836c90e78047efeb949990f72e5f81565b6102a86103f7366004611eb1565b6113ca565b6101fb61040a366004611eff565b611409565b6101e661041d366004611ed3565b611477565b61026a610430366004611eb1565b611493565b61026a610443366004611eb1565b611518565b6102366104563660046120b8565b611550565b6102367f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b92981565b6102367fedcc084d3dcd65a1f7f23c65c46722faca6953d28e43150a467cf43e5c30923881565b6101e66104b7366004611eff565b61156b565b7fedcc084d3dcd65a1f7f23c65c46722faca6953d28e43150a467cf43e5c3092386104e6816116e9565b83836104f282826108f1565b6105175760405162461bcd60e51b815260040161050e9061211b565b60405180910390fd5b60006105216116f6565b600087815260018201602090815260408083208b84526006019091529020600201549091506001600160401b03600160a01b9091048116908616118015610570575042856001600160401b0316115b6105ad5760405162461bcd60e51b815260206004820152600e60248201526d494e56414c49445f45585049525960901b604482015260640161050e565b600086815260018201602090815260408083208a845260060182529182902060020180546001600160401b038916600160a01b810267ffffffffffffffff60a01b199092169190911790915582518a81529182018990528183015290517f0a52816545453da3791a4603707b7e35eb80231b48e74f68ed5b90e5a91db24e9181900360600190a150505050505050565b60006001600160e01b03198216631699bf4b60e21b148061066257506106628261171a565b92915050565b826106716116f6565b6000828152600191909101602052604090206004015461010090046001600160a01b0316336001600160a01b031614806106aa57503033145b6106ee5760405162461bcd60e51b815260206004820152601560248201527427a7262cafa7aba722a92fa7a92faba920a82822a960591b604482015260640161050e565b84846106fa82826108f1565b6107165760405162461bcd60e51b815260040161050e9061211b565b60006107206116f6565b600088815260018201602090815260408083208c8452600601909152812060030180546001600160a01b0319166001600160a01b038a161790559091506001600160401b03861690036107c75761077788886113ca565b600088815260018301602090815260408083208c8452600601909152902060030180546001600160401b0392909216600160a01b0267ffffffffffffffff60a01b19909216919091179055610869565b6107d188886113ca565b6001600160401b0316856001600160401b031611156108245760405162461bcd60e51b815260206004820152600f60248201526e4558504952595f4f564552464c4f5760881b604482015260640161050e565b600087815260018201602090815260408083208b84526006019091529020600301805467ffffffffffffffff60a01b1916600160a01b6001600160401b038816021790555b60408051898152602081018990526001600160a01b038816918101919091526001600160401b03861660608201527f7c8862c2833f7231bd3a0456e7625c9367b8cbd7b392f8399ad888fe24c9e097906080015b60405180910390a15050505050505050565b60009081526000805160206124f9833981519152602052604090206001015490565b6000426108fc6116f6565b600084815260019190910160209081526040808320878452600601909152902060020154600160a01b90046001600160401b031611905092915050565b60006109458383610b48565b6109845760405162461bcd60e51b815260206004820152601060248201526f1113d350525397d393d517d193d5539160821b604482015260640161050e565b61098c6116f6565b600092835260010160209081526040808420948452600690940190525020600201546001600160a01b031690565b6109c3826108cf565b6109cc816116e9565b6109d6838361174f565b505050565b60006109e56116f6565b60009283526001016020908152604080842094845260069094019052502060030154600160a01b90046001600160401b031690565b6001600160a01b0381163314610a8a5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b606482015260840161050e565b610a9482826117c7565b5050565b7f52ba824bfabc2bcfcdf7f0edbb486ebb05e1836c90e78047efeb949990f72e5f610ac2816116e9565b6000610acc6116f6565b6000848152600382016020908152604080832088845290915290205490915015610b385760405162461bcd60e51b815260206004820152601760248201527f554e53594e435f484f53545f555345525f455849535453000000000000000000604482015260640161050e565b610b42848461183d565b50505050565b600080610b536116f6565b60008481526001919091016020908152604080832087845260060190915290208054610b7e90612143565b905011905092915050565b8282610b936116f6565b6000828152600191820160209081526040808320868452600601909152902001546001600160a01b0316336001600160a01b03161480610c065750610bd66116f6565b6000828152600191909101602052604090206004015461010090046001600160a01b0316336001600160a01b0316145b80610c1057503033145b610c545760405162461bcd60e51b815260206004820152601560248201527427a7262cafa7aba722a92fa7a92faba920a82822a960591b604482015260640161050e565b610c5e8585610b48565b610c7a5760405162461bcd60e51b815260040161050e9061217d565b6000610c846116f6565b60008681526001828101602090815260408084208b855260060182529283902090910180546001600160a01b0389166001600160a01b0319909116811790915582518a81529182018990528183015290519192507f8446bdc488972dc509498311eb9e9fc119f8bd94e9b447fdea7261b91951c34f919081900360600190a1505050505050565b8383610d156116f6565b6000828152600191909101602090815260408083208584526006019091529020600301546001600160a01b0316336001600160a01b03161480610d5757503033145b610d965760405162461bcd60e51b815260206004820152601060248201526f27a7262cafa227a6a0a4a72faaa9a2a960811b604482015260640161050e565b8585610da282826108f1565b610dbe5760405162461bcd60e51b815260040161050e9061211b565b610dc88888610b48565b610de45760405162461bcd60e51b815260040161050e9061217d565b6000610dee6116f6565b600089815260018201602090815260408083208d84526006019091528120919250879160040190610e1f8c8c611493565b6001600160a01b03908116825260208083019390935260409182016000908120918c16808252918452829020805460ff19169415159490941790935580518c81529182018b905281019190915286151560608201527f307991f37ae5ccb80f3348fc68ba9de5f63ed21bcc81033c3bcb3c202ec8e37b9060800160405180910390a1505050505050505050565b60009182526000805160206124f9833981519152602090815260408084206001600160a01b0393909316845291905290205460ff1690565b610f0e7fedcc084d3dcd65a1f7f23c65c46722faca6953d28e43150a467cf43e5c30923833610eac565b80610f3e5750610f3e7f52ba824bfabc2bcfcdf7f0edbb486ebb05e1836c90e78047efeb949990f72e5f33610eac565b610f7c5760405162461bcd60e51b815260206004820152600f60248201526e13d3931657d055551213d492569151608a1b604482015260640161050e565b6001600160a01b038316610fc45760405162461bcd60e51b815260206004820152600f60248201526e2aa72222a324a722a22fa7aba722a960891b604482015260640161050e565b835160208501206040516345440f0760e11b815260048101919091523090638a881e0e90602401602060405180830381865afa158015611008573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061102c91906121a7565b6110685760405162461bcd60e51b815260206004820152600d60248201526c15131117d393d517d1561254d5609a1b604482015260640161050e565b60006110726116f6565b90506001600160a01b0383166110ad57845160208087019190912060009081526001830190915260409020600301546001600160a01b031692505b60006110b98787611550565b8651602080890191909120600090815260018501909152604090206004015490915060ff161561122457855160208088019190912060009081526001840190915260409081902060049081015491516340c10f1960e01b81526001600160a01b03888116928201929092526024810184905261010090920416906340c10f1990604401600060405180830381600087803b15801561115657600080fd5b505af115801561116a573d6000803e3d6000fd5b5050505061118687805190602001208780519060200120610b48565b15611224576111a38780519060200120878051906020012061183d565b85516020808801919091206000908152600184019091526040908190206004908101549151630852cd8d60e31b81529081018390526101009091046001600160a01b0316906342966c6890602401600060405180830381600087803b15801561120b57600080fd5b505af115801561121f573d6000803e3d6000fd5b505050505b8551602080880191909120600090815260018401825260408082208a518b850120835260060190925220806112598982612212565b506001810180546001600160a01b0319166001600160a01b038881169182179092556002830180549288166001600160e01b031993841617600160a01b6001600160401b03891690810291821790925560408051808201825284815260200192909252600385018054909416909217909117909155517ffec669d7d28d10192fb6bf56f26b979340cdd1b1b88c46cee4f4f90a3ce4b3f390611302908a908a908a908990612321565b60405180910390a16000828152600284810160209081526040909220805460ff1916600190811782558a518b850120908201558a51928b0192909220908201553060408051808201825260018152600160fe1b602082015290516337df421560e11b81526001600160a01b039290921691636fbe842a9161138d918d908d90610e1090600401612371565b600060405180830381600087803b1580156113a757600080fd5b505af11580156113bb573d6000803e3d6000fd5b50505050505050505050505050565b60006113d46116f6565b60009283526001016020908152604080842094845260069094019052502060020154600160a01b90046001600160401b031690565b60006114136116f6565b6000848152600191909101602090815260408083208784526006019091528120600401906114418686611493565b6001600160a01b039081168252602080830193909352604091820160009081209186168152925290205460ff1690509392505050565b611480826108cf565b611489816116e9565b6109d683836117c7565b600061149f8383610b48565b6114de5760405162461bcd60e51b815260206004820152601060248201526f1113d350525397d393d517d193d5539160821b604482015260640161050e565b6114e66116f6565b6000838152600191820160209081526040808320878452600601909152902001546001600160a01b0316905092915050565b60006115226116f6565b600092835260010160209081526040808420948452600690940190525020600301546001600160a01b031690565b600061155c8383611b1e565b80516020909101209392505050565b82826115756116f6565b6000828152600191909101602090815260408083208584526006019091529020600301546001600160a01b0316336001600160a01b031614806115be57506115be828233611409565b806115c857503033145b6116145760405162461bcd60e51b815260206004820152601c60248201527f4f4e4c595f444f4d41494e5f555345525f4f525f4f50455241544f5200000000604482015260640161050e565b848461162082826108f1565b61163c5760405162461bcd60e51b815260040161050e9061211b565b6116468787610b48565b6116625760405162461bcd60e51b815260040161050e9061217d565b600061166c6116f6565b600088815260018201602090815260408083208c845260060182529182902060020180546001600160a01b0319166001600160a01b038b1690811790915582518c81529182018b9052918101919091529091507fbb5130ccfb839dd076dcc45c7aea1b4280505de910e395999725ae09ca0ee533906060016108bd565b6116f38133611b65565b50565b7f049f9e3f78672c1b860bd7c751950a3fec682ab89bc0020d6603eef7c14a297090565b60006001600160e01b03198216637965db0b60e01b148061066257506301ffc9a760e01b6001600160e01b0319831614610662565b6117598282610eac565b610a945760008281526000805160206124f9833981519152602081815260408084206001600160a01b0386168086529252808420805460ff19166001179055519192339286917f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d91a4505050565b6117d18282610eac565b15610a945760008281526000805160206124f9833981519152602081815260408084206001600160a01b0386168086529252808420805460ff19169055519192339286917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b91a4505050565b60006118476116f6565b600083815260018201602052604090206004015490915060ff1615611a2357600082815260018201602090815260408083206004810154878552600690910190925290912080546101009092046001600160a01b0316916342966c68916119d2916118b190612143565b80601f01602080910402602001604051908101604052809291908181526020018280546118dd90612143565b801561192a5780601f106118ff5761010080835404028352916020019161192a565b820191906000526020600020905b81548152906001019060200180831161190d57829003601f168201915b50505060008881526001808901602052604090912001805490925061194f9150612143565b80601f016020809104026020016040519081016040528092919081815260200182805461197b90612143565b80156119c85780601f1061199d576101008083540402835291602001916119c8565b820191906000526020600020905b8154815290600101906020018083116119ab57829003601f168201915b5050505050611550565b6040518263ffffffff1660e01b81526004016119f091815260200190565b600060405180830381600087803b158015611a0a57600080fd5b505af1158015611a1e573d6000803e3d6000fd5b505050505b60008281526001820160209081526040808320868452600601909152812090611a4c8282611d72565b50600181810180546001600160a01b0319169055600280830180546001600160e01b0319908116909155600390930180549093169092556000848152908301602090815260408083208784526006019091528120805492840192611ab491906118b190612143565b815260208082019290925260409081016000908120805460ff1916815560018101829055600281018290556003015580518581529182018490527f2d44400d7cb306be76a6e31cd875f5fd3195da73bb2107fcd5117fa2dbfbf907910160405180910390a1505050565b606082604051806040016040528060018152602001601760f91b81525083604051602001611b4e939291906123c0565b604051602081830303815290604052905092915050565b611b6f8282610eac565b610a9457611b7c81611bbe565b611b87836020611bd0565b604051602001611b98929190612403565b60408051601f198184030181529082905262461bcd60e51b825261050e91600401612478565b60606106626001600160a01b03831660145b60606000611bdf8360026124a1565b611bea9060026124b8565b6001600160401b03811115611c0157611c01611f81565b6040519080825280601f01601f191660200182016040528015611c2b576020820181803683370190505b509050600360fc1b81600081518110611c4657611c466124cb565b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110611c7557611c756124cb565b60200101906001600160f81b031916908160001a9053506000611c998460026124a1565b611ca49060016124b8565b90505b6001811115611d1c576f181899199a1a9b1b9c1cb0b131b232b360811b85600f1660108110611cd857611cd86124cb565b1a60f81b828281518110611cee57611cee6124cb565b60200101906001600160f81b031916908160001a90535060049490941c93611d15816124e1565b9050611ca7565b508315611d6b5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e74604482015260640161050e565b9392505050565b508054611d7e90612143565b6000825580601f10611d8e575050565b601f0160209004906000526020600020908101906116f391905b80821115611dbc5760008155600101611da8565b5090565b80356001600160401b0381168114611dd757600080fd5b919050565b600080600060608486031215611df157600080fd5b8335925060208401359150611e0860408501611dc0565b90509250925092565b600060208284031215611e2357600080fd5b81356001600160e01b031981168114611d6b57600080fd5b80356001600160a01b0381168114611dd757600080fd5b60008060008060808587031215611e6857600080fd5b8435935060208501359250611e7f60408601611e3b565b9150611e8d60608601611dc0565b905092959194509250565b600060208284031215611eaa57600080fd5b5035919050565b60008060408385031215611ec457600080fd5b50508035926020909101359150565b60008060408385031215611ee657600080fd5b82359150611ef660208401611e3b565b90509250929050565b600080600060608486031215611f1457600080fd5b8335925060208401359150611e0860408501611e3b565b80151581146116f357600080fd5b60008060008060808587031215611f4f57600080fd5b8435935060208501359250611f6660408601611e3b565b91506060850135611f7681611f2b565b939692955090935050565b634e487b7160e01b600052604160045260246000fd5b600082601f830112611fa857600080fd5b81356001600160401b0380821115611fc257611fc2611f81565b604051601f8301601f19908116603f01168101908282118183101715611fea57611fea611f81565b8160405283815286602085880101111561200357600080fd5b836020870160208301376000602085830101528094505050505092915050565b600080600080600060a0868803121561203b57600080fd5b85356001600160401b038082111561205257600080fd5b61205e89838a01611f97565b9650602088013591508082111561207457600080fd5b5061208188828901611f97565b94505061209060408701611e3b565b925061209e60608701611e3b565b91506120ac60808701611dc0565b90509295509295909350565b600080604083850312156120cb57600080fd5b82356001600160401b03808211156120e257600080fd5b6120ee86838701611f97565b9350602085013591508082111561210457600080fd5b5061211185828601611f97565b9150509250929050565b6020808252600e908201526d1113d350525397d156141254915160921b604082015260600190565b600181811c9082168061215757607f821691505b60208210810361217757634e487b7160e01b600052602260045260246000fd5b50919050565b60208082526010908201526f1113d350525397d393d517d1561254d560821b604082015260600190565b6000602082840312156121b957600080fd5b8151611d6b81611f2b565b601f8211156109d657600081815260208120601f850160051c810160208610156121eb5750805b601f850160051c820191505b8181101561220a578281556001016121f7565b505050505050565b81516001600160401b0381111561222b5761222b611f81565b61223f816122398454612143565b846121c4565b602080601f831160018114612274576000841561225c5750858301515b600019600386901b1c1916600185901b17855561220a565b600085815260208120601f198616915b828110156122a357888601518255948401946001909101908401612284565b50858210156122c15787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b60005b838110156122ec5781810151838201526020016122d4565b50506000910152565b6000815180845261230d8160208601602086016122d1565b601f01601f19169290920160200192915050565b60808152600061233460808301876122f5565b828103602084015261234681876122f5565b6001600160a01b0395909516604084015250506001600160401b039190911660609091015292915050565b60808152600061238460808301876122f5565b828103602084015261239681876122f5565b905082810360408401526123aa81866122f5565b91505061ffff8316606083015295945050505050565b600084516123d28184602089016122d1565b8451908301906123e68183602089016122d1565b84519101906123f98183602088016122d1565b0195945050505050565b7f416363657373436f6e74726f6c3a206163636f756e742000000000000000000081526000835161243b8160178501602088016122d1565b7001034b99036b4b9b9b4b733903937b6329607d1b601791840191820152835161246c8160288401602088016122d1565b01602801949350505050565b602081526000611d6b60208301846122f5565b634e487b7160e01b600052601160045260246000fd5b80820281158282048414176106625761066261248b565b808201808211156106625761066261248b565b634e487b7160e01b600052603260045260246000fd5b6000816124f0576124f061248b565b50600019019056fec3a369eaae51a36ca665b72685e38c37da69c4bb3f6f2e1b44c0313ced23e2c6a2646970667358221220d33328da71a1a6a2d54a436d3c12399ba87b8e5958a3b7aee49373d3189a106464736f6c63430008110033";

type DomainRecordFacetConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DomainRecordFacetConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DomainRecordFacet__factory extends ContractFactory {
  constructor(...args: DomainRecordFacetConstructorParams) {
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
      DomainRecordFacet & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): DomainRecordFacet__factory {
    return super.connect(runner) as DomainRecordFacet__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DomainRecordFacetInterface {
    return new Interface(_abi) as DomainRecordFacetInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): DomainRecordFacet {
    return new Contract(address, _abi, runner) as unknown as DomainRecordFacet;
  }
}
