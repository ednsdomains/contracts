import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import NetworkConfig from "../../network.config";
import { PublicResolver, Registry, Root, ClassicalRegistrarController, Registrar, Wrapper, TokenMock, Portal, UniversalRegistrarController } from "../../typechain";
import { ContractName } from "./constants/contract-name";
import { Contract, Transaction } from "ethers";
import { getAllContractsData, getContractAddress, isContractDeployed } from "./lib/get-contracts";
import { getBalance } from "./lib/get-balance";
import _ from "lodash";
import { setAllContractsData } from "./lib/set-contracts";
import delay from "delay";
import { LayerZeroProvider } from "../../typechain/LayerZeroProvider";
import { Bridge } from "../../typechain/Bridge";
import { InContractChain } from "./constants/chain";
import { IContracts } from "./interfaces/contracts";

export interface IDeployInput {
  chainId: number;
  signer: SignerWithAddress;
  contracts: IContracts;
}

export const deployRegistry = async (input: IDeployInput): Promise<Registry> => {
  await _beforeDeploy(input.signer, await input.signer.getChainId(), "Registry");
  const factory = await ethers.getContractFactory("Registry", input.signer);
  const _contract = await upgrades.deployProxy(factory, { kind: "uups" });
  await _contract.deployed();
  await _afterDeploy(await input.signer.getChainId(), "Registry", _contract, _contract.deployTransaction);
  const contract = factory.attach(_contract.address);
  return contract;
};

export const deployWrapper = async (NFT_NAME: string, NFT_SYMBOL: string, input: IDeployInput): Promise<Wrapper> => {
  if (!input.contracts.Registry) throw new Error("`Registry` is not available");
  await _beforeDeploy(input.signer, await input.signer.getChainId(), "DefaultWrapper");
  const factory = await ethers.getContractFactory("Wrapper", input.signer);
  const _contract = await upgrades.deployProxy(factory, [input.contracts.Registry.address, NFT_NAME, NFT_SYMBOL], { kind: "uups" });
  await _contract.deployed();
  await _afterDeploy(await input.signer.getChainId(), "DefaultWrapper", _contract, _contract.deployTransaction);
  const contract = factory.attach(_contract.address);
  return contract;
};

export const deployPublicResolver = async (input: IDeployInput): Promise<PublicResolver> => {
  if (!input.contracts.Registry) throw new Error("`Registry` is not available");
  await _beforeDeploy(input.signer, await input.signer.getChainId(), "PublicResolver");
  const factory = await ethers.getContractFactory("PublicResolver", input.signer);
  const _contract = await upgrades.deployProxy(factory, [input.contracts.Registry.address], { kind: "uups", unsafeAllow: ["delegatecall"] });
  await _contract.deployed();
  await _afterDeploy(await input.signer.getChainId(), "PublicResolver", _contract, _contract.deployTransaction);
  const contract = factory.attach(_contract.address);
  return contract;
};

export const deployRegistrar = async (input: IDeployInput): Promise<Registrar> => {
  if (!input.contracts.Registry) throw new Error("`Registry` is not available");
  if (!input.contracts.PublicResolver) throw new Error("`PublicResolver` is not available");
  await _beforeDeploy(input.signer, await input.signer.getChainId(), "Registrar");
  const factory = await ethers.getContractFactory("Registrar", input.signer);
  const _contract = await upgrades.deployProxy(factory, [input.contracts.Registry.address, input.contracts.PublicResolver.address], { kind: "uups" });
  await _contract.deployed();
  await _afterDeploy(await input.signer.getChainId(), "Registrar", _contract, _contract.deployTransaction);
  const contract = factory.attach(_contract.address);
  return contract;
};

export const deployRoot = async (input: IDeployInput): Promise<Root> => {
  if (!input.contracts.Registry) throw new Error("`Registry` is not available");
  if (!input.contracts.Registrar) throw new Error("`Registrar` is not available");
  await _beforeDeploy(input.signer, await input.signer.getChainId(), "Root");
  const factory = await ethers.getContractFactory("Root", input.signer);
  const _contract = await upgrades.deployProxy(factory, [input.contracts.Registry.address, input.contracts.Registrar.address], { kind: "uups" });
  _contract.deployTransaction;
  await _contract.deployed();
  await _afterDeploy(await input.signer.getChainId(), "Root", _contract, _contract.deployTransaction);
  const contract = factory.attach(_contract.address);
  return contract;
};

