/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../../common";

export declare namespace IDiamondCut {
  export type FacetCutStruct = {
    facetAddress: AddressLike;
    action: BigNumberish;
    functionSelectors: BytesLike[];
  };

  export type FacetCutStructOutput = [
    facetAddress: string,
    action: bigint,
    functionSelectors: string[]
  ] & { facetAddress: string; action: bigint; functionSelectors: string[] };
}

export interface DiamondCutFacetInterface extends Interface {
  getFunction(nameOrSignature: "diamondCut"): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "DiamondCut"): EventFragment;

  encodeFunctionData(
    functionFragment: "diamondCut",
    values: [IDiamondCut.FacetCutStruct[], AddressLike, BytesLike]
  ): string;

  decodeFunctionResult(functionFragment: "diamondCut", data: BytesLike): Result;
}

export namespace DiamondCutEvent {
  export type InputTuple = [
    _diamondCut: IDiamondCut.FacetCutStruct[],
    _init: AddressLike,
    _calldata: BytesLike
  ];
  export type OutputTuple = [
    _diamondCut: IDiamondCut.FacetCutStructOutput[],
    _init: string,
    _calldata: string
  ];
  export interface OutputObject {
    _diamondCut: IDiamondCut.FacetCutStructOutput[];
    _init: string;
    _calldata: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface DiamondCutFacet extends BaseContract {
  connect(runner?: ContractRunner | null): DiamondCutFacet;
  waitForDeployment(): Promise<this>;

  interface: DiamondCutFacetInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  diamondCut: TypedContractMethod<
    [
      _diamondCut: IDiamondCut.FacetCutStruct[],
      _init: AddressLike,
      _calldata: BytesLike
    ],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "diamondCut"
  ): TypedContractMethod<
    [
      _diamondCut: IDiamondCut.FacetCutStruct[],
      _init: AddressLike,
      _calldata: BytesLike
    ],
    [void],
    "nonpayable"
  >;

  getEvent(
    key: "DiamondCut"
  ): TypedContractEvent<
    DiamondCutEvent.InputTuple,
    DiamondCutEvent.OutputTuple,
    DiamondCutEvent.OutputObject
  >;

  filters: {
    "DiamondCut(tuple[],address,bytes)": TypedContractEvent<
      DiamondCutEvent.InputTuple,
      DiamondCutEvent.OutputTuple,
      DiamondCutEvent.OutputObject
    >;
    DiamondCut: TypedContractEvent<
      DiamondCutEvent.InputTuple,
      DiamondCutEvent.OutputTuple,
      DiamondCutEvent.OutputObject
    >;
  };
}
