import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import NetworkConfig from "../../network.config";
import { PublicResolver, Registry, Root, ClassicalRegistrarController, Registrar, Wrapper, TokenMock } from "../../typechain";
import { ContractName } from "./constants/contract-name";
import { Contract, Transaction } from "ethers";
import { getAllContractsData, getContractAddress, isContractDeployed } from "./get-contracts";
import { getBalance } from "./get-balance";
import _ from "lodash";
import { setAllContractsData } from "./set-contracts";
import delay from "delay";

export interface IDeployArgs {
  deployer: SignerWithAddress;
}

export interface IDeployRegistryInput {}

export interface IDeployWrapperInput {
  Registry: Registry;
  NFT_NAME: string;
  NFT_SYMBOL: string;
}

export interface IDeployPublicResolverInput {
  Registry: Registry;
}

export interface IDeployRegistrarInput {
  Registry: Registry;
  PublicResolver: PublicResolver;
}

export interface IDeployRootInput {
  Registry: Registry;
  Registrar: Registrar;
}

export interface IDeployClassicalRegistrarControllerInput {
  TOKEN_ADDRESS: string;
  Registrar: Registrar;
  Root: Root;
  COIN_ID: number;
}

export interface IDeployUniversalRegistrarControllerInput {
  TOKEN_ADDRESS: string;
  Registrar: Registrar;
  Root: Root;
  COIN_ID: number;
}

export interface IDeployOmniRegistrarControllerInput {}

export interface IDeployBatchRegistrarControllerInput {}

export interface IDeployLayerZeroProviderInput {}

export interface IDeployPortalInput {}

export interface IDeployBridgeInput {}

export interface IDeploySynchronizerInput {}

export const deployRegistry = async (args: IDeployArgs): Promise<Registry> => {
  await _beforeDeploy(args.deployer, await args.deployer.getChainId(), "Registry");
  const RegistryFactory = await ethers.getContractFactory("Registry", args?.deployer);
  const _registry = await upgrades.deployProxy(RegistryFactory, { kind: "uups" });
  await _registry.deployed();
  await _afterDeploy(await args.deployer.getChainId(), "Registry", _registry, _registry.deployTransaction);
  const registry = RegistryFactory.attach(_registry.address);
  return registry;
};

export const deployWrapper = async (input: IDeployWrapperInput, args: IDeployArgs): Promise<Wrapper> => {
  await _beforeDeploy(args.deployer, await args.deployer.getChainId(), "DefaultWrapper");
  const WrapperFactory = await ethers.getContractFactory("Wrapper", args?.deployer);
  const _wrapper = await upgrades.deployProxy(WrapperFactory, [input.Registry.address, input.NFT_NAME, input.NFT_SYMBOL], { kind: "uups" });
  await _wrapper.deployed();
  await _afterDeploy(await args.deployer.getChainId(), "DefaultWrapper", _wrapper, _wrapper.deployTransaction);

  const wrapper = WrapperFactory.attach(_wrapper.address);
  return wrapper;
};

export const deployPublicResolver = async (input: IDeployPublicResolverInput, args: IDeployArgs): Promise<PublicResolver> => {
  await _beforeDeploy(args.deployer, await args.deployer.getChainId(), "PublicResolver");
  const PublicResolverFactory = await ethers.getContractFactory("PublicResolver", args?.deployer);
  const _publicResolver = await upgrades.deployProxy(PublicResolverFactory, [input.Registry.address], { kind: "uups", unsafeAllow: ["delegatecall"] });
  await _publicResolver.deployed();
  await _afterDeploy(await args.deployer.getChainId(), "PublicResolver", _publicResolver, _publicResolver.deployTransaction);
  const publicResolver = PublicResolverFactory.attach(_publicResolver.address);
  return publicResolver;
};

export const deployRegistrar = async (input: IDeployRegistrarInput, args: IDeployArgs): Promise<Registrar> => {
  await _beforeDeploy(args.deployer, await args.deployer.getChainId(), "Registrar");
  const RegistrarFactory = await ethers.getContractFactory("Registrar", args?.deployer);
  const _registrar = await upgrades.deployProxy(RegistrarFactory, [input.Registry.address, input.PublicResolver.address], { kind: "uups" });
  await _registrar.deployed();
  await _afterDeploy(await args.deployer.getChainId(), "Registrar", _registrar, _registrar.deployTransaction);
  const registrar = RegistrarFactory.attach(_registrar.address);
  return registrar;
};

export const deployRoot = async (input: IDeployRootInput, args: IDeployArgs): Promise<Root> => {
  await _beforeDeploy(args.deployer, await args.deployer.getChainId(), "Root");
  const RootFactory = await ethers.getContractFactory("Root", args?.deployer);
  const _root = await upgrades.deployProxy(RootFactory, [input.Registry.address, input.Registrar.address], { kind: "uups" });
  _root.deployTransaction;
  await _root.deployed();
  await _afterDeploy(await args.deployer.getChainId(), "Root", _root, _root.deployTransaction);
  const root = RootFactory.attach(_root.address);
  return root;
};