export const deployTokenMock = async (input: IDeployInput): Promise<TokenMock> => {
  await _beforeDeploy(input.signer, await input.signer.getChainId(), "Token");
  const factory = await ethers.getContractFactory("TokenMock", input.signer);
  const contract = await factory.deploy();
  await _afterDeploy(await input.signer.getChainId(), "Token", contract, contract.deployTransaction);
  return contract;
};

export const deployClassicalRegistrarController = async (input: IDeployInput): Promise<ClassicalRegistrarController> => {
  if (!input.contracts.Token) throw new Error("`Token` is not available");
  if (!input.contracts.Registrar) throw new Error("`Registrar` is not available");
  if (!input.contracts.Root) throw new Error("`Root` is not available");
  await _beforeDeploy(input.signer, await input.signer.getChainId(), "ClassicalRegistrarController");
  const factory = await ethers.getContractFactory("ClassicalRegistrarController", input.signer);
  const COIN_ID = NetworkConfig[await input.signer.getChainId()].slip44?.coinId || 0;
  const _contract = await upgrades.deployProxy(factory, [input.contracts.Token.address, input.contracts.Registrar.address, input.contracts.Root.address, COIN_ID], {
    kind: "uups",
  });
  await _contract.deployed();
  await _afterDeploy(await input.signer.getChainId(), "ClassicalRegistrarController", _contract, _contract.deployTransaction);
  const contract = factory.attach(_contract.address);
  return contract;
};

export const deployUniversalRegistrarController = async (input: IDeployInput): Promise<UniversalRegistrarController> => {
  if (!input.contracts.Registrar) throw new Error("`Registrar` is not available");
  if (!input.contracts.Root) throw new Error("`Root` is not available");
  await _beforeDeploy(input.signer, await input.signer.getChainId(), "UniversalRegistrarController");
  const factory = await ethers.getContractFactory("UniversalRegistrarController", input.signer);
  const COIN_ID = NetworkConfig[await input.signer.getChainId()].slip44?.coinId || 0;
  const _contract = await upgrades.deployProxy(factory, [input.contracts.Token, input.contracts.Registrar.address, input.contracts.Root.address, COIN_ID], { kind: "uups" });
  await _contract.deployed();
  await _afterDeploy(await input.signer.getChainId(), "UniversalRegistrarController", _contract, _contract.deployTransaction);
  const contract = factory.attach(_contract.address);
  return contract;
};

export const deployPortal = async (input: IDeployInput): Promise<Portal> => {
  await _beforeDeploy(input.signer, await input.signer.getChainId(), "Portal");
  const factory = await ethers.getContractFactory("Portal", input.signer);
  const _contract = await upgrades.deployProxy(factory, { kind: "uups" });
  await _contract.deployed();
  await _afterDeploy(await input.signer.getChainId(), "Portal", _contract, _contract.deployTransaction);
  const contract = factory.attach(_contract.address);
  return contract;
};

export const deployBridge = async (chain: InContractChain, input: IDeployInput): Promise<Bridge> => {
  if (!input.contracts.Registry) throw new Error("`Registry` is not available");
  if (!input.contracts.Portal) throw new Error("`Portal` is not available");
  await _beforeDeploy(input.signer, await input.signer.getChainId(), "Bridge");
  const factory = await ethers.getContractFactory("Bridge", input.signer);
  const _contract = await upgrades.deployProxy(factory, [chain, input.contracts.Registry.address, input.contracts.Portal.address], { kind: "uups" });
  await _contract.deployed();
  await _afterDeploy(await input.signer.getChainId(), "Bridge", _contract, _contract.deployTransaction);
  const contract = factory.attach(_contract.address);
  return contract;
};

export const deployLayerZeroProvider = async (input: IDeployInput): Promise<LayerZeroProvider> => {
  if (!input.contracts.Portal) throw new Error("`Portal` is not available");
  await _beforeDeploy(input.signer, await input.signer.getChainId(), "LayerZeroProvider");
  const factory = await ethers.getContractFactory("LayerZeroProvider", input.signer);
  const lzEndpoint = NetworkConfig[await input.signer.getChainId()].layerzero?.endpoint;
  if (!lzEndpoint) throw new Error("LayerZero endpoint is missing");
  const _contract = await upgrades.deployProxy(factory, [lzEndpoint, input.contracts.Portal.address], { kind: "uups" });
  await _contract.deployed();
  await _afterDeploy(await input.signer.getChainId(), "LayerZeroProvider", _contract, _contract.deployTransaction);
  const contract = factory.attach(_contract.address);
  return contract;
};

