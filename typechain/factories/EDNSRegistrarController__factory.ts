/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  EDNSRegistrarController,
  EDNSRegistrarControllerInterface,
} from "../EDNSRegistrarController";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: true,
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "label",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "expires",
        type: "uint256",
      },
    ],
    name: "NameRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: true,
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "label",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "expires",
        type: "uint256",
      },
    ],
    name: "NameRenewed",
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
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "tld",
        type: "string",
      },
    ],
    name: "available",
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
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getRoleMember",
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
    name: "getRoleMemberCount",
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
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "tld",
        type: "string",
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
        internalType: "contract BaseRegistrarImplementation",
        name: "_base",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "tld",
        type: "string",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "duration",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "resolver",
        type: "address",
      },
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "registerWithConfig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "tld",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "duration",
        type: "uint256",
      },
    ],
    name: "renew",
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
        internalType: "uint256",
        name: "minimum",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maximum",
        type: "uint256",
      },
    ],
    name: "setNameLengthLimit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "tld",
        type: "string",
      },
      {
        internalType: "bytes32",
        name: "nodehash",
        type: "bytes32",
      },
    ],
    name: "setTld",
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
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "tld",
        type: "string",
      },
    ],
    name: "tldAvailable",
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
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "tlds",
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
        internalType: "string",
        name: "name",
        type: "string",
      },
    ],
    name: "valid",
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
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506132cf806100206000396000f3fe608060405234801561001057600080fd5b506004361061012c5760003560e01c806391d14854116100ad578063c4d66de811610071578063c4d66de814610377578063ca15c87314610393578063d547741f146103c3578063e22023ae146103df578063f5b541a61461040f5761012c565b806391d14854146102ad5780639791c097146102dd578063a217fddf1461030d578063aae1a8181461032b578063bef3c3fa146103475761012c565b806336568abe116100f457806336568abe146101f95780633f31831314610215578063674c3d0b146102455780638a8cfc5f146102615780639010d07c1461027d5761012c565b806301ffc9a7146101315780630c3f3cfb146101615780631e2af40414610191578063248a9ca3146101ad5780632f2ff15d146101dd575b600080fd5b61014b60048036038101906101469190611ff3565b61042d565b604051610158919061203b565b60405180910390f35b61017b6004803603810190610176919061219c565b610521565b604051610188919061203b565b60405180910390f35b6101ab60048036038101906101a6919061224a565b610675565b005b6101c760048036038101906101c291906122c0565b6106f7565b6040516101d491906122fc565b60405180910390f35b6101f760048036038101906101f29190612375565b610717565b005b610213600480360381019061020e9190612375565b610740565b005b61022f600480360381019061022a91906123b5565b6107c3565b60405161023c919061203b565b60405180910390f35b61025f600480360381019061025a91906123fe565b61088b565b005b61027b600480360381019061027691906124c3565b610ec0565b005b6102976004803603810190610292919061251f565b610f57565b6040516102a4919061256e565b60405180910390f35b6102c760048036038101906102c29190612375565b610f86565b6040516102d4919061203b565b60405180910390f35b6102f760048036038101906102f291906123b5565b610ff1565b604051610304919061203b565b60405180910390f35b61031561101e565b60405161032291906122fc565b60405180910390f35b610345600480360381019061034091906125e9565b611025565b005b610361600480360381019061035c919061271f565b611284565b60405161036e91906122fc565b60405180910390f35b610391600480360381019061038c91906127a6565b6112b2565b005b6103ad60048036038101906103a891906122c0565b6113a0565b6040516103ba91906127e2565b60405180910390f35b6103dd60048036038101906103d89190612375565b6113c4565b005b6103f960048036038101906103f4919061219c565b6113ed565b60405161040691906127e2565b60405180910390f35b610417611452565b60405161042491906122fc565b60405180910390f35b60007f01ffc9a7a5cef8baa21ed3c5c0d7e23accb804b619e9333b597f47a0d84076e27bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916148061051a57507fca15c87324184fe11fcfd1b62f305b0106b501a357855ca24a74263983ccd6757f9010d07c35d39c6d4cd0e3e64f2d5224175be836ce7811540697d664e50bd5b0187bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b9050919050565b600061052c826107c3565b61056b576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105629061285a565b60405180910390fd5b600060c98360405161057d91906128f4565b9081526020016040518091039020549050600084826040516020016105a3929190612973565b6040516020818303038152906040528051906020012090506105c485610ff1565b801561066b575060cb60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166396e494e88260001c6040518263ffffffff1660e01b815260040161062991906127e2565b602060405180830381865afa158015610646573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061066a91906129c7565b5b9250505092915050565b6106a67f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b9296106a1611476565b610f86565b6106e5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106dc90612a40565b60405180910390fd5b8160cc819055508060cd819055505050565b600060656000838152602001908152602001600020600101549050919050565b610720826106f7565b6107318161072c611476565b61147e565b61073b838361151b565b505050565b610748611476565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16146107b5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107ac90612ad2565b60405180910390fd5b6107bf828261154f565b5050565b60008060c9836040516107d691906128f4565b908152602001604051809103902054905060cb60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166345a009ad826040518263ffffffff1660e01b815260040161084291906122fc565b602060405180830381865afa15801561085f573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061088391906129c7565b915050919050565b6108bc7f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b9296108b7611476565b610f86565b6108fb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108f290612a40565b60405180910390fd5b610904856107c3565b610943576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161093a9061285a565b60405180910390fd5b600060c98660405161095591906128f4565b90815260200160405180910390205490506000878260405160200161097b929190612973565b60405160208183030381529060405280519060200120905060008160001c905060008073ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff1614610d6d5760cb60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166304a3718a8386308b6040518563ffffffff1660e01b8152600401610a319493929190612af2565b6020604051808303816000875af1158015610a50573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a749190612b4c565b90506000848360001b604051602001610a8e929190612b79565b60405160208183030381529060405280519060200120905060cb60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663bf36cf3c6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610b13573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b379190612be3565b73ffffffffffffffffffffffffffffffffffffffff16631896f70a82896040518363ffffffff1660e01b8152600401610b71929190612c10565b600060405180830381600087803b158015610b8b57600080fd5b505af1158015610b9f573d6000803e3d6000fd5b50505050600073ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff1614610c45578673ffffffffffffffffffffffffffffffffffffffff1663d5fa2b0082886040518363ffffffff1660e01b8152600401610c12929190612c10565b600060405180830381600087803b158015610c2c57600080fd5b505af1158015610c40573d6000803e3d6000fd5b505050505b60cb60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a8dac63e84878c6040518463ffffffff1660e01b8152600401610ca493929190612c39565b600060405180830381600087803b158015610cbe57600080fd5b505af1158015610cd2573d6000803e3d6000fd5b5050505060cb60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd308b866040518463ffffffff1660e01b8152600401610d3593929190612c70565b600060405180830381600087803b158015610d4f57600080fd5b505af1158015610d63573d6000803e3d6000fd5b5050505050610e4d565b600073ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff1614610da657600080fd5b60cb60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166304a3718a83868b8b6040518563ffffffff1660e01b8152600401610e079493929190612af2565b6020604051808303816000875af1158015610e26573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e4a9190612b4c565b90505b8773ffffffffffffffffffffffffffffffffffffffff16838a604051610e7391906128f4565b60405180910390207f5d6c8f6ba5f9841ab4d56c538217961eb1b827c180f0746b16ee0148a5d107f58d85604051610eac929190612ce0565b60405180910390a450505050505050505050565b610ef17f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929610eec611476565b610f86565b610f30576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f2790612a40565b60405180910390fd5b8060c983604051610f4191906128f4565b9081526020016040518091039020819055505050565b6000610f7e826097600086815260200190815260200160002061158390919063ffffffff16565b905092915050565b60006065600084815260200190815260200160002060000160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b600060cc54610fff8361159d565b10158015611017575060cd546110148361159d565b11155b9050919050565b6000801b81565b6110567f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929611051611476565b610f86565b611095576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161108c90612a40565b60405180910390fd5b6110e283838080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050506107c3565b611121576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016111189061285a565b60405180910390fd5b600060c98484604051611135929190612d35565b908152602001604051809103902054905060008686868660405160200161115f9493929190612d73565b60405160208183030381529060405280519060200120905060008160001c9050600060cb60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16639fa0f3a08386886040518463ffffffff1660e01b81526004016111e093929190612d9b565b6020604051808303816000875af11580156111ff573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906112239190612b4c565b9050828787604051611236929190612d35565b60405180910390207fc608d2a8d1be507bc5c1c2e01401f2235e8afdbc4d1b7cda0bfbe9f6ceecea368b8b8560405161127193929190612dff565b60405180910390a3505050505050505050565b60c9818051602081018201805184825260208301602085012081835280955050505050506000915090505481565b600060019054906101000a900460ff166112da5760008054906101000a900460ff16156112e3565b6112e2611752565b5b611322576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161131990612ea3565b60405180910390fd5b60008060019054906101000a900460ff161590508015611372576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b61137b82611763565b801561139c5760008060016101000a81548160ff0219169083151502179055505b5050565b60006113bd609760008481526020019081526020016000206117c6565b9050919050565b6113cd826106f7565b6113de816113d9611476565b61147e565b6113e8838361154f565b505050565b60008060c98360405161140091906128f4565b908152602001604051809103902054905060008482604051602001611426929190612973565b60405160208183030381529060405280519060200120905060008160001c905080935050505092915050565b7f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b92981565b600033905090565b6114888282610f86565b611517576114ad8173ffffffffffffffffffffffffffffffffffffffff1660146117db565b6114bb8360001c60206117db565b6040516020016114cc929190612f5b565b6040516020818303038152906040526040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161150e9190612f95565b60405180910390fd5b5050565b6115258282611a17565b61154a8160976000858152602001908152602001600020611af890919063ffffffff16565b505050565b6115598282611b28565b61157e8160976000858152602001908152602001600020611c0a90919063ffffffff16565b505050565b60006115928360000183611c3a565b60001c905092915050565b60008060008084519050600092505b808210156117475760008583815181106115c9576115c8612fb7565b5b602001015160f81c60f81b9050608060f81b817effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161015611618576001836116119190613015565b9250611733565b60e060f81b817effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916101561165a576002836116539190613015565b9250611732565b60f060f81b817effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916101561169c576003836116959190613015565b9250611731565b60f8801b817effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191610156116dd576004836116d69190613015565b9250611730565b60fc60f81b817effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916101561171f576005836117189190613015565b925061172f565b60068361172c9190613015565b92505b5b5b5b5b50828061173f9061306b565b9350506115ac565b829350505050919050565b600061175d30611c65565b15905090565b600060019054906101000a900460ff166117b2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016117a990613126565b60405180910390fd5b6117bb81611c88565b6117c3611d70565b50565b60006117d482600001611dc1565b9050919050565b6060600060028360026117ee9190613146565b6117f89190613015565b67ffffffffffffffff81111561181157611810612071565b5b6040519080825280601f01601f1916602001820160405280156118435781602001600182028036833780820191505090505b5090507f30000000000000000000000000000000000000000000000000000000000000008160008151811061187b5761187a612fb7565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053507f7800000000000000000000000000000000000000000000000000000000000000816001815181106118df576118de612fb7565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053506000600184600261191f9190613146565b6119299190613015565b90505b60018111156119c9577f3031323334353637383961626364656600000000000000000000000000000000600f86166010811061196b5761196a612fb7565b5b1a60f81b82828151811061198257611981612fb7565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350600485901c9450806119c2906131a0565b905061192c565b5060008414611a0d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611a0490613216565b60405180910390fd5b8091505092915050565b611a218282610f86565b611af45760016065600084815260200190815260200160002060000160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550611a99611476565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45b5050565b6000611b20836000018373ffffffffffffffffffffffffffffffffffffffff1660001b611dd2565b905092915050565b611b328282610f86565b15611c065760006065600084815260200190815260200160002060000160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550611bab611476565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16837ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b60405160405180910390a45b5050565b6000611c32836000018373ffffffffffffffffffffffffffffffffffffffff1660001b611e42565b905092915050565b6000826000018281548110611c5257611c51612fb7565b5b9060005260206000200154905092915050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b600060019054906101000a900460ff16611cd7576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611cce90613126565b60405180910390fd5b8060cb60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550611d2c6000801b611d27611476565b611f56565b611d5d7f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929611d58611476565b611f56565b600560cc81905550608060cd8190555050565b600060019054906101000a900460ff16611dbf576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611db690613126565b60405180910390fd5b565b600081600001805490509050919050565b6000611dde8383611f64565b611e37578260000182908060018154018082558091505060019003906000526020600020016000909190919091505582600001805490508360010160008481526020019081526020016000208190555060019050611e3c565b600090505b92915050565b60008083600101600084815260200190815260200160002054905060008114611f4a576000600182611e749190613236565b9050600060018660000180549050611e8c9190613236565b9050818114611efb576000866000018281548110611ead57611eac612fb7565b5b9060005260206000200154905080876000018481548110611ed157611ed0612fb7565b5b90600052602060002001819055508387600101600083815260200190815260200160002081905550505b85600001805480611f0f57611f0e61326a565b5b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050611f50565b60009150505b92915050565b611f60828261151b565b5050565b600080836001016000848152602001908152602001600020541415905092915050565b6000604051905090565b600080fd5b600080fd5b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b611fd081611f9b565b8114611fdb57600080fd5b50565b600081359050611fed81611fc7565b92915050565b60006020828403121561200957612008611f91565b5b600061201784828501611fde565b91505092915050565b60008115159050919050565b61203581612020565b82525050565b6000602082019050612050600083018461202c565b92915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6120a982612060565b810181811067ffffffffffffffff821117156120c8576120c7612071565b5b80604052505050565b60006120db611f87565b90506120e782826120a0565b919050565b600067ffffffffffffffff82111561210757612106612071565b5b61211082612060565b9050602081019050919050565b82818337600083830152505050565b600061213f61213a846120ec565b6120d1565b90508281526020810184848401111561215b5761215a61205b565b5b61216684828561211d565b509392505050565b600082601f83011261218357612182612056565b5b813561219384826020860161212c565b91505092915050565b600080604083850312156121b3576121b2611f91565b5b600083013567ffffffffffffffff8111156121d1576121d0611f96565b5b6121dd8582860161216e565b925050602083013567ffffffffffffffff8111156121fe576121fd611f96565b5b61220a8582860161216e565b9150509250929050565b6000819050919050565b61222781612214565b811461223257600080fd5b50565b6000813590506122448161221e565b92915050565b6000806040838503121561226157612260611f91565b5b600061226f85828601612235565b925050602061228085828601612235565b9150509250929050565b6000819050919050565b61229d8161228a565b81146122a857600080fd5b50565b6000813590506122ba81612294565b92915050565b6000602082840312156122d6576122d5611f91565b5b60006122e4848285016122ab565b91505092915050565b6122f68161228a565b82525050565b600060208201905061231160008301846122ed565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061234282612317565b9050919050565b61235281612337565b811461235d57600080fd5b50565b60008135905061236f81612349565b92915050565b6000806040838503121561238c5761238b611f91565b5b600061239a858286016122ab565b92505060206123ab85828601612360565b9150509250929050565b6000602082840312156123cb576123ca611f91565b5b600082013567ffffffffffffffff8111156123e9576123e8611f96565b5b6123f58482850161216e565b91505092915050565b60008060008060008060c0878903121561241b5761241a611f91565b5b600087013567ffffffffffffffff81111561243957612438611f96565b5b61244589828a0161216e565b965050602087013567ffffffffffffffff81111561246657612465611f96565b5b61247289828a0161216e565b955050604061248389828a01612360565b945050606061249489828a01612235565b93505060806124a589828a01612360565b92505060a06124b689828a01612360565b9150509295509295509295565b600080604083850312156124da576124d9611f91565b5b600083013567ffffffffffffffff8111156124f8576124f7611f96565b5b6125048582860161216e565b9250506020612515858286016122ab565b9150509250929050565b6000806040838503121561253657612535611f91565b5b6000612544858286016122ab565b925050602061255585828601612235565b9150509250929050565b61256881612337565b82525050565b6000602082019050612583600083018461255f565b92915050565b600080fd5b600080fd5b60008083601f8401126125a9576125a8612056565b5b8235905067ffffffffffffffff8111156125c6576125c5612589565b5b6020830191508360018202830111156125e2576125e161258e565b5b9250929050565b60008060008060006060868803121561260557612604611f91565b5b600086013567ffffffffffffffff81111561262357612622611f96565b5b61262f88828901612593565b9550955050602086013567ffffffffffffffff81111561265257612651611f96565b5b61265e88828901612593565b9350935050604061267188828901612235565b9150509295509295909350565b600067ffffffffffffffff82111561269957612698612071565b5b6126a282612060565b9050602081019050919050565b60006126c26126bd8461267e565b6120d1565b9050828152602081018484840111156126de576126dd61205b565b5b6126e984828561211d565b509392505050565b600082601f83011261270657612705612056565b5b81356127168482602086016126af565b91505092915050565b60006020828403121561273557612734611f91565b5b600082013567ffffffffffffffff81111561275357612752611f96565b5b61275f848285016126f1565b91505092915050565b600061277382612337565b9050919050565b61278381612768565b811461278e57600080fd5b50565b6000813590506127a08161277a565b92915050565b6000602082840312156127bc576127bb611f91565b5b60006127ca84828501612791565b91505092915050565b6127dc81612214565b82525050565b60006020820190506127f760008301846127d3565b92915050565b600082825260208201905092915050565b7f544c44206e6f7420617661696c61626c65000000000000000000000000000000600082015250565b60006128446011836127fd565b915061284f8261280e565b602082019050919050565b6000602082019050818103600083015261287381612837565b9050919050565b600081519050919050565b600081905092915050565b60005b838110156128ae578082015181840152602081019050612893565b838111156128bd576000848401525b50505050565b60006128ce8261287a565b6128d88185612885565b93506128e8818560208601612890565b80840191505092915050565b600061290082846128c3565b915081905092915050565b600081519050919050565b600081905092915050565b600061292c8261290b565b6129368185612916565b9350612946818560208601612890565b80840191505092915050565b6000819050919050565b61296d6129688261228a565b612952565b82525050565b600061297f8285612921565b915061298b828461295c565b6020820191508190509392505050565b6129a481612020565b81146129af57600080fd5b50565b6000815190506129c18161299b565b92915050565b6000602082840312156129dd576129dc611f91565b5b60006129eb848285016129b2565b91505092915050565b7f466f7262696464656e2061636365737300000000000000000000000000000000600082015250565b6000612a2a6010836127fd565b9150612a35826129f4565b602082019050919050565b60006020820190508181036000830152612a5981612a1d565b9050919050565b7f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560008201527f20726f6c657320666f722073656c660000000000000000000000000000000000602082015250565b6000612abc602f836127fd565b9150612ac782612a60565b604082019050919050565b60006020820190508181036000830152612aeb81612aaf565b9050919050565b6000608082019050612b0760008301876127d3565b612b1460208301866122ed565b612b21604083018561255f565b612b2e60608301846127d3565b95945050505050565b600081519050612b468161221e565b92915050565b600060208284031215612b6257612b61611f91565b5b6000612b7084828501612b37565b91505092915050565b6000612b85828561295c565b602082019150612b95828461295c565b6020820191508190509392505050565b6000612bb082612337565b9050919050565b612bc081612ba5565b8114612bcb57600080fd5b50565b600081519050612bdd81612bb7565b92915050565b600060208284031215612bf957612bf8611f91565b5b6000612c0784828501612bce565b91505092915050565b6000604082019050612c2560008301856122ed565b612c32602083018461255f565b9392505050565b6000606082019050612c4e60008301866127d3565b612c5b60208301856122ed565b612c68604083018461255f565b949350505050565b6000606082019050612c85600083018661255f565b612c92602083018561255f565b612c9f60408301846127d3565b949350505050565b6000612cb28261290b565b612cbc81856127fd565b9350612ccc818560208601612890565b612cd581612060565b840191505092915050565b60006040820190508181036000830152612cfa8185612ca7565b9050612d0960208301846127d3565b9392505050565b6000612d1c8385612885565b9350612d2983858461211d565b82840190509392505050565b6000612d42828486612d10565b91508190509392505050565b6000612d5a8385612916565b9350612d6783858461211d565b82840190509392505050565b6000612d80828688612d4e565b9150612d8d828486612d4e565b915081905095945050505050565b6000606082019050612db060008301866127d3565b612dbd60208301856122ed565b612dca60408301846127d3565b949350505050565b6000612dde83856127fd565b9350612deb83858461211d565b612df483612060565b840190509392505050565b60006040820190508181036000830152612e1a818587612dd2565b9050612e2960208301846127d3565b949350505050565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b6000612e8d602e836127fd565b9150612e9882612e31565b604082019050919050565b60006020820190508181036000830152612ebc81612e80565b9050919050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000600082015250565b6000612ef9601783612916565b9150612f0482612ec3565b601782019050919050565b7f206973206d697373696e6720726f6c6520000000000000000000000000000000600082015250565b6000612f45601183612916565b9150612f5082612f0f565b601182019050919050565b6000612f6682612eec565b9150612f728285612921565b9150612f7d82612f38565b9150612f898284612921565b91508190509392505050565b60006020820190508181036000830152612faf8184612ca7565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061302082612214565b915061302b83612214565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156130605761305f612fe6565b5b828201905092915050565b600061307682612214565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8214156130a9576130a8612fe6565b5b600182019050919050565b7f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960008201527f6e697469616c697a696e67000000000000000000000000000000000000000000602082015250565b6000613110602b836127fd565b915061311b826130b4565b604082019050919050565b6000602082019050818103600083015261313f81613103565b9050919050565b600061315182612214565b915061315c83612214565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff048311821515161561319557613194612fe6565b5b828202905092915050565b60006131ab82612214565b915060008214156131bf576131be612fe6565b5b600182039050919050565b7f537472696e67733a20686578206c656e67746820696e73756666696369656e74600082015250565b60006132006020836127fd565b915061320b826131ca565b602082019050919050565b6000602082019050818103600083015261322f816131f3565b9050919050565b600061324182612214565b915061324c83612214565b92508282101561325f5761325e612fe6565b5b828203905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603160045260246000fdfea2646970667358221220afb4c8388e8122327255ad9570eb3e592ed8d588c9fc2701f3fdf657ec3201c464736f6c634300080a0033";

export class EDNSRegistrarController__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<EDNSRegistrarController> {
    return super.deploy(overrides || {}) as Promise<EDNSRegistrarController>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): EDNSRegistrarController {
    return super.attach(address) as EDNSRegistrarController;
  }
  connect(signer: Signer): EDNSRegistrarController__factory {
    return super.connect(signer) as EDNSRegistrarController__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): EDNSRegistrarControllerInterface {
    return new utils.Interface(_abi) as EDNSRegistrarControllerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): EDNSRegistrarController {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as EDNSRegistrarController;
  }
}