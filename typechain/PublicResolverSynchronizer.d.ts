/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface PublicResolverSynchronizerInterface extends ethers.utils.Interface {
  functions: {
    "ADMIN_ROLE()": FunctionFragment;
    "DEFAULT_ADMIN_ROLE()": FunctionFragment;
    "_reqExists(bytes32)": FunctionFragment;
    "estimateSyncFee(uint16[],bytes)": FunctionFragment;
    "failedMessages(uint16,bytes,uint64)": FunctionFragment;
    "forceResumeReceive(uint16,bytes)": FunctionFragment;
    "fulfill(bytes32,uint16)": FunctionFragment;
    "fulfill_SELF(uint16,bytes32)": FunctionFragment;
    "getConfig(uint16,uint16,address,uint256)": FunctionFragment;
    "getRoleAdmin(bytes32)": FunctionFragment;
    "grantRole(bytes32,address)": FunctionFragment;
    "hasRole(bytes32,address)": FunctionFragment;
    "initialize(address,uint16,uint16[])": FunctionFragment;
    "isTrustedRemote(uint16,bytes)": FunctionFragment;
    "lzChainId()": FunctionFragment;
    "lzEndpoint()": FunctionFragment;
    "lzReceive(uint16,bytes,uint64,bytes)": FunctionFragment;
    "owner()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "renounceRole(bytes32,address)": FunctionFragment;
    "revokeRole(bytes32,address)": FunctionFragment;
    "setConfig(uint16,uint16,uint256,bytes)": FunctionFragment;
    "setReceiveVersion(uint16)": FunctionFragment;
    "setResolver(address)": FunctionFragment;
    "setSendVersion(uint16)": FunctionFragment;
    "setTrustedRemote(uint16,bytes)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "sync(uint16[],bytes)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "trustedRemoteLookup(uint16)": FunctionFragment;
    "tryLzReceive(uint16,bytes,uint64,bytes)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "ADMIN_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "DEFAULT_ADMIN_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "_reqExists",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "estimateSyncFee",
    values: [BigNumberish[], BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "failedMessages",
    values: [BigNumberish, BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "forceResumeReceive",
    values: [BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "fulfill",
    values: [BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "fulfill_SELF",
    values: [BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getConfig",
    values: [BigNumberish, BigNumberish, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getRoleAdmin",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "grantRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "hasRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [string, BigNumberish, BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "isTrustedRemote",
    values: [BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "lzChainId", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "lzEndpoint",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "lzReceive",
    values: [BigNumberish, BytesLike, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "revokeRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "setConfig",
    values: [BigNumberish, BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setReceiveVersion",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "setResolver", values: [string]): string;
  encodeFunctionData(
    functionFragment: "setSendVersion",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setTrustedRemote",
    values: [BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "sync",
    values: [BigNumberish[], BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "trustedRemoteLookup",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "tryLzReceive",
    values: [BigNumberish, BytesLike, BigNumberish, BytesLike]
  ): string;

  decodeFunctionResult(functionFragment: "ADMIN_ROLE", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "DEFAULT_ADMIN_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "_reqExists", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "estimateSyncFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "failedMessages",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "forceResumeReceive",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "fulfill", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "fulfill_SELF",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getConfig", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getRoleAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "grantRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "hasRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isTrustedRemote",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "lzChainId", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "lzEndpoint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "lzReceive", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "revokeRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setConfig", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setReceiveVersion",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setResolver",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setSendVersion",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setTrustedRemote",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "sync", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "trustedRemoteLookup",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tryLzReceive",
    data: BytesLike
  ): Result;

  events: {
    "Callback(uint16,bytes32)": EventFragment;
    "Fulfilled(bytes32)": EventFragment;
    "MessageFailed(uint16,bytes,uint64,bytes)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "RoleAdminChanged(bytes32,bytes32,bytes32)": EventFragment;
    "RoleGranted(bytes32,address,address)": EventFragment;
    "RoleRevoked(bytes32,address,address)": EventFragment;
    "SetTarget(address)": EventFragment;
    "SetTrustedRemote(uint16,bytes)": EventFragment;
    "Synchronize(address,bytes32,uint64[])": EventFragment;
    "TransactionIn(uint16,address,uint64)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Callback"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Fulfilled"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "MessageFailed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleAdminChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleGranted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleRevoked"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetTarget"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetTrustedRemote"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Synchronize"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TransactionIn"): EventFragment;
}

export type CallbackEvent = TypedEvent<
  [number, string] & { dstChainId: number; reqId: string }
>;

export type FulfilledEvent = TypedEvent<[string] & { reqId: string }>;

export type MessageFailedEvent = TypedEvent<
  [number, string, BigNumber, string] & {
    _srcChainId: number;
    _srcAddress: string;
    _nonce: BigNumber;
    _payload: string;
  }
>;

export type OwnershipTransferredEvent = TypedEvent<
  [string, string] & { previousOwner: string; newOwner: string }
>;

export type RoleAdminChangedEvent = TypedEvent<
  [string, string, string] & {
    role: string;
    previousAdminRole: string;
    newAdminRole: string;
  }
>;

export type RoleGrantedEvent = TypedEvent<
  [string, string, string] & { role: string; account: string; sender: string }
>;

export type RoleRevokedEvent = TypedEvent<
  [string, string, string] & { role: string; account: string; sender: string }
>;

export type SetTargetEvent = TypedEvent<[string] & { target: string }>;

export type SetTrustedRemoteEvent = TypedEvent<
  [number, string] & { _srcChainId: number; _srcAddress: string }
>;

export type SynchronizeEvent = TypedEvent<
  [string, string, BigNumber[]] & {
    sender_: string;
    reqId: string;
    nonces: BigNumber[];
  }
>;

export type TransactionInEvent = TypedEvent<
  [number, string, BigNumber] & {
    srcChainId: number;
    srcAddress: string;
    nonce: BigNumber;
  }
>;

export class PublicResolverSynchronizer extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: PublicResolverSynchronizerInterface;

  functions: {
    ADMIN_ROLE(overrides?: CallOverrides): Promise<[string]>;

    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<[string]>;

    _reqExists(reqId: BytesLike, overrides?: CallOverrides): Promise<[boolean]>;

    estimateSyncFee(
      lzChainIds: BigNumberish[],
      payload: BytesLike,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    failedMessages(
      arg0: BigNumberish,
      arg1: BytesLike,
      arg2: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    forceResumeReceive(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    fulfill(
      reqId: BytesLike,
      chainId_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    fulfill_SELF(
      srcChainId: BigNumberish,
      reqId: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getConfig(
      _version: BigNumberish,
      _chainId: BigNumberish,
      arg2: string,
      _configType: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getRoleAdmin(role: BytesLike, overrides?: CallOverrides): Promise<[string]>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    initialize(
      _lzEndpoint: string,
      _lzChainId: BigNumberish,
      _lzChainIds: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    isTrustedRemote(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    lzChainId(overrides?: CallOverrides): Promise<[number]>;

    lzEndpoint(overrides?: CallOverrides): Promise<[string]>;

    lzReceive(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      _nonce: BigNumberish,
      _payload: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setConfig(
      _version: BigNumberish,
      _chainId: BigNumberish,
      _configType: BigNumberish,
      _config: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setReceiveVersion(
      _version: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setResolver(
      resolver_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setSendVersion(
      _version: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setTrustedRemote(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    sync(
      lzChainIds: BigNumberish[],
      payload: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    trustedRemoteLookup(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    tryLzReceive(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      _nonce: BigNumberish,
      _payload: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

  DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

  _reqExists(reqId: BytesLike, overrides?: CallOverrides): Promise<boolean>;

  estimateSyncFee(
    lzChainIds: BigNumberish[],
    payload: BytesLike,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  failedMessages(
    arg0: BigNumberish,
    arg1: BytesLike,
    arg2: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  forceResumeReceive(
    _srcChainId: BigNumberish,
    _srcAddress: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  fulfill(
    reqId: BytesLike,
    chainId_: BigNumberish,
    overrides?: CallOverrides
  ): Promise<boolean>;

  fulfill_SELF(
    srcChainId: BigNumberish,
    reqId: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getConfig(
    _version: BigNumberish,
    _chainId: BigNumberish,
    arg2: string,
    _configType: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  getRoleAdmin(role: BytesLike, overrides?: CallOverrides): Promise<string>;

  grantRole(
    role: BytesLike,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  hasRole(
    role: BytesLike,
    account: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  initialize(
    _lzEndpoint: string,
    _lzChainId: BigNumberish,
    _lzChainIds: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  isTrustedRemote(
    _srcChainId: BigNumberish,
    _srcAddress: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  lzChainId(overrides?: CallOverrides): Promise<number>;

  lzEndpoint(overrides?: CallOverrides): Promise<string>;

  lzReceive(
    _srcChainId: BigNumberish,
    _srcAddress: BytesLike,
    _nonce: BigNumberish,
    _payload: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceRole(
    role: BytesLike,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  revokeRole(
    role: BytesLike,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setConfig(
    _version: BigNumberish,
    _chainId: BigNumberish,
    _configType: BigNumberish,
    _config: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setReceiveVersion(
    _version: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setResolver(
    resolver_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setSendVersion(
    _version: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setTrustedRemote(
    _srcChainId: BigNumberish,
    _srcAddress: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceID: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  sync(
    lzChainIds: BigNumberish[],
    payload: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  trustedRemoteLookup(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  tryLzReceive(
    _srcChainId: BigNumberish,
    _srcAddress: BytesLike,
    _nonce: BigNumberish,
    _payload: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

    _reqExists(reqId: BytesLike, overrides?: CallOverrides): Promise<boolean>;

    estimateSyncFee(
      lzChainIds: BigNumberish[],
      payload: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    failedMessages(
      arg0: BigNumberish,
      arg1: BytesLike,
      arg2: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    forceResumeReceive(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    fulfill(
      reqId: BytesLike,
      chainId_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    fulfill_SELF(
      srcChainId: BigNumberish,
      reqId: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    getConfig(
      _version: BigNumberish,
      _chainId: BigNumberish,
      arg2: string,
      _configType: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    getRoleAdmin(role: BytesLike, overrides?: CallOverrides): Promise<string>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    initialize(
      _lzEndpoint: string,
      _lzChainId: BigNumberish,
      _lzChainIds: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;

    isTrustedRemote(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    lzChainId(overrides?: CallOverrides): Promise<number>;

    lzEndpoint(overrides?: CallOverrides): Promise<string>;

    lzReceive(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      _nonce: BigNumberish,
      _payload: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setConfig(
      _version: BigNumberish,
      _chainId: BigNumberish,
      _configType: BigNumberish,
      _config: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    setReceiveVersion(
      _version: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setResolver(resolver_: string, overrides?: CallOverrides): Promise<void>;

    setSendVersion(
      _version: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setTrustedRemote(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    supportsInterface(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    sync(
      lzChainIds: BigNumberish[],
      payload: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    trustedRemoteLookup(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    tryLzReceive(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      _nonce: BigNumberish,
      _payload: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "Callback(uint16,bytes32)"(
      dstChainId?: null,
      reqId?: null
    ): TypedEventFilter<
      [number, string],
      { dstChainId: number; reqId: string }
    >;

    Callback(
      dstChainId?: null,
      reqId?: null
    ): TypedEventFilter<
      [number, string],
      { dstChainId: number; reqId: string }
    >;

    "Fulfilled(bytes32)"(
      reqId?: null
    ): TypedEventFilter<[string], { reqId: string }>;

    Fulfilled(reqId?: null): TypedEventFilter<[string], { reqId: string }>;

    "MessageFailed(uint16,bytes,uint64,bytes)"(
      _srcChainId?: null,
      _srcAddress?: null,
      _nonce?: null,
      _payload?: null
    ): TypedEventFilter<
      [number, string, BigNumber, string],
      {
        _srcChainId: number;
        _srcAddress: string;
        _nonce: BigNumber;
        _payload: string;
      }
    >;

    MessageFailed(
      _srcChainId?: null,
      _srcAddress?: null,
      _nonce?: null,
      _payload?: null
    ): TypedEventFilter<
      [number, string, BigNumber, string],
      {
        _srcChainId: number;
        _srcAddress: string;
        _nonce: BigNumber;
        _payload: string;
      }
    >;

    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    "RoleAdminChanged(bytes32,bytes32,bytes32)"(
      role?: BytesLike | null,
      previousAdminRole?: BytesLike | null,
      newAdminRole?: BytesLike | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; previousAdminRole: string; newAdminRole: string }
    >;

    RoleAdminChanged(
      role?: BytesLike | null,
      previousAdminRole?: BytesLike | null,
      newAdminRole?: BytesLike | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; previousAdminRole: string; newAdminRole: string }
    >;

    "RoleGranted(bytes32,address,address)"(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; account: string; sender: string }
    >;

    RoleGranted(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; account: string; sender: string }
    >;

    "RoleRevoked(bytes32,address,address)"(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; account: string; sender: string }
    >;

    RoleRevoked(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; account: string; sender: string }
    >;

    "SetTarget(address)"(
      target?: null
    ): TypedEventFilter<[string], { target: string }>;

    SetTarget(target?: null): TypedEventFilter<[string], { target: string }>;

    "SetTrustedRemote(uint16,bytes)"(
      _srcChainId?: null,
      _srcAddress?: null
    ): TypedEventFilter<
      [number, string],
      { _srcChainId: number; _srcAddress: string }
    >;

    SetTrustedRemote(
      _srcChainId?: null,
      _srcAddress?: null
    ): TypedEventFilter<
      [number, string],
      { _srcChainId: number; _srcAddress: string }
    >;

    "Synchronize(address,bytes32,uint64[])"(
      sender_?: null,
      reqId?: null,
      nonces?: null
    ): TypedEventFilter<
      [string, string, BigNumber[]],
      { sender_: string; reqId: string; nonces: BigNumber[] }
    >;

    Synchronize(
      sender_?: null,
      reqId?: null,
      nonces?: null
    ): TypedEventFilter<
      [string, string, BigNumber[]],
      { sender_: string; reqId: string; nonces: BigNumber[] }
    >;

    "TransactionIn(uint16,address,uint64)"(
      srcChainId?: null,
      srcAddress?: null,
      nonce?: null
    ): TypedEventFilter<
      [number, string, BigNumber],
      { srcChainId: number; srcAddress: string; nonce: BigNumber }
    >;

    TransactionIn(
      srcChainId?: null,
      srcAddress?: null,
      nonce?: null
    ): TypedEventFilter<
      [number, string, BigNumber],
      { srcChainId: number; srcAddress: string; nonce: BigNumber }
    >;
  };

  estimateGas: {
    ADMIN_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    _reqExists(reqId: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    estimateSyncFee(
      lzChainIds: BigNumberish[],
      payload: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    failedMessages(
      arg0: BigNumberish,
      arg1: BytesLike,
      arg2: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    forceResumeReceive(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    fulfill(
      reqId: BytesLike,
      chainId_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    fulfill_SELF(
      srcChainId: BigNumberish,
      reqId: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getConfig(
      _version: BigNumberish,
      _chainId: BigNumberish,
      arg2: string,
      _configType: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getRoleAdmin(
      role: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(
      _lzEndpoint: string,
      _lzChainId: BigNumberish,
      _lzChainIds: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    isTrustedRemote(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    lzChainId(overrides?: CallOverrides): Promise<BigNumber>;

    lzEndpoint(overrides?: CallOverrides): Promise<BigNumber>;

    lzReceive(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      _nonce: BigNumberish,
      _payload: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setConfig(
      _version: BigNumberish,
      _chainId: BigNumberish,
      _configType: BigNumberish,
      _config: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setReceiveVersion(
      _version: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setResolver(
      resolver_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setSendVersion(
      _version: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setTrustedRemote(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    sync(
      lzChainIds: BigNumberish[],
      payload: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    trustedRemoteLookup(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tryLzReceive(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      _nonce: BigNumberish,
      _payload: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    ADMIN_ROLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    DEFAULT_ADMIN_ROLE(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    _reqExists(
      reqId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    estimateSyncFee(
      lzChainIds: BigNumberish[],
      payload: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    failedMessages(
      arg0: BigNumberish,
      arg1: BytesLike,
      arg2: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    forceResumeReceive(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    fulfill(
      reqId: BytesLike,
      chainId_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    fulfill_SELF(
      srcChainId: BigNumberish,
      reqId: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getConfig(
      _version: BigNumberish,
      _chainId: BigNumberish,
      arg2: string,
      _configType: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getRoleAdmin(
      role: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      _lzEndpoint: string,
      _lzChainId: BigNumberish,
      _lzChainIds: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    isTrustedRemote(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    lzChainId(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    lzEndpoint(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    lzReceive(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      _nonce: BigNumberish,
      _payload: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setConfig(
      _version: BigNumberish,
      _chainId: BigNumberish,
      _configType: BigNumberish,
      _config: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setReceiveVersion(
      _version: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setResolver(
      resolver_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setSendVersion(
      _version: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setTrustedRemote(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    sync(
      lzChainIds: BigNumberish[],
      payload: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    trustedRemoteLookup(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    tryLzReceive(
      _srcChainId: BigNumberish,
      _srcAddress: BytesLike,
      _nonce: BigNumberish,
      _payload: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}