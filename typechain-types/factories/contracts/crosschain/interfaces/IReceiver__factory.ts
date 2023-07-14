/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IReceiver,
  IReceiverInterface,
} from "../../../../contracts/crosschain/interfaces/IReceiver";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "payload",
        type: "bytes",
      },
    ],
    name: "receive_",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IReceiver__factory {
  static readonly abi = _abi;
  static createInterface(): IReceiverInterface {
    return new Interface(_abi) as IReceiverInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): IReceiver {
    return new Contract(address, _abi, runner) as unknown as IReceiver;
  }
}