export const deployTokenMock = async (args: IDeployArgs): Promise<TokenMock> => {
  await _beforeDeploy(args.deployer, await args.deployer.getChainId(), "Token");
  const TokenMockFactory = await ethers.getContractFactory("TokenMock", args?.deployer);
  const tokenMock = await TokenMockFactory.deploy();
  return tokenMock;
};

export const deployClassicalRegistrarController = async (input: IDeployClassicalRegistrarControllerInput, args: IDeployArgs): Promise<ClassicalRegistrarController> => {
  await _beforeDeploy(args.deployer, await args.deployer.getChainId(), "ClassicalRegistrarController");
  const ClassicalRegistrarControllerFactory = await ethers.getContractFactory("ClassicalRegistrarController", args?.deployer);
  const _classicalRegistrarController = await upgrades.deployProxy(ClassicalRegistrarControllerFactory, [
    input.TOKEN_ADDRESS,
    input.Registrar.address,
    input.Root.address,
    input.COIN_ID,
  ]);
  await _classicalRegistrarController.deployed();
  await _afterDeploy(await args.deployer.getChainId(), "ClassicalRegistrarController", _classicalRegistrarController, _classicalRegistrarController.deployTransaction);
  const classicalRegistrarController = ClassicalRegistrarControllerFactory.attach(_classicalRegistrarController.address);
  return classicalRegistrarController;
};

const _beforeDeploy = async (deployer: SignerWithAddress, chainId: number, name: ContractName) => {
  // Check is the contract already deployed on to the chain
  const isDeployed = await isContractDeployed(chainId, name);
  if (isDeployed) throw new Error(`${name} is already deployed - [${await getContractAddress(chainId, name)})}]`);

  // Check is the deployer account has enough balance
  const balance = await getBalance(deployer);
  if (balance.eq(0)) throw new Error(`Deployer account ${deployer.address} has [0] balance`);

  // Announce ready for the deployment
  console.log(`Deployment initiated, contract [${name}] will be deploy on [[${NetworkConfig[chainId].name}]] in 5 seconds...`);
  await delay(5000);
};

const _afterDeploy = async (chainId: number, name: ContractName, contract: Contract, tx: Transaction) => {
  console.log(`Contract [${name}] has been deployed on [${NetworkConfig[chainId].name}] - Address: [${contract.address}] || Tx: [${tx.hash || "N/A"}]`);
  const ALL_CONTRACTS_DATA = await getAllContractsData();
  const index = ALL_CONTRACTS_DATA.findIndex((c) => c.chainId === chainId);
  if (index) {
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
//   const UniversalRegistrarControllerFactory = await ethers.getContractFactory("UniversalRegistrarController", args?.deployer);
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
//   const SingletonRegistrarFactory = await ethers.getContractFactory("SingletonRegistrar", args?.deployer);
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
//   const SingletonRegistrarControllerFactory = await ethers.getContractFactory("SingletonRegistrarController", args?.deployer);
//   const _singletonRegistrarController = await upgrades.deployProxy(SingletonRegistrarControllerFactory, [
//     input.Token.address,
//     input.DomainPriceOracle.address,
//     input.TokenPriceOracle.address,
//     input.SingletonRegistrar.address,
//     NetworkConfig[await args?.deployer.getChainId()].slip44.coinId,
//   ]);
//   await _singletonRegistrarController.deployed();
//   const singletonRegistrarController = SingletonRegistrarControllerFactory.attach(_singletonRegistrarController.address);
//   console.log(`SingletonRegistrarController Deployed - ${singletonRegistrarController.address}`);
//   return singletonRegistrarController;
// }

// // Omni Registrar Synchronizer
// export async function deployOmniRegistrarSynchronizer(input: IDeployInput): Promise<OmniRegistrarSynchronizer> {
//   const OmniRegistrarSynchronizerFactory = await ethers.getContractFactory("OmniRegistrarSynchronizer", args?.deployer);
//   const _omniRegistrarSynchronizer = await upgrades.deployProxy(OmniRegistrarSynchronizerFactory, [
//     NetworkConfig[await args?.deployer.getChainId()].layerzero.endpoint.address,
//     NetworkConfig[await args?.deployer.getChainId()].layerzero.chainId,
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
//   const OmniRegistrarFactory = await ethers.getContractFactory("OmniRegistrar", args?.deployer);
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
//   const OmniRegistrarControllerFactory = await ethers.getContractFactory("OmniRegistrarController", args?.deployer);
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