const _beforeDeploy = async (signer: SignerWithAddress, chainId: number, name: ContractName) => {
  // Check is the contract already deployed on to the chain
  const isDeployed = await isContractDeployed(chainId, name);
  if (isDeployed) throw new Error(`${name} is already deployed - [${await getContractAddress(chainId, name)})}]`);

  // Check is the signer account has enough balance
  const balance = await getBalance(signer);
  if (balance.eq(0)) throw new Error(`Signer account ${signer.address} has [0] balance`);

  // Announce ready for the deployment
  console.log(`Deployment initiated, contract [${name}] will be deploy on [${NetworkConfig[chainId].name}] in 5 seconds...`);
  await delay(5000);
};

const _afterDeploy = async (chainId: number, name: ContractName, contract: Contract, tx: Transaction) => {
  console.log(`Contract [${name}] has been deployed on [${NetworkConfig[chainId].name}]`);
  console.log(`Address - [${contract.address}]`);
  console.log(`Transaction Hash - [${tx.hash}]`);
  const ALL_CONTRACTS_DATA = await getAllContractsData();
  const index = ALL_CONTRACTS_DATA.findIndex((c) => c.chainId === chainId);
  if (index !== -1) {
    ALL_CONTRACTS_DATA[index].addresses[name] = contract.address;
  } else {
    const _contract = _.clone(ALL_CONTRACTS_DATA.find((c) => c.chainId === 0));
    if (!_contract) throw new Error("");
    _contract.chainId = chainId;
    _contract.addresses[name] = contract.address;
    ALL_CONTRACTS_DATA.push(_contract);
  }
  await setAllContractsData(ALL_CONTRACTS_DATA);
};

//
// public static async deployUniversalRegistrarController(input: IDeployUniversalRegistrarControllerInput): Promise<UniversalRegistrarController> {
//   const UniversalRegistrarControllerFactory = await ethers.getContractFactory("UniversalRegistrarController", input.signer);
//   const _universalRegistrarController = await upgrades.deployProxy(UniversalRegistrarControllerFactory, [
//     input.TOKEN_ADDRESS,
//     input.Registrar.address,
//     input.Root.address,
//     input.COIN_ID,
//   ]);
//   await _universalRegistrarController.deployed();
//   const universalRegistrarController = UniversalRegistrarControllerFactory.attach(_universalRegistrarController.address);
//   console.log(`UniversalRegistrarController Deployed - ${universalRegistrarController.address}`);
//   return universalRegistrarController;
// }

// public static async deployBatchRegistrarController(input: IDeployBatchRegistrarControllerInput): Promise<BatchRegistrarController> {
//   const BatchRegistrarControllerFactory = await ethers.getContractFactory("BatchRegistrarController");
//   const _batchRegistrarController = await upgrades.deployProxy(BatchRegistrarControllerFactory);
//   await _batchRegistrarController.deployed();
//   const batchRegistrarController = BatchRegistrarControllerFactory.attach(_batchRegistrarController.address);
//   console.log(`BatchRegistrarController Deployed - ${batchRegistrarController.address}`);
//   return batchRegistrarController;
// }

// export interface IDeploySingletonRegistrarInput{
//   Registry: Registry;
// }

// Singleton Registrar
// export async function deploySingletonRegistrar(input: IDeploySingletonRegistrarInput): Promise<SingletonRegistrar> {
//   const SingletonRegistrarFactory = await ethers.getContractFactory("SingletonRegistrar", input.signer);
//   const _singletonRegistrar = await upgrades.deployProxy(SingletonRegistrarFactory, [input.Registry.address]);
//   await _singletonRegistrar.deployed();
//   const singletonRegistrar = SingletonRegistrarFactory.attach(_singletonRegistrar.address);
//   console.log(`SingletonRegistrar Deployed - ${singletonRegistrar.address}`);
//   return singletonRegistrar;
// }

