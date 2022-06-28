import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import NetworkConfig, { Network } from "../../network.config";
import { IContracts } from "../interfaces/contracts";

export interface IDeployInput {
  signer: SignerWithAddress;
  network: Network;
  networks: Network[];
}

export async function deploy(input: IDeployInput): Promise<IContracts> {
  // ERC-20 Token
  const TokenFactory = await ethers.getContractFactory("Token", input.signer);
  const _token = await upgrades.deployProxy(TokenFactory, [NetworkConfig[input.network].layerzero.chainId, NetworkConfig[input.network].layerzero.endpoint.address]);
  const token = TokenFactory.attach(_token.address);
  console.log(`[[${NetworkConfig[input.network].name}]] Token Deployed - ${token.address}`);

  // Token Price Oracle
  const TokenPriceOracleFactory = await ethers.getContractFactory("TokenPriceOracle", input.signer);
  const tokenPriceOracle = await TokenPriceOracleFactory.deploy(
    NetworkConfig[input.network].chainlink.token.address,
    NetworkConfig[input.network].chainlink.token.address, // TODO: Chainlink Oracle Address
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes("0")), // TODO: Chainlink Job ID
  );
  await tokenPriceOracle.deployed();
  console.log(`[[${NetworkConfig[input.network].name}]] TokenPriceOracle Deployed - ${tokenPriceOracle.address}`);

  // Domain Price Oracle
  const DomainPriceOracleFactory = await ethers.getContractFactory("DomainPriceOracle", input.signer);
  const _domainPriceOracle = await upgrades.deployProxy(DomainPriceOracleFactory, [tokenPriceOracle.address]);
  await _domainPriceOracle.deployed();
  const domainPriceOracle = DomainPriceOracleFactory.attach(_domainPriceOracle.address);
  console.log(`[[${NetworkConfig[input.network].name}]] DomainPriceOracle Deployed - ${domainPriceOracle.address}`);

  // Registry
  const RegistryFactory = await ethers.getContractFactory("Registry", input.signer);
  const _registry = await upgrades.deployProxy(RegistryFactory);
  await _registry.deployed();
  const registry = RegistryFactory.attach(_registry.address);
  console.log(`[[${NetworkConfig[input.network].name}]] Registry Deployed - ${registry.address}`);

  // Public Resolver Synchronizer
  const PublicResolverSynchronizerFactory = await ethers.getContractFactory("PublicResolverSynchronizer", input.signer);
  const _publicResolverSynchronizer = await upgrades.deployProxy(PublicResolverSynchronizerFactory, [
    NetworkConfig[input.network].layerzero.endpoint.address,
    NetworkConfig[input.network].layerzero.chainId,
    input.networks.map((network_) => NetworkConfig[network_].layerzero.chainId),
  ]);
  await _publicResolverSynchronizer.deployed();
  const publicResolverSynchronizer = PublicResolverSynchronizerFactory.attach(_publicResolverSynchronizer.address);
  console.log(`[[${NetworkConfig[input.network].name}]] PublicResolverSynchronizer Deployed - ${publicResolverSynchronizer.address}`);

  // Public Resolver
  const PublicResolver = await ethers.getContractFactory("PublicResolver", input.signer);
  const _publicResolver = await upgrades.deployProxy(PublicResolver, [registry.address, publicResolverSynchronizer.address], { unsafeAllow: ["delegatecall"] });
  await _publicResolver.deployed();
  const publicResolver = PublicResolver.attach(_publicResolver.address);
  console.log(`[[${NetworkConfig[input.network].name}]] PublicResolver Deployed - ${publicResolver.address}`);

  // Singleton Registrar
  const SingletonRegistrarFactory = await ethers.getContractFactory("SingletonRegistrar", input.signer);
  const _singletonRegistrar = await upgrades.deployProxy(SingletonRegistrarFactory, [registry.address]);
  await _singletonRegistrar.deployed();
  const singletonRegistrar = SingletonRegistrarFactory.attach(_singletonRegistrar.address);
  console.log(`[[${NetworkConfig[input.network].name}]] SingletonRegistrar Deployed - ${singletonRegistrar.address}`);

  // Singleton Registrar Controller
  const SingletonRegistrarControllerFactory = await ethers.getContractFactory("SingletonRegistrarController", input.signer);
  const _singletonRegistrarController = await upgrades.deployProxy(SingletonRegistrarControllerFactory, [
    token.address,
    domainPriceOracle.address,
    tokenPriceOracle.address,
    singletonRegistrar.address,
    NetworkConfig[input.network].slip44.coinId,
  ]);
  await _singletonRegistrarController.deployed();
  const singletonRegistrarController = SingletonRegistrarControllerFactory.attach(_singletonRegistrarController.address);
  console.log(`[[${NetworkConfig[input.network].name}]] SingletonRegistrarController Deployed - ${singletonRegistrarController.address}`);

  // Omni Registrar Synchronizer
  const OmniRegistrarSynchronizerFactory = await ethers.getContractFactory("OmniRegistrarSynchronizer", input.signer);
  const _omniRegistrarSynchronizer = await upgrades.deployProxy(OmniRegistrarSynchronizerFactory, [
    NetworkConfig[input.network].layerzero.endpoint.address,
    NetworkConfig[input.network].layerzero.chainId,
    input.networks.map((network_) => NetworkConfig[network_].layerzero.chainId),
  ]);
  await _omniRegistrarSynchronizer.deployed();
  const omniRegistrarSynchronizer = OmniRegistrarSynchronizerFactory.attach(_omniRegistrarSynchronizer.address);
  console.log(`[[${NetworkConfig[input.network].name}]] OmniRegistrarSynchronizer Deployed - ${omniRegistrarSynchronizer.address}`);

  // Omni Registrar
  const OmniRegistrarFactory = await ethers.getContractFactory("OmniRegistrar", input.signer);
  const _omniRegistrar = await upgrades.deployProxy(OmniRegistrarFactory, [registry.address, omniRegistrarSynchronizer.address]);
  await _omniRegistrar.deployed();
  const omniRegistrar = OmniRegistrarFactory.attach(_omniRegistrar.address);
  console.log(`[[${NetworkConfig[input.network].name}]] OmniRegistrar Deployed - ${omniRegistrar.address}`);

  // Omni Registrar Controller
  const OmniRegistrarControllerFactory = await ethers.getContractFactory("OmniRegistrarController", input.signer);
  const _omniRegistrarController = await upgrades.deployProxy(OmniRegistrarControllerFactory, [
    token.address,
    domainPriceOracle.address,
    tokenPriceOracle.address,
    omniRegistrar.address,
    input.networks.map((network_) => NetworkConfig[network_].slip44.coinId),
  ]);
  await _omniRegistrarController.deployed();
  const omniRegistrarController = OmniRegistrarControllerFactory.attach(_omniRegistrarController.address);
  console.log(`[[${NetworkConfig[input.network].name}]] OmniRegistrarController Deployed - ${omniRegistrarController.address}`);

  // Root
  const RootFactory = await ethers.getContractFactory("Root", input.signer);
  const _root = await upgrades.deployProxy(RootFactory, [
    registry.address,
    singletonRegistrar.address,
    omniRegistrar.address,
    NetworkConfig[input.network].layerzero.endpoint.address,
    NetworkConfig[input.network].layerzero.chainId,
    input.networks.map((network_) => NetworkConfig[network_].layerzero.chainId),
  ]);
  await _root.deployed();
  const root = RootFactory.attach(_root.address);
  console.log(`[[${NetworkConfig[input.network].name}]] Root Deployed - ${root.address}`);

  return {
    Token: token,
    Registry: registry,
    PublicResolver: publicResolver,
    PublicResolverSynchronizer: publicResolverSynchronizer,
    SingletonRegistrar: singletonRegistrar,
    SingletonRegistrarController: singletonRegistrarController,
    OmniRegistrar: omniRegistrar,
    OmniRegistrarController: omniRegistrarController,
    OmniRegistrarSynchronizer: omniRegistrarSynchronizer,
    TokenPriceOracle: tokenPriceOracle,
    DomainPriceOracle: domainPriceOracle,
    Root: root,
  };
}
