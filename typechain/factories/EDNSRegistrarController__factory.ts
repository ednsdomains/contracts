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
  "0x608060405234801561001057600080fd5b50613421806100206000396000f3fe608060405234801561001057600080fd5b506004361061012c5760003560e01c806391d14854116100ad578063c4d66de811610071578063c4d66de814610377578063ca15c87314610393578063d547741f146103c3578063e22023ae146103df578063f5b541a61461040f5761012c565b806391d14854146102ad5780639791c097146102dd578063a217fddf1461030d578063aae1a8181461032b578063bef3c3fa146103475761012c565b806336568abe116100f457806336568abe146101f95780633f31831314610215578063674c3d0b146102455780638a8cfc5f146102615780639010d07c1461027d5761012c565b806301ffc9a7146101315780630c3f3cfb146101615780631e2af40414610191578063248a9ca3146101ad5780632f2ff15d146101dd575b600080fd5b61014b60048036038101906101469190612015565b61042d565b604051610158919061205d565b60405180910390f35b61017b600480360381019061017691906121be565b610521565b604051610188919061205d565b60405180910390f35b6101ab60048036038101906101a6919061226c565b610675565b005b6101c760048036038101906101c291906122e2565b6106f7565b6040516101d4919061231e565b60405180910390f35b6101f760048036038101906101f29190612397565b610717565b005b610213600480360381019061020e9190612397565b610740565b005b61022f600480360381019061022a91906123d7565b6107c3565b60405161023c919061205d565b60405180910390f35b61025f600480360381019061025a9190612420565b61088b565b005b61027b600480360381019061027691906124e5565b610ee2565b005b61029760048036038101906102929190612541565b610f79565b6040516102a49190612590565b60405180910390f35b6102c760048036038101906102c29190612397565b610fa8565b6040516102d4919061205d565b60405180910390f35b6102f760048036038101906102f291906123d7565b611013565b604051610304919061205d565b60405180910390f35b610315611040565b604051610322919061231e565b60405180910390f35b6103456004803603810190610340919061260b565b611047565b005b610361600480360381019061035c9190612741565b6112a6565b60405161036e919061231e565b60405180910390f35b610391600480360381019061038c91906127c8565b6112d4565b005b6103ad60048036038101906103a891906122e2565b6113c2565b6040516103ba9190612804565b60405180910390f35b6103dd60048036038101906103d89190612397565b6113e6565b005b6103f960048036038101906103f491906121be565b61140f565b6040516104069190612804565b60405180910390f35b610417611474565b604051610424919061231e565b60405180910390f35b60007f01ffc9a7a5cef8baa21ed3c5c0d7e23accb804b619e9333b597f47a0d84076e27bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916148061051a57507fca15c87324184fe11fcfd1b62f305b0106b501a357855ca24a74263983ccd6757f9010d07c35d39c6d4cd0e3e64f2d5224175be836ce7811540697d664e50bd5b0187bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b9050919050565b600061052c826107c3565b61056b576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105629061287c565b60405180910390fd5b600060c98360405161057d9190612916565b9081526020016040518091039020549050600084826040516020016105a3929190612995565b6040516020818303038152906040528051906020012090506105c485611013565b801561066b575060cb60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166396e494e88260001c6040518263ffffffff1660e01b81526004016106299190612804565b602060405180830381865afa158015610646573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061066a91906129e9565b5b9250505092915050565b6106a67f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b9296106a1611498565b610fa8565b6106e5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106dc90612a62565b60405180910390fd5b8160cc819055508060cd819055505050565b600060656000838152602001908152602001600020600101549050919050565b610720826106f7565b6107318161072c611498565b6114a0565b61073b838361153d565b505050565b610748611498565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16146107b5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107ac90612af4565b60405180910390fd5b6107bf8282611571565b5050565b60008060c9836040516107d69190612916565b908152602001604051809103902054905060cb60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166345a009ad826040518263ffffffff1660e01b8152600401610842919061231e565b602060405180830381865afa15801561085f573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061088391906129e9565b915050919050565b6108bc7f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b9296108b7611498565b610fa8565b6108fb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108f290612a62565b60405180910390fd5b610904856107c3565b610943576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161093a9061287c565b60405180910390fd5b600060c9866040516109559190612916565b90815260200160405180910390205490506000878260405160200161097b929190612995565b60405160208183030381529060405280519060200120905060008160001c905060008073ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff1614610d8f5760cb60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166304a3718a8386308b6040518563ffffffff1660e01b8152600401610a319493929190612b14565b6020604051808303816000875af1158015610a50573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a749190612b6e565b90506000848360001b604051602001610a8e929190612b9b565b60405160208183030381529060405280519060200120905060cb60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663bf36cf3c6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610b13573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b379190612c05565b73ffffffffffffffffffffffffffffffffffffffff16631896f70a82896040518363ffffffff1660e01b8152600401610b71929190612c32565b600060405180830381600087803b158015610b8b57600080fd5b505af1158015610b9f573d6000803e3d6000fd5b50505050600073ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff1614610c67578673ffffffffffffffffffffffffffffffffffffffff16638b95dd7182603c89604051602001610c079190612ca3565b6040516020818303038152906040526040518463ffffffff1660e01b8152600401610c3493929190612d4d565b600060405180830381600087803b158015610c4e57600080fd5b505af1158015610c62573d6000803e3d6000fd5b505050505b60cb60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a8dac63e84878c6040518463ffffffff1660e01b8152600401610cc693929190612d8b565b600060405180830381600087803b158015610ce057600080fd5b505af1158015610cf4573d6000803e3d6000fd5b5050505060cb60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd308b866040518463ffffffff1660e01b8152600401610d5793929190612dc2565b600060405180830381600087803b158015610d7157600080fd5b505af1158015610d85573d6000803e3d6000fd5b5050505050610e6f565b600073ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff1614610dc857600080fd5b60cb60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166304a3718a83868b8b6040518563ffffffff1660e01b8152600401610e299493929190612b14565b6020604051808303816000875af1158015610e48573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e6c9190612b6e565b90505b8773ffffffffffffffffffffffffffffffffffffffff16838a604051610e959190612916565b60405180910390207f5d6c8f6ba5f9841ab4d56c538217961eb1b827c180f0746b16ee0148a5d107f58d85604051610ece929190612e32565b60405180910390a450505050505050505050565b610f137f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929610f0e611498565b610fa8565b610f52576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f4990612a62565b60405180910390fd5b8060c983604051610f639190612916565b9081526020016040518091039020819055505050565b6000610fa082609760008681526020019081526020016000206115a590919063ffffffff16565b905092915050565b60006065600084815260200190815260200160002060000160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b600060cc54611021836115bf565b10158015611039575060cd54611036836115bf565b11155b9050919050565b6000801b81565b6110787f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929611073611498565b610fa8565b6110b7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110ae90612a62565b60405180910390fd5b61110483838080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050506107c3565b611143576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161113a9061287c565b60405180910390fd5b600060c98484604051611157929190612e87565b90815260200160405180910390205490506000868686866040516020016111819493929190612ec5565b60405160208183030381529060405280519060200120905060008160001c9050600060cb60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16639fa0f3a08386886040518463ffffffff1660e01b815260040161120293929190612eed565b6020604051808303816000875af1158015611221573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906112459190612b6e565b9050828787604051611258929190612e87565b60405180910390207fc608d2a8d1be507bc5c1c2e01401f2235e8afdbc4d1b7cda0bfbe9f6ceecea368b8b8560405161129393929190612f51565b60405180910390a3505050505050505050565b60c9818051602081018201805184825260208301602085012081835280955050505050506000915090505481565b600060019054906101000a900460ff166112fc5760008054906101000a900460ff1615611305565b611304611774565b5b611344576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161133b90612ff5565b60405180910390fd5b60008060019054906101000a900460ff161590508015611394576001600060016101000a81548160ff02191690831515021790555060016000806101000a81548160ff0219169083151502179055505b61139d82611785565b80156113be5760008060016101000a81548160ff0219169083151502179055505b5050565b60006113df609760008481526020019081526020016000206117e8565b9050919050565b6113ef826106f7565b611400816113fb611498565b6114a0565b61140a8383611571565b505050565b60008060c9836040516114229190612916565b908152602001604051809103902054905060008482604051602001611448929190612995565b60405160208183030381529060405280519060200120905060008160001c905080935050505092915050565b7f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b92981565b600033905090565b6114aa8282610fa8565b611539576114cf8173ffffffffffffffffffffffffffffffffffffffff1660146117fd565b6114dd8360001c60206117fd565b6040516020016114ee9291906130ad565b6040516020818303038152906040526040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161153091906130e7565b60405180910390fd5b5050565b6115478282611a39565b61156c8160976000858152602001908152602001600020611b1a90919063ffffffff16565b505050565b61157b8282611b4a565b6115a08160976000858152602001908152602001600020611c2c90919063ffffffff16565b505050565b60006115b48360000183611c5c565b60001c905092915050565b60008060008084519050600092505b808210156117695760008583815181106115eb576115ea613109565b5b602001015160f81c60f81b9050608060f81b817effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916101561163a576001836116339190613167565b9250611755565b60e060f81b817effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916101561167c576002836116759190613167565b9250611754565b60f060f81b817effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191610156116be576003836116b79190613167565b9250611753565b60f8801b817effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191610156116ff576004836116f89190613167565b9250611752565b60fc60f81b817effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191610156117415760058361173a9190613167565b9250611751565b60068361174e9190613167565b92505b5b5b5b5b508280611761906131bd565b9350506115ce565b829350505050919050565b600061177f30611c87565b15905090565b600060019054906101000a900460ff166117d4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016117cb90613278565b60405180910390fd5b6117dd81611caa565b6117e5611d92565b50565b60006117f682600001611de3565b9050919050565b6060600060028360026118109190613298565b61181a9190613167565b67ffffffffffffffff81111561183357611832612093565b5b6040519080825280601f01601f1916602001820160405280156118655781602001600182028036833780820191505090505b5090507f30000000000000000000000000000000000000000000000000000000000000008160008151811061189d5761189c613109565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053507f78000000000000000000000000000000000000000000000000000000000000008160018151811061190157611900613109565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350600060018460026119419190613298565b61194b9190613167565b90505b60018111156119eb577f3031323334353637383961626364656600000000000000000000000000000000600f86166010811061198d5761198c613109565b5b1a60f81b8282815181106119a4576119a3613109565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350600485901c9450806119e4906132f2565b905061194e565b5060008414611a2f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611a2690613368565b60405180910390fd5b8091505092915050565b611a438282610fa8565b611b165760016065600084815260200190815260200160002060000160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550611abb611498565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45b5050565b6000611b42836000018373ffffffffffffffffffffffffffffffffffffffff1660001b611df4565b905092915050565b611b548282610fa8565b15611c285760006065600084815260200190815260200160002060000160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550611bcd611498565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16837ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b60405160405180910390a45b5050565b6000611c54836000018373ffffffffffffffffffffffffffffffffffffffff1660001b611e64565b905092915050565b6000826000018281548110611c7457611c73613109565b5b9060005260206000200154905092915050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b600060019054906101000a900460ff16611cf9576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611cf090613278565b60405180910390fd5b8060cb60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550611d4e6000801b611d49611498565b611f78565b611d7f7f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929611d7a611498565b611f78565b600560cc81905550608060cd8190555050565b600060019054906101000a900460ff16611de1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611dd890613278565b60405180910390fd5b565b600081600001805490509050919050565b6000611e008383611f86565b611e59578260000182908060018154018082558091505060019003906000526020600020016000909190919091505582600001805490508360010160008481526020019081526020016000208190555060019050611e5e565b600090505b92915050565b60008083600101600084815260200190815260200160002054905060008114611f6c576000600182611e969190613388565b9050600060018660000180549050611eae9190613388565b9050818114611f1d576000866000018281548110611ecf57611ece613109565b5b9060005260206000200154905080876000018481548110611ef357611ef2613109565b5b90600052602060002001819055508387600101600083815260200190815260200160002081905550505b85600001805480611f3157611f306133bc565b5b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050611f72565b60009150505b92915050565b611f82828261153d565b5050565b600080836001016000848152602001908152602001600020541415905092915050565b6000604051905090565b600080fd5b600080fd5b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b611ff281611fbd565b8114611ffd57600080fd5b50565b60008135905061200f81611fe9565b92915050565b60006020828403121561202b5761202a611fb3565b5b600061203984828501612000565b91505092915050565b60008115159050919050565b61205781612042565b82525050565b6000602082019050612072600083018461204e565b92915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6120cb82612082565b810181811067ffffffffffffffff821117156120ea576120e9612093565b5b80604052505050565b60006120fd611fa9565b905061210982826120c2565b919050565b600067ffffffffffffffff82111561212957612128612093565b5b61213282612082565b9050602081019050919050565b82818337600083830152505050565b600061216161215c8461210e565b6120f3565b90508281526020810184848401111561217d5761217c61207d565b5b61218884828561213f565b509392505050565b600082601f8301126121a5576121a4612078565b5b81356121b584826020860161214e565b91505092915050565b600080604083850312156121d5576121d4611fb3565b5b600083013567ffffffffffffffff8111156121f3576121f2611fb8565b5b6121ff85828601612190565b925050602083013567ffffffffffffffff8111156122205761221f611fb8565b5b61222c85828601612190565b9150509250929050565b6000819050919050565b61224981612236565b811461225457600080fd5b50565b60008135905061226681612240565b92915050565b6000806040838503121561228357612282611fb3565b5b600061229185828601612257565b92505060206122a285828601612257565b9150509250929050565b6000819050919050565b6122bf816122ac565b81146122ca57600080fd5b50565b6000813590506122dc816122b6565b92915050565b6000602082840312156122f8576122f7611fb3565b5b6000612306848285016122cd565b91505092915050565b612318816122ac565b82525050565b6000602082019050612333600083018461230f565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061236482612339565b9050919050565b61237481612359565b811461237f57600080fd5b50565b6000813590506123918161236b565b92915050565b600080604083850312156123ae576123ad611fb3565b5b60006123bc858286016122cd565b92505060206123cd85828601612382565b9150509250929050565b6000602082840312156123ed576123ec611fb3565b5b600082013567ffffffffffffffff81111561240b5761240a611fb8565b5b61241784828501612190565b91505092915050565b60008060008060008060c0878903121561243d5761243c611fb3565b5b600087013567ffffffffffffffff81111561245b5761245a611fb8565b5b61246789828a01612190565b965050602087013567ffffffffffffffff81111561248857612487611fb8565b5b61249489828a01612190565b95505060406124a589828a01612382565b94505060606124b689828a01612257565b93505060806124c789828a01612382565b92505060a06124d889828a01612382565b9150509295509295509295565b600080604083850312156124fc576124fb611fb3565b5b600083013567ffffffffffffffff81111561251a57612519611fb8565b5b61252685828601612190565b9250506020612537858286016122cd565b9150509250929050565b6000806040838503121561255857612557611fb3565b5b6000612566858286016122cd565b925050602061257785828601612257565b9150509250929050565b61258a81612359565b82525050565b60006020820190506125a56000830184612581565b92915050565b600080fd5b600080fd5b60008083601f8401126125cb576125ca612078565b5b8235905067ffffffffffffffff8111156125e8576125e76125ab565b5b602083019150836001820283011115612604576126036125b0565b5b9250929050565b60008060008060006060868803121561262757612626611fb3565b5b600086013567ffffffffffffffff81111561264557612644611fb8565b5b612651888289016125b5565b9550955050602086013567ffffffffffffffff81111561267457612673611fb8565b5b612680888289016125b5565b9350935050604061269388828901612257565b9150509295509295909350565b600067ffffffffffffffff8211156126bb576126ba612093565b5b6126c482612082565b9050602081019050919050565b60006126e46126df846126a0565b6120f3565b905082815260208101848484011115612700576126ff61207d565b5b61270b84828561213f565b509392505050565b600082601f83011261272857612727612078565b5b81356127388482602086016126d1565b91505092915050565b60006020828403121561275757612756611fb3565b5b600082013567ffffffffffffffff81111561277557612774611fb8565b5b61278184828501612713565b91505092915050565b600061279582612359565b9050919050565b6127a58161278a565b81146127b057600080fd5b50565b6000813590506127c28161279c565b92915050565b6000602082840312156127de576127dd611fb3565b5b60006127ec848285016127b3565b91505092915050565b6127fe81612236565b82525050565b600060208201905061281960008301846127f5565b92915050565b600082825260208201905092915050565b7f544c44206e6f7420617661696c61626c65000000000000000000000000000000600082015250565b600061286660118361281f565b915061287182612830565b602082019050919050565b6000602082019050818103600083015261289581612859565b9050919050565b600081519050919050565b600081905092915050565b60005b838110156128d05780820151818401526020810190506128b5565b838111156128df576000848401525b50505050565b60006128f08261289c565b6128fa81856128a7565b935061290a8185602086016128b2565b80840191505092915050565b600061292282846128e5565b915081905092915050565b600081519050919050565b600081905092915050565b600061294e8261292d565b6129588185612938565b93506129688185602086016128b2565b80840191505092915050565b6000819050919050565b61298f61298a826122ac565b612974565b82525050565b60006129a18285612943565b91506129ad828461297e565b6020820191508190509392505050565b6129c681612042565b81146129d157600080fd5b50565b6000815190506129e3816129bd565b92915050565b6000602082840312156129ff576129fe611fb3565b5b6000612a0d848285016129d4565b91505092915050565b7f466f7262696464656e2061636365737300000000000000000000000000000000600082015250565b6000612a4c60108361281f565b9150612a5782612a16565b602082019050919050565b60006020820190508181036000830152612a7b81612a3f565b9050919050565b7f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560008201527f20726f6c657320666f722073656c660000000000000000000000000000000000602082015250565b6000612ade602f8361281f565b9150612ae982612a82565b604082019050919050565b60006020820190508181036000830152612b0d81612ad1565b9050919050565b6000608082019050612b2960008301876127f5565b612b36602083018661230f565b612b436040830185612581565b612b5060608301846127f5565b95945050505050565b600081519050612b6881612240565b92915050565b600060208284031215612b8457612b83611fb3565b5b6000612b9284828501612b59565b91505092915050565b6000612ba7828561297e565b602082019150612bb7828461297e565b6020820191508190509392505050565b6000612bd282612359565b9050919050565b612be281612bc7565b8114612bed57600080fd5b50565b600081519050612bff81612bd9565b92915050565b600060208284031215612c1b57612c1a611fb3565b5b6000612c2984828501612bf0565b91505092915050565b6000604082019050612c47600083018561230f565b612c546020830184612581565b9392505050565b60008160601b9050919050565b6000612c7382612c5b565b9050919050565b6000612c8582612c68565b9050919050565b612c9d612c9882612359565b612c7a565b82525050565b6000612caf8284612c8c565b60148201915081905092915050565b6000819050919050565b6000819050919050565b6000612ced612ce8612ce384612cbe565b612cc8565b612236565b9050919050565b612cfd81612cd2565b82525050565b600082825260208201905092915050565b6000612d1f8261289c565b612d298185612d03565b9350612d398185602086016128b2565b612d4281612082565b840191505092915050565b6000606082019050612d62600083018661230f565b612d6f6020830185612cf4565b8181036040830152612d818184612d14565b9050949350505050565b6000606082019050612da060008301866127f5565b612dad602083018561230f565b612dba6040830184612581565b949350505050565b6000606082019050612dd76000830186612581565b612de46020830185612581565b612df160408301846127f5565b949350505050565b6000612e048261292d565b612e0e818561281f565b9350612e1e8185602086016128b2565b612e2781612082565b840191505092915050565b60006040820190508181036000830152612e4c8185612df9565b9050612e5b60208301846127f5565b9392505050565b6000612e6e83856128a7565b9350612e7b83858461213f565b82840190509392505050565b6000612e94828486612e62565b91508190509392505050565b6000612eac8385612938565b9350612eb983858461213f565b82840190509392505050565b6000612ed2828688612ea0565b9150612edf828486612ea0565b915081905095945050505050565b6000606082019050612f0260008301866127f5565b612f0f602083018561230f565b612f1c60408301846127f5565b949350505050565b6000612f30838561281f565b9350612f3d83858461213f565b612f4683612082565b840190509392505050565b60006040820190508181036000830152612f6c818587612f24565b9050612f7b60208301846127f5565b949350505050565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b6000612fdf602e8361281f565b9150612fea82612f83565b604082019050919050565b6000602082019050818103600083015261300e81612fd2565b9050919050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000600082015250565b600061304b601783612938565b915061305682613015565b601782019050919050565b7f206973206d697373696e6720726f6c6520000000000000000000000000000000600082015250565b6000613097601183612938565b91506130a282613061565b601182019050919050565b60006130b88261303e565b91506130c48285612943565b91506130cf8261308a565b91506130db8284612943565b91508190509392505050565b600060208201905081810360008301526131018184612df9565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061317282612236565b915061317d83612236565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156131b2576131b1613138565b5b828201905092915050565b60006131c882612236565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8214156131fb576131fa613138565b5b600182019050919050565b7f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960008201527f6e697469616c697a696e67000000000000000000000000000000000000000000602082015250565b6000613262602b8361281f565b915061326d82613206565b604082019050919050565b6000602082019050818103600083015261329181613255565b9050919050565b60006132a382612236565b91506132ae83612236565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04831182151516156132e7576132e6613138565b5b828202905092915050565b60006132fd82612236565b9150600082141561331157613310613138565b5b600182039050919050565b7f537472696e67733a20686578206c656e67746820696e73756666696369656e74600082015250565b600061335260208361281f565b915061335d8261331c565b602082019050919050565b6000602082019050818103600083015261338181613345565b9050919050565b600061339382612236565b915061339e83612236565b9250828210156133b1576133b0613138565b5b828203905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603160045260246000fdfea2646970667358221220844423ae23269cd38cc911c8ba8467a6d2d7d679adc99422d9613d43514e268564736f6c634300080a0033";

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