import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import NetworkConfig, { Network } from "../../network.config";
import {
  DomainPriceOracle,
  OmniRegistrar,
  OmniRegistrarController,
  OmniRegistrarSynchronizer,
  PublicResolver,
  PublicResolverSynchronizer,
  Registry,
  Root,
  SingletonRegistrar,
  SingletonRegistrarController,
  Token,
  TokenPriceOracle,
} from "../../typechain";

export interface IDeployInput {
  signer: SignerWithAddress;
  network: Network;
  networks: Network[];
}

// ERC-20 Token
export async function deployToken(input: IDeployInput): Promise<Token> {
  const TokenFactory = await ethers.getContractFactory("Token", input.signer);
  const _token = await upgrades.deployProxy(TokenFactory, [NetworkConfig[input.network].layerzero.chainId, NetworkConfig[input.network].layerzero.endpoint.address]);
  const token = TokenFactory.attach(_token.address);
  console.log(`[[${NetworkConfig[input.network].name}]] Token Deployed - ${token.address}`);
  return token;
}

// Token Price Oracle
export async function deployTokenPriceOracle(input: IDeployInput): Promise<TokenPriceOracle> {
  const TokenPriceOracleFactory = await ethers.getContractFactory("TokenPriceOracle", input.signer);
  const tokenPriceOracle = await TokenPriceOracleFactory.deploy(
    NetworkConfig[input.network].chainlink.token.address,
    NetworkConfig[input.network].chainlink.token.address, // TODO: Chainlink Oracle Address
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes("0")), // TODO: Chainlink Job ID
  );
  await tokenPriceOracle.deployed();
  console.log(`[[${NetworkConfig[input.network].name}]] TokenPriceOracle Deployed - ${tokenPriceOracle.address}`);
  return tokenPriceOracle;
}

export interface IDeployTokenPriceOracleInput extends IDeployInput {
  TokenPriceOracle: TokenPriceOracle;
}

// Domain Price Oracle
export async function deployDomainPriceOracle(input: IDeployTokenPriceOracleInput): Promise<DomainPriceOracle> {
  const DomainPriceOracleFactory = await ethers.getContractFactory("DomainPriceOracle", input.signer);
  const _domainPriceOracle = await upgrades.deployProxy(DomainPriceOracleFactory, [input.TokenPriceOracle.address]);
  await _domainPriceOracle.deployed();
  const domainPriceOracle = DomainPriceOracleFactory.attach(_domainPriceOracle.address);
  console.log(`[[${NetworkConfig[input.network].name}]] DomainPriceOracle Deployed - ${domainPriceOracle.address}`);
  return domainPriceOracle;
}

// Registry
export async function deployRegistry(input: IDeployInput): Promise<Registry> {
  const RegistryFactory = await ethers.getContractFactory("Registry", input.signer);
  const _registry = await upgrades.deployProxy(RegistryFactory);
  await _registry.deployed();
  const registry = RegistryFactory.attach(_registry.address);
  console.log(`[[${NetworkConfig[input.network].name}]] Registry Deployed - ${registry.address}`);
  return registry;
}

// Public Resolver Synchronizer
export async function deployPublicResolverSynchronizer(input: IDeployInput): Promise<PublicResolverSynchronizer> {
  const PublicResolverSynchronizerFactory = await ethers.getContractFactory("PublicResolverSynchronizer", input.signer);
  const _publicResolverSynchronizer = await upgrades.deployProxy(PublicResolverSynchronizerFactory, [
    NetworkConfig[input.network].layerzero.endpoint.address,
    NetworkConfig[input.network].layerzero.chainId,
    input.networks.map((network_) => NetworkConfig[network_].layerzero.chainId),
  ]);
  await _publicResolverSynchronizer.deployed();
  const publicResolverSynchronizer = PublicResolverSynchronizerFactory.attach(_publicResolverSynchronizer.address);
  console.log(`[[${NetworkConfig[input.network].name}]] PublicResolverSynchronizer Deployed - ${publicResolverSynchronizer.address}`);
  return publicResolverSynchronizer;
}

export interface IDeployPublicResolverInput extends IDeployInput {
  Registry: Registry;
  PublicResolverSynchronizer: PublicResolverSynchronizer;
}

// Public Resolver
export async function deployPublicResolver(input: IDeployPublicResolverInput): Promise<PublicResolver> {
  const PublicResolverFactory = await ethers.getContractFactory("PublicResolver", input.signer);
  const _publicResolver = await upgrades.deployProxy(PublicResolverFactory, [input.Registry.address, input.PublicResolverSynchronizer.address], { unsafeAllow: ["delegatecall"] });
  await _publicResolver.deployed();
  const publicResolver = PublicResolverFactory.attach(_publicResolver.address);
  console.log(`[[${NetworkConfig[input.network].name}]] PublicResolver Deployed - ${publicResolver.address}`);
  return publicResolver;
}

export interface IDeploySingletonRegistrarInput extends IDeployInput {
  Registry: Registry;
}

// Singleton Registrar
export async function deploySingletonRegistrar(input: IDeploySingletonRegistrarInput): Promise<SingletonRegistrar> {
  const SingletonRegistrarFactory = await ethers.getContractFactory("SingletonRegistrar", input.signer);
  const _singletonRegistrar = await upgrades.deployProxy(SingletonRegistrarFactory, [input.Registry.address]);
  await _singletonRegistrar.deployed();
  const singletonRegistrar = SingletonRegistrarFactory.attach(_singletonRegistrar.address);
  console.log(`[[${NetworkConfig[input.network].name}]] SingletonRegistrar Deployed - ${singletonRegistrar.address}`);
  return singletonRegistrar;
}

