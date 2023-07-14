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
  RegistryInit,
  RegistryInitInterface,
} from "../../../../contracts/registry/initilaizer/RegistryInit";

const _abi = [
  {
    inputs: [],
    name: "init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50610280806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063e1c7392a14610030575b600080fd5b61003861003a565b005b610042610150565b7fa3a92061b83d0426836e8eab3cba047f90aa27df40a30ab1427492dc9e3561908054600160ff1991821681179092557feb860428ec26f4fe01087089ee7051844d92d416f2d3ed224389c90643cd7e5280548216831790557f4495d8f9dfe441af34dbc45e9146c616dbdbf7568eee3056bf2a52458a4608f380548216831790557fe79e4f0d8669cbdb5a683c63ef620c3bb9cf950ac5f9cde85e1f4c89c01a7b7880548216831790557fb73005c118b5f4636fc5d5f3c35e7dd5bd9764a470c590de3a135a1bea2d226a80548216831790553360009081527ff31a9df2f3f8d6c73a0d00e70ef3aa1d0b11d0de90fd97e177398d19f466a5426020526040902080549091169091179055565b7fc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c1320547fc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c131c906001600160a01b031633146101dc5760405162461bcd60e51b815260206004820152600a60248201526927a7262cafa7aba722a960b11b604482015260640160405180910390fd5b6301ffc9a760e01b600090815260039091016020526040808220805460ff1990811660019081179092556307e4c70760e21b845282842080548216831790556348e2b09360e01b845282842080548216831790556307f5828d60e41b8452919092208054909116909117905556fea2646970667358221220c5d288048001ceac5e658f935a0af390e697c7e1516d8dd3b0467990032e45c764736f6c63430008110033";

type RegistryInitConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: RegistryInitConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class RegistryInit__factory extends ContractFactory {
  constructor(...args: RegistryInitConstructorParams) {
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
      RegistryInit & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): RegistryInit__factory {
    return super.connect(runner) as RegistryInit__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RegistryInitInterface {
    return new Interface(_abi) as RegistryInitInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): RegistryInit {
    return new Contract(address, _abi, runner) as unknown as RegistryInit;
  }
}