// export interface IDeploySingletonRegistrarControllerInput{
//   Token: Token;
//   DomainPriceOracle: DomainPriceOracle;
//   TokenPriceOracle: TokenPriceOracle;
//   SingletonRegistrar: SingletonRegistrar;
// }

// // Singleton Registrar Controller
// export async function deploySingletonRegistrarController(input: IDeploySingletonRegistrarControllerInput): Promise<SingletonRegistrarController> {
//   const SingletonRegistrarControllerFactory = await ethers.getContractFactory("SingletonRegistrarController", input.signer);
//   const _singletonRegistrarController = await upgrades.deployProxy(SingletonRegistrarControllerFactory, [
//     input.Token.address,
//     input.DomainPriceOracle.address,
//     input.TokenPriceOracle.address,
//     input.SingletonRegistrar.address,
//     NetworkConfig[await input.signer.getChainId()].slip44.coinId,
//   ]);
//   await _singletonRegistrarController.deployed();
//   const singletonRegistrarController = SingletonRegistrarControllerFactory.attach(_singletonRegistrarController.address);
//   console.log(`SingletonRegistrarController Deployed - ${singletonRegistrarController.address}`);
//   return singletonRegistrarController;
// }

// // Omni Registrar Synchronizer
// export async function deployOmniRegistrarSynchronizer(input: IDeployInput): Promise<OmniRegistrarSynchronizer> {
//   const OmniRegistrarSynchronizerFactory = await ethers.getContractFactory("OmniRegistrarSynchronizer", input.signer);
//   const _omniRegistrarSynchronizer = await upgrades.deployProxy(OmniRegistrarSynchronizerFactory, [
//     NetworkConfig[await input.signer.getChainId()].layerzero.endpoint.address,
//     NetworkConfig[await input.signer.getChainId()].layerzero.chainId,
//     input.networks.map((network_) => NetworkConfig[network_].layerzero.chainId),
//   ]);
//   await _omniRegistrarSynchronizer.deployed();
//   const omniRegistrarSynchronizer = OmniRegistrarSynchronizerFactory.attach(_omniRegistrarSynchronizer.address);
//   console.log(`OmniRegistrarSynchronizer Deployed - ${omniRegistrarSynchronizer.address}`);
//   return omniRegistrarSynchronizer;
// }

// export interface IDeployOmniRegistrarInput{
//   Registry: Registry;
//   OmniRegistrarSynchronizer: OmniRegistrarSynchronizer;
// }

// // Omni Registrar
// export async function deployOmniRegistrar(input: IDeployOmniRegistrarInput): Promise<OmniRegistrar> {
//   const OmniRegistrarFactory = await ethers.getContractFactory("OmniRegistrar", input.signer);
//   const _omniRegistrar = await upgrades.deployProxy(OmniRegistrarFactory, [input.Registry.address, input.OmniRegistrarSynchronizer.address]);
//   await _omniRegistrar.deployed();
//   const omniRegistrar = OmniRegistrarFactory.attach(_omniRegistrar.address);
//   console.log(`OmniRegistrar Deployed - ${omniRegistrar.address}`);
//   return omniRegistrar;
// }

// export interface IDeployOmniRegistrarControllerInput{
//   Token: Token;
//   DomainPriceOracle: DomainPriceOracle;
//   TokenPriceOracle: TokenPriceOracle;
//   OmniRegistrar: OmniRegistrar;
// }

// // Omni Registrar Controller
// export async function deployOmniRegistrarControllers(input: IDeployOmniRegistrarControllerInput): Promise<OmniRegistrarController> {
//   const OmniRegistrarControllerFactory = await ethers.getContractFactory("OmniRegistrarController", input.signer);
//   const _omniRegistrarController = await upgrades.deployProxy(OmniRegistrarControllerFactory, [
//     input.Token.address,
//     input.DomainPriceOracle.address,
//     input.TokenPriceOracle.address,
//     input.OmniRegistrar.address,
//     input.networks.map((network_) => NetworkConfig[network_].slip44.coinId),
//   ]);
//   await _omniRegistrarController.deployed();
//   const omniRegistrarController = OmniRegistrarControllerFactory.attach(_omniRegistrarController.address);
//   console.log(`OmniRegistrarController Deployed - ${omniRegistrarController.address}`);
//   return omniRegistrarController;
