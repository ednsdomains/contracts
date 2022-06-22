import hre, { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import NetworkConfig, { Network, Mainnets, Testnets } from "../network.config";

async function deploy(signer: SignerWithAddress, NETWORK: Network) {
  const provider = new hre.ethers.providers.JsonRpcProvider(NetworkConfig.network[NETWORK].url, {
    chainId: NetworkConfig.network[NETWORK].chainId,
    name: NetworkConfig.network[NETWORK].name,
  });

  const _signer = signer.connect(provider);
  console.log(`[${NetworkConfig.network[NETWORK].name}] Wallet Balance: ${hre.ethers.utils.formatEther(await _signer.getBalance())} ${NetworkConfig.network[NETWORK].symbol}`);

  // ERC-20 Token
  const TokenFactory = await ethers.getContractFactory("Token", _signer);
  const _token = await upgrades.deployProxy(TokenFactory, [NetworkConfig.network[NETWORK].layerzero.chainId, NetworkConfig.network[NETWORK].layerzero.endpoint.address]);
  const token = TokenFactory.attach(_token.address);
  console.log(`[[${NetworkConfig.network[NETWORK].name}]] Token Deployed - ${token.address}`);

  // Token Price Oracle
  const TokenPriceOracleFactory = await ethers.getContractFactory("TokenPriceOracle");
  const tokenPriceOracle = await TokenPriceOracleFactory.deploy(
    NetworkConfig.network[NETWORK].chainlink.token.address,
    NetworkConfig.network[NETWORK].chainlink.token.address, // TODO:
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes("0")), // TODO:
  );
  await tokenPriceOracle.deployed();
  console.log(`[[${NetworkConfig.network[NETWORK].name}]] TokenPriceOracle Deployed - ${tokenPriceOracle.address}`);

  // Domain Price Oracle
  const DomainPriceOracleFactory = await ethers.getContractFactory("DomainPriceOracle");
  const _domainPriceOracle = await upgrades.deployProxy(DomainPriceOracleFactory, [tokenPriceOracle.address]);
  await _domainPriceOracle.deployed();
  const domainPriceOracle = DomainPriceOracleFactory.attach(_domainPriceOracle.address);
  console.log(`[[${NetworkConfig.network[NETWORK].name}]] DomainPriceOracle Deployed - ${domainPriceOracle.address}`);

  // Registry
  const RegistryFactory = await ethers.getContractFactory("Registry");
  const _registry = await upgrades.deployProxy(RegistryFactory);
  await _registry.deployed();
  const registry = RegistryFactory.attach(_registry.address);

  // Public Resolver Synchronizer
  const PublicResolverSynchronizerFactory = await ethers.getContractFactory("PublicResolverSynchronizer");
  const _publicResolverSynchronizer = await upgrades.deployProxy(PublicResolverSynchronizerFactory, [
    NetworkConfig.network[NETWORK].layerzero.endpoint.address,
    NetworkConfig.network[NETWORK].layerzero.chainId,
    NETWORKS.map((NETWORK_) => NetworkConfig.network[NETWORK_].layerzero.chainId),
  ]);
  await _publicResolverSynchronizer.deployed();
  const publicResolverSynchronizer = PublicResolverSynchronizerFactory.attach(_publicResolverSynchronizer.address);
  console.log(`[[${NetworkConfig.network[NETWORK].name}]] PublicResolverSynchronizer Deployed - ${publicResolverSynchronizer.address}`);

  // Public Resolver
  const PublicResolver = await ethers.getContractFactory("PublicResolver");
  const _publicResolver = await upgrades.deployProxy(PublicResolver, [registry.address, publicResolverSynchronizer.address], { unsafeAllow: ["delegatecall"] });
  await _publicResolver.deployed();
  const publicResolver = PublicResolver.attach(_publicResolver.address);
  console.log(`[[${NetworkConfig.network[NETWORK].name}]] PublicResolver Deployed - ${publicResolver.address}`);

  // Singleton Registrar
  const SingletonRegistrarFactory = await ethers.getContractFactory("SingletonRegistrar");
  const _singletonRegistrar = await upgrades.deployProxy(SingletonRegistrarFactory, [registry.address]);
  await _singletonRegistrar.deployed();
  const singletonRegistrar = SingletonRegistrarFactory.attach(_singletonRegistrar.address);
  console.log(`[[${NetworkConfig.network[NETWORK].name}]] SingletonRegistrar Deployed - ${singletonRegistrar.address}`);

  // Singleton Registrar Controller
  const SingletonRegistrarControllerFactory = await ethers.getContractFactory("SingletonRegistrarController");
  const _singletonRegistrarController = await upgrades.deployProxy(SingletonRegistrarControllerFactory, [
    token.address,
    domainPriceOracle.address,
    tokenPriceOracle.address,
    singletonRegistrar.address,
    NetworkConfig.network[NETWORK].slip44.coinId,
  ]);
  await _singletonRegistrarController.deployed();
  const singletonRegistrarController = SingletonRegistrarControllerFactory.attach(_singletonRegistrarController.address);
  console.log(`[[${NetworkConfig.network[NETWORK].name}]] SingletonRegistrarController Deployed - ${singletonRegistrarController.address}`);

  // Omni Registrar Synchronizer
  const OmniRegistrarSynchronizerFactory = await ethers.getContractFactory("OmniRegistrarSynchronizer");
  const _omniRegistrarSynchronizer = await upgrades.deployProxy(OmniRegistrarSynchronizerFactory, [
    NetworkConfig.network[NETWORK].chainlink.token.address,
    NetworkConfig.network[NETWORK].layerzero.chainId,
    NETWORKS.map((NETWORK_) => NetworkConfig.network[NETWORK_].layerzero.chainId),
  ]);
  await _omniRegistrarSynchronizer.deployed();
  const omniRegistrarSynchronizer = OmniRegistrarSynchronizerFactory.attach(_omniRegistrarSynchronizer.address);
  console.log(`[[${NetworkConfig.network[NETWORK].name}]] OmniRegistrarSynchronizer Deployed - ${omniRegistrarSynchronizer.address}`);

  // Omni Registrar
  const OmniRegistrarFactory = await ethers.getContractFactory("OmniRegistrar");
  const _omniRegistrar = await upgrades.deployProxy(OmniRegistrarFactory, [registry.address, omniRegistrarSynchronizer.address]);
  await _omniRegistrar.deployed();
  const omniRegistrar = OmniRegistrarFactory.attach(_omniRegistrar.address);
  console.log(`[[${NetworkConfig.network[NETWORK].name}]] OmniRegistrar Deployed - ${omniRegistrar.address}`);

  // Omni Registrar Controller
  const OmniRegistrarControllerFactory = await ethers.getContractFactory("OmniRegistrarController");
  const _omniRegistrarController = await upgrades.deployProxy(OmniRegistrarControllerFactory, [
    token.address,
    domainPriceOracle.address,
    tokenPriceOracle.address,
    omniRegistrar.address,
    NETWORKS.map((NETWORK_) => NetworkConfig.network[NETWORK_].slip44.coinId),
  ]);
  await _omniRegistrarController.deployed();
  const omniRegistrarController = OmniRegistrarControllerFactory.attach(_omniRegistrarController.address);
  console.log(`[[${NetworkConfig.network[NETWORK].name}]] OmniRegistrarController Deployed - ${omniRegistrarController.address}`);

  // Root
  const RootFactory = await ethers.getContractFactory("Root");
  const _root = await upgrades.deployProxy(RootFactory, [
    registry.address,
    singletonRegistrar.address,
    omniRegistrar.address,
    NetworkConfig.network[NETWORK].chainlink.token.address,
    NetworkConfig.network[NETWORK].layerzero.chainId,
    NETWORKS.map((NETWORK_) => NetworkConfig.network[NETWORK_].layerzero.chainId),
  ]);
  await _root.deployed();
  const root = RootFactory.attach(_root.address);
  console.log(`[[${NetworkConfig.network[NETWORK].name}]] Root Deployed - ${root.address}`);
}

async function setupRoles() {}

async function verifyEtherscan(address: string) {
  await hre.run("verify:verify", { address });
}

const NETWORKS = Testnets;

async function main() {
  const [signer] = await ethers.getSigners();

  for (const NETWORK of NETWORKS) {
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