export interface IDeploySingletonRegistrarControllerInput extends IDeployInput {
  Token: Token;
  DomainPriceOracle: DomainPriceOracle;
  TokenPriceOracle: TokenPriceOracle;
  SingletonRegistrar: SingletonRegistrar;
}

// Singleton Registrar Controller
export async function deploySingletonRegistrarController(input: IDeploySingletonRegistrarControllerInput): Promise<SingletonRegistrarController> {
  const SingletonRegistrarControllerFactory = await ethers.getContractFactory("SingletonRegistrarController", input.signer);
  const _singletonRegistrarController = await upgrades.deployProxy(SingletonRegistrarControllerFactory, [
    input.Token.address,
    input.DomainPriceOracle.address,
    input.TokenPriceOracle.address,
    input.SingletonRegistrar.address,
    NetworkConfig[input.network].slip44.coinId,
  ]);
  await _singletonRegistrarController.deployed();
  const singletonRegistrarController = SingletonRegistrarControllerFactory.attach(_singletonRegistrarController.address);
  console.log(`[[${NetworkConfig[input.network].name}]] SingletonRegistrarController Deployed - ${singletonRegistrarController.address}`);
  return singletonRegistrarController;
}

// Omni Registrar Synchronizer
export async function deployOmniRegistrarSynchronizer(input: IDeployInput): Promise<OmniRegistrarSynchronizer> {
  const OmniRegistrarSynchronizerFactory = await ethers.getContractFactory("OmniRegistrarSynchronizer", input.signer);
  const _omniRegistrarSynchronizer = await upgrades.deployProxy(OmniRegistrarSynchronizerFactory, [
    NetworkConfig[input.network].layerzero.endpoint.address,
    NetworkConfig[input.network].layerzero.chainId,
    input.networks.map((network_) => NetworkConfig[network_].layerzero.chainId),
  ]);
  await _omniRegistrarSynchronizer.deployed();
  const omniRegistrarSynchronizer = OmniRegistrarSynchronizerFactory.attach(_omniRegistrarSynchronizer.address);
  console.log(`[[${NetworkConfig[input.network].name}]] OmniRegistrarSynchronizer Deployed - ${omniRegistrarSynchronizer.address}`);
  return omniRegistrarSynchronizer;
}

export interface IDeployOmniRegistrarInput extends IDeployInput {
  Registry: Registry;
  OmniRegistrarSynchronizer: OmniRegistrarSynchronizer;
}

// Omni Registrar
export async function deployOmniRegistrar(input: IDeployOmniRegistrarInput): Promise<OmniRegistrar> {
  const OmniRegistrarFactory = await ethers.getContractFactory("OmniRegistrar", input.signer);
  const _omniRegistrar = await upgrades.deployProxy(OmniRegistrarFactory, [input.Registry.address, input.OmniRegistrarSynchronizer.address]);
  await _omniRegistrar.deployed();
  const omniRegistrar = OmniRegistrarFactory.attach(_omniRegistrar.address);
  console.log(`[[${NetworkConfig[input.network].name}]] OmniRegistrar Deployed - ${omniRegistrar.address}`);
  return omniRegistrar;
}

export interface IDeployOmniRegistrarControllerInput extends IDeployInput {
  Token: Token;
  DomainPriceOracle: DomainPriceOracle;
  TokenPriceOracle: TokenPriceOracle;
  OmniRegistrar: OmniRegistrar;
}

// Omni Registrar Controller
export async function deployOmniRegistrarControllers(input: IDeployOmniRegistrarControllerInput): Promise<OmniRegistrarController> {
  const OmniRegistrarControllerFactory = await ethers.getContractFactory("OmniRegistrarController", input.signer);
  const _omniRegistrarController = await upgrades.deployProxy(OmniRegistrarControllerFactory, [
    input.Token.address,
    input.DomainPriceOracle.address,
    input.TokenPriceOracle.address,
    input.OmniRegistrar.address,
    input.networks.map((network_) => NetworkConfig[network_].slip44.coinId),
  ]);
  await _omniRegistrarController.deployed();
  const omniRegistrarController = OmniRegistrarControllerFactory.attach(_omniRegistrarController.address);
  console.log(`[[${NetworkConfig[input.network].name}]] OmniRegistrarController Deployed - ${omniRegistrarController.address}`);
  return omniRegistrarController;
}

export interface IDeployRootInput extends IDeployInput {
  Registry: Registry;
  SingletonRegistrar: SingletonRegistrar;
  OmniRegistrar: OmniRegistrar;
}

// Root
export async function deployRoot(input: IDeployRootInput): Promise<Root> {
  const RootFactory = await ethers.getContractFactory("Root", input.signer);
  const _root = await upgrades.deployProxy(RootFactory, [
    input.Registry.address,
    input.SingletonRegistrar.address,
    input.OmniRegistrar.address,
    NetworkConfig[input.network].layerzero.endpoint.address,
    NetworkConfig[input.network].layerzero.chainId,
    input.networks.map((network_) => NetworkConfig[network_].layerzero.chainId),
  ]);
  await _root.deployed();
  const root = RootFactory.attach(_root.address);
  console.log(`[[${NetworkConfig[input.network].name}]] Root Deployed - ${root.address}`);
  return root;
}

export const deployedChain = [Network.RINKEBY, Network.BNB_CHAIN_TESTNET];
