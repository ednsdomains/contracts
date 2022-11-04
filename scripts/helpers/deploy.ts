import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import NetworkConfig, { Network } from "../../network.config";
import {
  PublicResolver,
  Registry,
  Root,
  ClassicalRegistrarController,
  BaseRegistrar,
  Root__factory,
  BatchRegistrarController,
  UniversalRegistrarController,
} from "../../typechain";

export interface IDeployInput {
  signer: SignerWithAddress;
  network: Network;
}

export interface IDeployRegistryInput extends IDeployInput {}

export interface IDeployPublicResolverInput extends IDeployInput {
  Registry: Registry;
}

export interface IDeployBaseRegistrar extends IDeployInput {
  Registry: Registry;
}

export interface IDeployRootInput extends IDeployInput {
  Registry: Registry;
  BaseRegistrar: BaseRegistrar;
}

export interface IDeployClassicalRegistrarControllerInput extends IDeployInput {
  TOKEN_ADDRESS: string;
  BaseRegistrar: BaseRegistrar;
  Root: Root;
  COIN_ID: number;
}

export interface IDeployUniversalRegistrarControllerInput extends IDeployInput {
  TOKEN_ADDRESS: string;
  BaseRegistrar: BaseRegistrar;
  Root: Root;
  COIN_ID: number;
}

export interface IDeployBatchRegistrarControllerInput extends IDeployInput {}

export default class Deployer {
  public static async deployRegistry(input: IDeployInput): Promise<Registry> {
    const RegistryFactory = await ethers.getContractFactory("Registry", input.signer);
    const _registry = await upgrades.deployProxy(RegistryFactory);
    await _registry.deployed();
    const registry = RegistryFactory.attach(_registry.address);
    console.log(`[[${NetworkConfig[input.network].name}]] Registry Deployed - ${registry.address}`);
    return registry;
  }

  public static async deployPublicResolver(input: IDeployPublicResolverInput): Promise<PublicResolver> {
    const PublicResolverFactory = await ethers.getContractFactory("PublicResolver", input.signer);
    const _publicResolver = await upgrades.deployProxy(PublicResolverFactory, [input.Registry.address], { unsafeAllow: ["delegatecall"] });
    await _publicResolver.deployed();
    const publicResolver = PublicResolverFactory.attach(_publicResolver.address);
    console.log(`[[${NetworkConfig[input.network].name}]] PublicResolver Deployed - ${publicResolver.address}`);
    return publicResolver;
  }

  public static async deployBaseRegistrar(input: IDeployBaseRegistrar): Promise<BaseRegistrar> {
    const BaseRegistrarFactory = await ethers.getContractFactory("BaseRegistrar");
    const _baseRegistrar = await upgrades.deployProxy(BaseRegistrarFactory, [input.Registry.address]);
    await _baseRegistrar.deployed();
    const baseRegistrar = BaseRegistrarFactory.attach(_baseRegistrar.address);
    console.log(`[[${NetworkConfig[input.network].name}]] BaseRegistrar Deployed - ${baseRegistrar.address}`);
    return baseRegistrar;
  }

  public static async deployRoot(input: IDeployRootInput): Promise<Root> {
    const RootFactory = await ethers.getContractFactory("Root", input.signer);
    const _root = await upgrades.deployProxy(RootFactory, [input.Registry.address, input.BaseRegistrar.address]);
    await _root.deployed();
    const root = RootFactory.attach(_root.address);
    console.log(`[[${NetworkConfig[input.network].name}]] Root Deployed - ${root.address}`);
    return Root__factory.connect(root.address, input.signer);
  }

  public static async deployClassicalRegistrarController(input: IDeployClassicalRegistrarControllerInput): Promise<ClassicalRegistrarController> {
    const ClassicalRegistrarControllerFactory = await ethers.getContractFactory("ClassicalRegistrarController", input.signer);
    const _classicalRegistrarController = await upgrades.deployProxy(ClassicalRegistrarControllerFactory, [
      input.TOKEN_ADDRESS,
      input.BaseRegistrar.address,
      input.Root.address,
      input.COIN_ID,
    ]);
    await _classicalRegistrarController.deployed();
    const classicalRegistrarController = ClassicalRegistrarControllerFactory.attach(_classicalRegistrarController.address);
    console.log(`[[${NetworkConfig[input.network].name}]] ClassicalRegistrarController Deployed - ${classicalRegistrarController.address}`);
    return classicalRegistrarController;
  }

