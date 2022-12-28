import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import NetworkConfig from "../../network.config";
import { PublicResolver, Registry, Root, ClassicalRegistrarController, Registrar, Wrapper, TokenMock } from "../../typechain";

export interface IDeployArgs {
  deployer?: SignerWithAddress;
}

export interface IDeployRegistryInput {}

export interface IDeployDefaultWrapperInput {
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

export const deployRegistry = async (args?: IDeployArgs): Promise<Registry> => {
  const RegistryFactory = await ethers.getContractFactory("Registry", args?.deployer);
  const _registry = await upgrades.deployProxy(RegistryFactory, { kind: "uups" });
  await _registry.deployed();
  const registry = RegistryFactory.attach(_registry.address);
  console.log(`Registry Deployed - ${registry.address}`);
  return registry;
};

export const deployDefaultWrapper = async (input: IDeployDefaultWrapperInput, args?: IDeployArgs): Promise<Wrapper> => {
  const WrapperFactory = await ethers.getContractFactory("Wrapper", args?.deployer);
  const _wrapper = await upgrades.deployProxy(WrapperFactory, [input.Registry.address, input.NFT_NAME, input.NFT_SYMBOL], { kind: "uups" });
  await _wrapper.deployed();
  const wrapper = WrapperFactory.attach(_wrapper.address);
  console.log(`Default Wrapper Deployed - ${wrapper.address}`);
  return wrapper;
};

export const deployPublicResolver = async (input: IDeployPublicResolverInput, args?: IDeployArgs): Promise<PublicResolver> => {
  const PublicResolverFactory = await ethers.getContractFactory("PublicResolver", args?.deployer);
  const _publicResolver = await upgrades.deployProxy(PublicResolverFactory, [input.Registry.address], { kind: "uups", unsafeAllow: ["delegatecall"] });
  await _publicResolver.deployed();
  const publicResolver = PublicResolverFactory.attach(_publicResolver.address);
  console.log(`PublicResolver Deployed - ${publicResolver.address}`);
  return publicResolver;
};

export const deployRegistrar = async (input: IDeployRegistrarInput, args?: IDeployArgs): Promise<Registrar> => {
  const RegistrarFactory = await ethers.getContractFactory("Registrar", args?.deployer);
  const _baseRegistrar = await upgrades.deployProxy(RegistrarFactory, [input.Registry.address, input.PublicResolver.address], { kind: "uups" });
  await _baseRegistrar.deployed();
  const registrar = RegistrarFactory.attach(_baseRegistrar.address);
  console.log(`Registrar Deployed - ${registrar.address}`);
  return registrar;
};

export const deployRoot = async (input: IDeployRootInput, args?: IDeployArgs): Promise<Root> => {
  const RootFactory = await ethers.getContractFactory("Root", args?.deployer);
  const _root = await upgrades.deployProxy(RootFactory, [input.Registry.address, input.Registrar.address], { kind: "uups" });
  await _root.deployed();
  const root = RootFactory.attach(_root.address);
  console.log(`Root Deployed - ${root.address}`);
  return root;
};

export const deployTokenMock = async (args?: IDeployArgs): Promise<TokenMock> => {
  const TokenMockFactory = await ethers.getContractFactory("TokenMock", args?.deployer);
  const tokenMock = await TokenMockFactory.deploy();
  console.log(`TokenMock Deployed - ${tokenMock.address}`);
  return tokenMock;
};

export const deployClassicalRegistrarController = async (input: IDeployClassicalRegistrarControllerInput, args?: IDeployArgs): Promise<ClassicalRegistrarController> => {
  const ClassicalRegistrarControllerFactory = await ethers.getContractFactory("ClassicalRegistrarController", args?.deployer);
  const _classicalRegistrarController = await upgrades.deployProxy(ClassicalRegistrarControllerFactory, [
    input.TOKEN_ADDRESS,
    input.Registrar.address,
    input.Root.address,
    input.COIN_ID,
  ]);
  await _classicalRegistrarController.deployed();
  const classicalRegistrarController = ClassicalRegistrarControllerFactory.attach(_classicalRegistrarController.address);
  console.log(`ClassicalRegistrarController Deployed - ${classicalRegistrarController.address}`);
  return classicalRegistrarController;
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
