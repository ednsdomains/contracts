// import hre, { ethers, upgrades } from "hardhat";
// import { Wallet } from "ethers";
// import NetworkConfig, { IConfig, INetworkConfig, Network } from "../../network.config";
// import {deployContractsMultiChain, NETWORKS} from "../../test/helpers/init";
// import { SingletonRegistrar } from "../../typechain";
// import {networkNameConverter} from "../function/networkNameConverter";
//
// //npx hardhat run scripts/test/deploy.ts --network fantomTestnet
// //npx hardhat run scripts/test/deploy.ts --network bnbTestnet
// //npx hardhat run scripts/test/deploy.ts --network rinkeby
// async function deploy() {
//   const TLD = "test";
//   console.log("Deploy to :",networkNameConverter(hre.network.name))
//   const networkConfig = NetworkConfig[networkNameConverter(hre.network.name)]
//
//   const provider = new hre.ethers.providers.JsonRpcProvider(networkConfig.url, {
//     chainId: networkConfig.chainId,
//     name: networkConfig.name,
//   });
//
//   let walletWithProvider = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
//   // let walletMnemonic = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
//   // let walletMnemonic = Wallet.fromMnemonic(process.env.MNEMONIC!,);
//   // walletMnemonic = walletMnemonic.connect(provider);
//   console.log("----------------------------------------------------------------------");
//   console.log(`Deploy to ${hre.network.name}`);
//   const RegistryFactory = await ethers.getContractFactory("Registry", walletWithProvider);
//   const _registry = await upgrades.deployProxy(RegistryFactory);
//   await _registry.deployed();
//   const registry = RegistryFactory.attach(_registry.address);
//   console.log("registry", _registry.address);
//
//   const TokenFactory = await ethers.getContractFactory("Token", walletWithProvider);
//   const _token = await upgrades.deployProxy(TokenFactory, [networkConfig.layerzero.chainId, networkConfig.layerzero.endpoint.address]);
//   const token = TokenFactory.attach(_token.address);
//   console.log("token", _token.address);
//
//   const TokenPriceOracleFactory = await ethers.getContractFactory("TokenPriceOracleMock", walletWithProvider);
//   const tokenPriceOracle = await TokenPriceOracleFactory.deploy(
//       networkConfig.chainlink.token.address,
//       networkConfig.chainlink.token.address,
//     ethers.utils.keccak256(ethers.utils.toUtf8Bytes("0")),
//   );
//   await tokenPriceOracle.deployed();
//   console.log("TokenPriceOracle", tokenPriceOracle.address);
//
//   // Domain Price Oracle
//   const DomainPriceOracleFactory = await ethers.getContractFactory("DomainPriceOracle", walletWithProvider);
//   const _domainPriceOracle = await upgrades.deployProxy(DomainPriceOracleFactory, [tokenPriceOracle.address]);
//   await _domainPriceOracle.deployed();
//   const domainPriceOracle = DomainPriceOracleFactory.attach(_domainPriceOracle.address);
//   console.log("domainPriceOracle", _domainPriceOracle.address);
//
//   const PublicResolverSynchronizerFactory = await ethers.getContractFactory("PublicResolverSynchronizer", walletWithProvider);
//   const _publicResolverSynchronizer = await upgrades.deployProxy(PublicResolverSynchronizerFactory, [
//     networkConfig.layerzero.endpoint.address,
//     networkConfig.layerzero.chainId,
//     [10002, 10012],
//   ]);
//   await _publicResolverSynchronizer.deployed();
//   const publicResolverSynchronizer = PublicResolverSynchronizerFactory.attach(_publicResolverSynchronizer.address);
//   console.log("publicResolverSynchronizer", _publicResolverSynchronizer.address);
//
//   const PublicResolver = await ethers.getContractFactory("PublicResolver", walletWithProvider);
//   const _publicResolver = await upgrades.deployProxy(PublicResolver, [_registry.address, _publicResolverSynchronizer.address], { unsafeAllow: ["delegatecall"] });
//   await _publicResolver.deployed();
//   const publicResolver = PublicResolver.attach(_publicResolver.address);
//   console.log("publicResolver", _publicResolver.address);
//
//   const SingletonRegistrarFactory = await ethers.getContractFactory("SingletonRegistrar", walletWithProvider);
//   const _singletonRegistrar = await upgrades.deployProxy(SingletonRegistrarFactory, [_registry.address]);
//   await _singletonRegistrar.deployed();
//   const singletonRegistrar = SingletonRegistrarFactory.attach(_singletonRegistrar.address);
//   console.log("singletonRegistrar", singletonRegistrar.address);
//
//   const SingletonRegistrarControllerFactory = await ethers.getContractFactory("SingletonRegistrarController", walletWithProvider);
//   const _singletonRegistrarController = await upgrades.deployProxy(SingletonRegistrarControllerFactory, [
//     _token.address,
//     domainPriceOracle.address,
//     tokenPriceOracle.address,
//     singletonRegistrar.address,
//     0, // SLIP-44
//   ]);
//   await _singletonRegistrarController.deployed();
//   const singletonRegistrarController = SingletonRegistrarControllerFactory.attach(_singletonRegistrarController.address);
//   console.log("singletonRegistrarController", _singletonRegistrarController.address);
//
//   const OmniRegistrarSynchronizerFactory = await ethers.getContractFactory("OmniRegistrarSynchronizer", walletWithProvider);
//   const _omniRegistrarSynchronizer = await upgrades.deployProxy(OmniRegistrarSynchronizerFactory, [
//     networkConfig.layerzero.endpoint.address,
//     networkConfig.layerzero.chainId,
//     // [10002, 10012],
//   ]);
//   await _omniRegistrarSynchronizer.deployed();
//   const omniRegistrarSynchronizer = OmniRegistrarSynchronizerFactory.attach(_omniRegistrarSynchronizer.address);
//   console.log("omniRegistrarSynchronizer", _omniRegistrarSynchronizer.address);
//
//   const OmniRegistrarFactory = await ethers.getContractFactory("OmniRegistrar", walletWithProvider);
//   const _omniRegistrar = await upgrades.deployProxy(OmniRegistrarFactory, [registry.address, omniRegistrarSynchronizer.address]);
//   await _omniRegistrar.deployed();
//   const omniRegistrar = OmniRegistrarFactory.attach(_omniRegistrar.address);
//   console.log("omniRegistrar", _omniRegistrar.address);
//
//   const OmniRegistrarControllerFactory = await ethers.getContractFactory("OmniRegistrarController", walletWithProvider);
//   const _omniRegistrarController = await upgrades.deployProxy(OmniRegistrarControllerFactory, [
//     token.address,
//     domainPriceOracle.address,
//     tokenPriceOracle.address,
//     omniRegistrar.address,
//     [0], // SLIP-44
//   ]);
//   await _omniRegistrarController.deployed();
//   const omniRegistrarController = OmniRegistrarControllerFactory.attach(_omniRegistrarController.address);
//   console.log("omniRegistrarController", _omniRegistrarController.address);
//
//   const RootFactory = await ethers.getContractFactory("Root", walletWithProvider);
//   const _root = await upgrades.deployProxy(RootFactory, [
//     registry.address,
//     singletonRegistrar.address,
//     omniRegistrar.address,
//     networkConfig.layerzero.endpoint.address,
//     networkConfig.layerzero.chainId,
//     // [10002, 10012],
//   ]);
//   //TODO Chain ID
//   await _root.deployed();
//   const root = RootFactory.attach(_root.address);
//   console.log("root", _root.address);
//   console.log("root chainId", networkConfig.layerzero.chainId);
//   // Setup
//
//   await publicResolverSynchronizer.setResolver(publicResolver.address);
//   await registry.grantRole(await registry.ROOT_ROLE(), root.address);
//   await registry.grantRole(await registry.PUBLIC_RESOLVER_ROLE(), publicResolver.address);
//   await registry.grantRole(await registry.REGISTRAR_ROLE(), omniRegistrar.address);
//   await registry.grantRole(await registry.REGISTRAR_ROLE(), singletonRegistrar.address);
//
//   await singletonRegistrar.grantRole(await singletonRegistrar.ROOT_ROLE(), root.address);
//   await singletonRegistrar.setBaseURI("https://singleton.example.com");
//   const tld = ethers.utils.toUtf8Bytes("abcdde");
//   await root.setControllerApproval(tld, singletonRegistrarController.address, true);
//
//   const otld = ethers.utils.toUtf8Bytes("omni");
//   await omniRegistrarSynchronizer.setRegistrar(omniRegistrar.address);
//   await omniRegistrar.grantRole(await omniRegistrar.ROOT_ROLE(), root.address);
//   await omniRegistrar.setBaseURI("https://omni.example.com");
//   await root.setControllerApproval(otld, omniRegistrarController.address, true);
//   await root._setPublicResolverAddress(publicResolver.address)
//   console.log("lzEndpoint", networkConfig.layerzero.endpoint.address);
// }
//
// async function deployScriptByMike() {
//   const contracts = await deployContractsMultiChain();
//   console.log(contracts);
// }
// async function main() {
//   await deploy();
//   // await deployScriptByMike()
// }
//
// main().catch((error) => {
//   console.error(error);
//   process.exit(1);
// });