  public static async deployUniversalRegistrarController(input: IDeployUniversalRegistrarControllerInput): Promise<UniversalRegistrarController> {
    const UniversalRegistrarControllerFactory = await ethers.getContractFactory("UniversalRegistrarController", input.signer);
    const _universalRegistrarController = await upgrades.deployProxy(UniversalRegistrarControllerFactory, [
      input.TOKEN_ADDRESS,
      input.BaseRegistrar.address,
      input.Root.address,
      input.COIN_ID,
    ]);
    await _universalRegistrarController.deployed();
    const universalRegistrarController = UniversalRegistrarControllerFactory.attach(_universalRegistrarController.address);
    console.log(`[[${NetworkConfig[input.network].name}]] UniversalRegistrarController Deployed - ${universalRegistrarController.address}`);
    return universalRegistrarController;
  }

  public static async deployBatchRegistrarController(input: IDeployBatchRegistrarControllerInput): Promise<BatchRegistrarController> {
    const BatchRegistrarControllerFactory = await ethers.getContractFactory("BatchRegistrarController");
    const _batchRegistrarController = await upgrades.deployProxy(BatchRegistrarControllerFactory);
    await _batchRegistrarController.deployed();
    const batchRegistrarController = BatchRegistrarControllerFactory.attach(_batchRegistrarController.address);
    console.log(`[[${NetworkConfig[input.network].name}]] BatchRegistrarController Deployed - ${batchRegistrarController.address}`);
    return batchRegistrarController;
  }
}

// export interface IDeploySingletonRegistrarInput extends IDeployInput {
//   Registry: Registry;
// }

// Singleton Registrar
// export async function deploySingletonRegistrar(input: IDeploySingletonRegistrarInput): Promise<SingletonRegistrar> {
//   const SingletonRegistrarFactory = await ethers.getContractFactory("SingletonRegistrar", input.signer);
//   const _singletonRegistrar = await upgrades.deployProxy(SingletonRegistrarFactory, [input.Registry.address]);
//   await _singletonRegistrar.deployed();
//   const singletonRegistrar = SingletonRegistrarFactory.attach(_singletonRegistrar.address);
//   console.log(`[[${NetworkConfig[input.network].name}]] SingletonRegistrar Deployed - ${singletonRegistrar.address}`);
//   return singletonRegistrar;
// }

// export interface IDeploySingletonRegistrarControllerInput extends IDeployInput {
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
//     NetworkConfig[input.network].slip44.coinId,
//   ]);
//   await _singletonRegistrarController.deployed();
//   const singletonRegistrarController = SingletonRegistrarControllerFactory.attach(_singletonRegistrarController.address);
//   console.log(`[[${NetworkConfig[input.network].name}]] SingletonRegistrarController Deployed - ${singletonRegistrarController.address}`);
//   return singletonRegistrarController;
// }

// // Omni Registrar Synchronizer
// export async function deployOmniRegistrarSynchronizer(input: IDeployInput): Promise<OmniRegistrarSynchronizer> {
//   const OmniRegistrarSynchronizerFactory = await ethers.getContractFactory("OmniRegistrarSynchronizer", input.signer);
//   const _omniRegistrarSynchronizer = await upgrades.deployProxy(OmniRegistrarSynchronizerFactory, [
//     NetworkConfig[input.network].layerzero.endpoint.address,
//     NetworkConfig[input.network].layerzero.chainId,
//     input.networks.map((network_) => NetworkConfig[network_].layerzero.chainId),
//   ]);
//   await _omniRegistrarSynchronizer.deployed();
//   const omniRegistrarSynchronizer = OmniRegistrarSynchronizerFactory.attach(_omniRegistrarSynchronizer.address);
//   console.log(`[[${NetworkConfig[input.network].name}]] OmniRegistrarSynchronizer Deployed - ${omniRegistrarSynchronizer.address}`);
//   return omniRegistrarSynchronizer;
// }

// export interface IDeployOmniRegistrarInput extends IDeployInput {
//   Registry: Registry;
//   OmniRegistrarSynchronizer: OmniRegistrarSynchronizer;
// }

// // Omni Registrar
// export async function deployOmniRegistrar(input: IDeployOmniRegistrarInput): Promise<OmniRegistrar> {
//   const OmniRegistrarFactory = await ethers.getContractFactory("OmniRegistrar", input.signer);
//   const _omniRegistrar = await upgrades.deployProxy(OmniRegistrarFactory, [input.Registry.address, input.OmniRegistrarSynchronizer.address]);
//   await _omniRegistrar.deployed();
//   const omniRegistrar = OmniRegistrarFactory.attach(_omniRegistrar.address);
//   console.log(`[[${NetworkConfig[input.network].name}]] OmniRegistrar Deployed - ${omniRegistrar.address}`);
//   return omniRegistrar;
// }

// export interface IDeployOmniRegistrarControllerInput extends IDeployInput {
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
//   console.log(`[[${NetworkConfig[input.network].name}]] OmniRegistrarController Deployed - ${omniRegistrarController.address}`);
//   return omniRegistrarController;
// }
