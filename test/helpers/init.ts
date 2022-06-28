import { Network } from "../../network.config";
import {
  PublicResolver,
  PublicResolverSynchronizer,
  Registry,
  SingletonRegistrar,
  SingletonRegistrarController,
  OmniRegistrar,
  OmniRegistrarController,
  OmniRegistrarSynchronizer,
  LayerZeroEndpointMock,
  DomainPriceOracle,
  TokenPriceOracleMock,
  Token,
  Root,
} from "../../typechain";
import hre, { ethers, upgrades } from "hardhat";
import NetworkConfig from "../../network.config";
import delay from "delay";
import {Wallet} from "ethers";

export const NETWORKS: [Network.RINKEBY, Network.BNB_CHAIN_TESTNET] = [Network.RINKEBY, Network.BNB_CHAIN_TESTNET];

const SINGLETON_TLDS = {
  [Network.RINKEBY]: ["ether"],
  [Network.BNB_CHAIN_TESTNET]: ["bnb"],
};

export const OMNI_TLDS = ["omni"];

export interface IContracts {
  LayerZeroEndpointMock: LayerZeroEndpointMock;
  Token: Token;
  Registry: Registry;
  PublicResolver: PublicResolver;
  PublicResolverSynchronizer: PublicResolverSynchronizer;
  SingletonRegistrar: SingletonRegistrar;
  SingletonRegistrarController: SingletonRegistrarController;
  OmniRegistrar: OmniRegistrar;
  OmniRegistrarSynchronizer: OmniRegistrarSynchronizer;
  OmniRegistrarController: OmniRegistrarController;
  TokenPriceOracle: TokenPriceOracleMock;
  DomainPriceOracle: DomainPriceOracle;
  Root: Root;
}

export interface IDeployedContractsOutput {
  [Network.RINKEBY]: IContracts;
  [Network.BNB_CHAIN_TESTNET]: IContracts;
}

export const deployContracts = async (): Promise<IDeployedContractsOutput> => {
  // @ts-ignore
  const contracts: IDeployContractsOutput = {};

  for (const NETWORK of NETWORKS) {
    // LayerZero Endpoint Mock
    const LayerZeroEndpointMockFactory = await ethers.getContractFactory("LayerZeroEndpointMock");
    const layerZeroEndpointMock = await LayerZeroEndpointMockFactory.deploy(NetworkConfig[NETWORK].layerzero.chainId);
    await layerZeroEndpointMock.deployed();

    // ERC-20 Token
    const TokenFactory = await ethers.getContractFactory("Token");
    const _token = await upgrades.deployProxy(TokenFactory, [NetworkConfig[NETWORK].layerzero.chainId, layerZeroEndpointMock.address]);
    const token = TokenFactory.attach(_token.address);

    // Token Price Oracle (Mock)
    const TokenPriceOracleFactory = await ethers.getContractFactory("TokenPriceOracleMock");
    const tokenPriceOracle = await TokenPriceOracleFactory.deploy(
      NetworkConfig[NETWORK].chainlink.token.address,
      NetworkConfig[NETWORK].chainlink.token.address,
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes("0")),
    );
    await tokenPriceOracle.deployed();

    // Domain Price Oracle
    const DomainPriceOracleFactory = await ethers.getContractFactory("DomainPriceOracle");
    const _domainPriceOracle = await upgrades.deployProxy(DomainPriceOracleFactory, [tokenPriceOracle.address]);
    await _domainPriceOracle.deployed();
    const domainPriceOracle = DomainPriceOracleFactory.attach(_domainPriceOracle.address);

    // Registry
    const RegistryFactory = await ethers.getContractFactory("Registry");
    const _registry = await upgrades.deployProxy(RegistryFactory);
    await _registry.deployed();
    const registry = RegistryFactory.attach(_registry.address);

    // Public Resolver Synchronizer
    const PublicResolverSynchronizerFactory = await ethers.getContractFactory("PublicResolverSynchronizer");
    const _publicResolverSynchronizer = await upgrades.deployProxy(PublicResolverSynchronizerFactory, [
      layerZeroEndpointMock.address,
      NetworkConfig[NETWORK].layerzero.chainId,
      NETWORKS.map((NETWORK_) => NetworkConfig[NETWORK_].layerzero.chainId),
    ]);
    await _publicResolverSynchronizer.deployed();
    const publicResolverSynchronizer = PublicResolverSynchronizerFactory.attach(_publicResolverSynchronizer.address);

    // Public Resolver
    const PublicResolver = await ethers.getContractFactory("PublicResolver");
    const _publicResolver = await upgrades.deployProxy(PublicResolver, [registry.address, publicResolverSynchronizer.address], { unsafeAllow: ["delegatecall"] });
    await _publicResolver.deployed();
    const publicResolver = PublicResolver.attach(_publicResolver.address);

    // Singleton Registrar
    const SingletonRegistrarFactory = await ethers.getContractFactory("SingletonRegistrar");
    const _singletonRegistrar = await upgrades.deployProxy(SingletonRegistrarFactory, [registry.address]);
    await _singletonRegistrar.deployed();
    const singletonRegistrar = SingletonRegistrarFactory.attach(_singletonRegistrar.address);

    // Singleton Registrar Controller
    const SingletonRegistrarControllerFactory = await ethers.getContractFactory("SingletonRegistrarController");
    const _singletonRegistrarController = await upgrades.deployProxy(SingletonRegistrarControllerFactory, [
      token.address,
      domainPriceOracle.address,
      tokenPriceOracle.address,
      singletonRegistrar.address,
      0, // SLIP-44
    ]);
    await _singletonRegistrarController.deployed();
    const singletonRegistrarController = SingletonRegistrarControllerFactory.attach(_singletonRegistrarController.address);

    // Omni Registrar Synchronizer
    const OmniRegistrarSynchronizerFactory = await ethers.getContractFactory("OmniRegistrarSynchronizer");
    const _omniRegistrarSynchronizer = await upgrades.deployProxy(OmniRegistrarSynchronizerFactory, [
      layerZeroEndpointMock.address,
      NetworkConfig[NETWORK].layerzero.chainId,
      NETWORKS.map((NETWORK_) => NetworkConfig[NETWORK_].layerzero.chainId),
    ]);
    await _omniRegistrarSynchronizer.deployed();
    const omniRegistrarSynchronizer = OmniRegistrarSynchronizerFactory.attach(_omniRegistrarSynchronizer.address);

    // Omni Registrar
    const OmniRegistrarFactory = await ethers.getContractFactory("OmniRegistrar");
    const _omniRegistrar = await upgrades.deployProxy(OmniRegistrarFactory, [registry.address, omniRegistrarSynchronizer.address]);
    await _omniRegistrar.deployed();
    const omniRegistrar = OmniRegistrarFactory.attach(_omniRegistrar.address);

    // Omni Registrar Controller
    const OmniRegistrarControllerFactory = await ethers.getContractFactory("OmniRegistrarController");
    const _omniRegistrarController = await upgrades.deployProxy(OmniRegistrarControllerFactory, [
      token.address,
      domainPriceOracle.address,
      tokenPriceOracle.address,
      omniRegistrar.address,
      [0], // SLIP-44
    ]);
    await _omniRegistrarController.deployed();
    const omniRegistrarController = OmniRegistrarControllerFactory.attach(_omniRegistrarController.address);

    // Root
    const RootFactory = await ethers.getContractFactory("Root");
    const _root = await upgrades.deployProxy(RootFactory, [
      registry.address,
      singletonRegistrar.address,
      omniRegistrar.address,
      layerZeroEndpointMock.address,
      NetworkConfig[NETWORK].layerzero.chainId,
      NETWORKS.map((NETWORK_) => NetworkConfig[NETWORK_].layerzero.chainId),
    ]);
    await _root.deployed();
    const root = RootFactory.attach(_root.address);

    const _contracts: IContracts = {
      LayerZeroEndpointMock: layerZeroEndpointMock,
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
    // @ts-ignore
    contracts[NETWORK] = { ..._contracts };
  }
  return contracts;
};

export const setupToken = async (contracts: IDeployedContractsOutput) => {
  for (const NETWORK of NETWORKS) {
    // Set Trust Remote
    for (const _NETWORK of NETWORKS) {
      if (_NETWORK !== NETWORK) {
        await contracts[NETWORK].Token.setTrustedRemote(NetworkConfig[_NETWORK].layerzero.chainId, contracts[_NETWORK].Token.address);
      }
    }
  }
};

export const setupLayerZeroEndpointMock = async (contracts: IDeployedContractsOutput) => {
  for (const NETWORK of NETWORKS) {
    // Set Trust Remote
    for (const _NETWORK of NETWORKS) {
      if (_NETWORK !== NETWORK) {
        await contracts[NETWORK].LayerZeroEndpointMock.setDestLzEndpoint(contracts[_NETWORK].OmniRegistrarSynchronizer.address, contracts[_NETWORK].LayerZeroEndpointMock.address);
        await contracts[NETWORK].LayerZeroEndpointMock.setDestLzEndpoint(contracts[_NETWORK].PublicResolver.address, contracts[_NETWORK].LayerZeroEndpointMock.address);
        await contracts[NETWORK].LayerZeroEndpointMock.setDestLzEndpoint(contracts[_NETWORK].Root.address, contracts[_NETWORK].LayerZeroEndpointMock.address);
      }
    }
  }
};

// TODO:
export const setupDomainPriceOracle = async (contracts: IDeployedContractsOutput) => {};

export const setupPublicResolverSynchronizer = async (contracts: IDeployedContractsOutput) => {
  for (const NETWORK of NETWORKS) {
    // Set Trust Remote
    for (const _NETWORK of NETWORKS) {
      if (_NETWORK !== NETWORK) {
        await contracts[NETWORK].PublicResolverSynchronizer.setTrustedRemote(NetworkConfig[_NETWORK].layerzero.chainId, contracts[_NETWORK].PublicResolverSynchronizer.address);
      }
    }
    // Set the `PublicResolver` address for the `Synchronizer`
    await contracts[NETWORK].PublicResolverSynchronizer.setResolver(contracts[NETWORK].PublicResolver.address);
  }
};

export const setupRegistry = async (contracts: IDeployedContractsOutput) => {
  for (const NETWORK of NETWORKS) {
    await contracts[NETWORK].Registry.grantRole(await contracts[NETWORK].Registry.ROOT_ROLE(), contracts[NETWORK].Root.address);
    await contracts[NETWORK].Registry.grantRole(await contracts[NETWORK].Registry.PUBLIC_RESOLVER_ROLE(), contracts[NETWORK].PublicResolver.address);
    await contracts[NETWORK].Registry.grantRole(await contracts[NETWORK].Registry.REGISTRAR_ROLE(), contracts[NETWORK].SingletonRegistrar.address);
    await contracts[NETWORK].Registry.grantRole(await contracts[NETWORK].Registry.REGISTRAR_ROLE(), contracts[NETWORK].OmniRegistrar.address);
  }
};

export const setupSingletonRegistrar = async (contracts: IDeployedContractsOutput) => {
  for (const NETWORK of NETWORKS) {
    // Grant `ROOT_ROLE` to `Root` contract
    await contracts[NETWORK].SingletonRegistrar.grantRole(await contracts[NETWORK].SingletonRegistrar.ROOT_ROLE(), contracts[NETWORK].Root.address);
    // Set the `baseUrl` for metadata
    await contracts[NETWORK].SingletonRegistrar.setBaseURI("https://singleton.example.com"); // No `/` at the end
  }
};

export const setupSingletonRegistrarController = async (contracts: IDeployedContractsOutput) => {
  for (const NETWORK of NETWORKS) {
    for (const TLD of SINGLETON_TLDS[NETWORK]) {
      const tld = ethers.utils.toUtf8Bytes(TLD);
      // Allow the `SingletonRegistrarController` to register to the `SingletonRegistrar`
      await contracts[NETWORK].Root.setControllerApproval(tld, contracts[NETWORK].SingletonRegistrarController.address, true);
    }
  }
};

export const setupOmniRegistrarSynchronizer = async (contracts: IDeployedContractsOutput) => {
  for (const NETWORK of NETWORKS) {
    // Set Trust Remote
    for (const _NETWORK of NETWORKS) {
      if (_NETWORK !== NETWORK) {
        await contracts[NETWORK].OmniRegistrarSynchronizer.setTrustedRemote(NetworkConfig[_NETWORK].layerzero.chainId, contracts[_NETWORK].OmniRegistrarSynchronizer.address);
      }
    }
    // Set the `OmniRegistrar` address for the `Synchronizer`
    await contracts[NETWORK].OmniRegistrarSynchronizer.setRegistrar(contracts[NETWORK].OmniRegistrar.address);
  }
};

export const setupOmniRegistrar = async (contracts: IDeployedContractsOutput) => {
  for (const NETWORK of NETWORKS) {
    await contracts[NETWORK].OmniRegistrar.grantRole(await contracts[NETWORK].OmniRegistrar.ROOT_ROLE(), contracts[NETWORK].Root.address);
    // Set the `baseUrl` for metadata
    await contracts[NETWORK].OmniRegistrar.setBaseURI("https://omni.example.com"); // No `/` at the end
  }
};

export const setupOmniRegistrarController = async (contracts: IDeployedContractsOutput) => {
  for (const NETWORK of NETWORKS) {
    for (const TLD of OMNI_TLDS) {
      const tld = ethers.utils.toUtf8Bytes(TLD);
      const isTldExists = await contracts[NETWORK].Registry["exists(bytes32)"](ethers.utils.keccak256(tld));
      console.log({ isTldExists, NETWORK, tld: ethers.utils.keccak256(tld), registry: contracts[NETWORK].Registry.address });
      // Allow the `OmniRegistrarController` to register to the `OmniRegistrar`
      await contracts[NETWORK].Root.setControllerApproval(tld, contracts[NETWORK].OmniRegistrarController.address, true);
    }
  }
};

export const setupRoot = async (contracts: IDeployedContractsOutput) => {
  for (const NETWORK of NETWORKS) {
    // Set Trust Remote
    for (const _NETWORK of NETWORKS) {
      if (_NETWORK !== NETWORK) {
        await contracts[NETWORK].Root.setTrustedRemote(NetworkConfig[_NETWORK].layerzero.chainId, contracts[_NETWORK].Root.address);
      }
    }
  }
};

export const setupSingletonTlds = async (contracts: IDeployedContractsOutput) => {
  for (const NETWORK of NETWORKS) {
    for (const TLD of SINGLETON_TLDS[NETWORK]) {
      const tld = ethers.utils.toUtf8Bytes(TLD);
      await contracts[NETWORK].Root.register(tld, contracts[NETWORK].PublicResolver.address, true, false);
    }
  }
};

export const setupOmniTlds = async (contracts: IDeployedContractsOutput) => {
  // for (const NETWORK of NETWORKS) {
  for (const TLD of OMNI_TLDS) {
    const tld = ethers.utils.toUtf8Bytes(TLD);
    await contracts[NETWORKS[0]].Root.register(tld, contracts[NETWORKS[0]].PublicResolver.address, true, true);
    await delay(1000);
    console.log(NETWORKS[0], " ", await contracts[NETWORKS[0]].Registry["exists(bytes32)"](ethers.utils.keccak256(tld)));
    console.log(NETWORKS[1], " ", await contracts[NETWORKS[1]].Registry["exists(bytes32)"](ethers.utils.keccak256(tld)));
  }
  // }
};


export const deployContractsMultiChain = async (): Promise<IDeployedContractsOutput> => {
  // @ts-ignore
  const contracts: IDeployContractsOutput = {};



  for (const NETWORK of NETWORKS) {
    const provider = new hre.ethers.providers.JsonRpcProvider(NetworkConfig[NETWORK].url, {
      chainId: NetworkConfig[NETWORK].chainId,
      name: NetworkConfig[NETWORK].name,
    });

    let walletMnemonic = Wallet.fromMnemonic(process.env.MNEMONIC!);
    walletMnemonic = walletMnemonic.connect(provider);
    // LayerZero Endpoint Mock
    const LayerZeroEndpointMockFactory = await ethers.getContractFactory("LayerZeroEndpointMock",walletMnemonic);
    const layerZeroEndpointMock = await LayerZeroEndpointMockFactory.deploy(NetworkConfig[NETWORK].layerzero.chainId);
    await layerZeroEndpointMock.deployed();

    // ERC-20 Token
    const TokenFactory = await ethers.getContractFactory("Token",walletMnemonic);
    const _token = await upgrades.deployProxy(TokenFactory, [NetworkConfig[NETWORK].layerzero.chainId, layerZeroEndpointMock.address]);
    const token = TokenFactory.attach(_token.address);

    // Token Price Oracle (Mock)
    const TokenPriceOracleFactory = await ethers.getContractFactory("TokenPriceOracleMock",walletMnemonic);
    const tokenPriceOracle = await TokenPriceOracleFactory.deploy(
        NetworkConfig[NETWORK].chainlink.token.address,
        NetworkConfig[NETWORK].chainlink.token.address,
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes("0")),
    );
    await tokenPriceOracle.deployed();

    // Domain Price Oracle
    const DomainPriceOracleFactory = await ethers.getContractFactory("DomainPriceOracle",walletMnemonic);
    const _domainPriceOracle = await upgrades.deployProxy(DomainPriceOracleFactory, [tokenPriceOracle.address]);
    await _domainPriceOracle.deployed();
    const domainPriceOracle = DomainPriceOracleFactory.attach(_domainPriceOracle.address);

    // Registry
    const RegistryFactory = await ethers.getContractFactory("Registry",walletMnemonic);
    const _registry = await upgrades.deployProxy(RegistryFactory);
    await _registry.deployed();
    const registry = RegistryFactory.attach(_registry.address);

    // Public Resolver Synchronizer
    const PublicResolverSynchronizerFactory = await ethers.getContractFactory("PublicResolverSynchronizer",walletMnemonic);
    const _publicResolverSynchronizer = await upgrades.deployProxy(PublicResolverSynchronizerFactory, [
      layerZeroEndpointMock.address,
      NetworkConfig[NETWORK].layerzero.chainId,
      NETWORKS.map((NETWORK_) => NetworkConfig[NETWORK_].layerzero.chainId),
    ]);
    await _publicResolverSynchronizer.deployed();
    const publicResolverSynchronizer = PublicResolverSynchronizerFactory.attach(_publicResolverSynchronizer.address);

    // Public Resolver
    const PublicResolver = await ethers.getContractFactory("PublicResolver",walletMnemonic);
    const _publicResolver = await upgrades.deployProxy(PublicResolver, [registry.address, publicResolverSynchronizer.address], { unsafeAllow: ["delegatecall"] });
    await _publicResolver.deployed();
    const publicResolver = PublicResolver.attach(_publicResolver.address);

    // Singleton Registrar
    const SingletonRegistrarFactory = await ethers.getContractFactory("SingletonRegistrar",walletMnemonic);
    const _singletonRegistrar = await upgrades.deployProxy(SingletonRegistrarFactory, [registry.address]);
    await _singletonRegistrar.deployed();
    const singletonRegistrar = SingletonRegistrarFactory.attach(_singletonRegistrar.address);

    // Singleton Registrar Controller
    const SingletonRegistrarControllerFactory = await ethers.getContractFactory("SingletonRegistrarController",walletMnemonic);
    const _singletonRegistrarController = await upgrades.deployProxy(SingletonRegistrarControllerFactory, [
      token.address,
      domainPriceOracle.address,
      tokenPriceOracle.address,
      singletonRegistrar.address,
      0, // SLIP-44
    ]);
    await _singletonRegistrarController.deployed();
    const singletonRegistrarController = SingletonRegistrarControllerFactory.attach(_singletonRegistrarController.address);

    // Omni Registrar Synchronizer
    const OmniRegistrarSynchronizerFactory = await ethers.getContractFactory("OmniRegistrarSynchronizer",walletMnemonic);
    const _omniRegistrarSynchronizer = await upgrades.deployProxy(OmniRegistrarSynchronizerFactory, [
      layerZeroEndpointMock.address,
      NetworkConfig[NETWORK].layerzero.chainId,
      NETWORKS.map((NETWORK_) => NetworkConfig[NETWORK_].layerzero.chainId),
    ]);
    await _omniRegistrarSynchronizer.deployed();
    const omniRegistrarSynchronizer = OmniRegistrarSynchronizerFactory.attach(_omniRegistrarSynchronizer.address);

    // Omni Registrar
    const OmniRegistrarFactory = await ethers.getContractFactory("OmniRegistrar",walletMnemonic);
    const _omniRegistrar = await upgrades.deployProxy(OmniRegistrarFactory, [registry.address, omniRegistrarSynchronizer.address]);
    await _omniRegistrar.deployed();
    const omniRegistrar = OmniRegistrarFactory.attach(_omniRegistrar.address);

    // Omni Registrar Controller
    const OmniRegistrarControllerFactory = await ethers.getContractFactory("OmniRegistrarController",walletMnemonic);
    const _omniRegistrarController = await upgrades.deployProxy(OmniRegistrarControllerFactory, [
      token.address,
      domainPriceOracle.address,
      tokenPriceOracle.address,
      omniRegistrar.address,
      [0], // SLIP-44
    ]);
    await _omniRegistrarController.deployed();
    const omniRegistrarController = OmniRegistrarControllerFactory.attach(_omniRegistrarController.address);

    // Root
    const RootFactory = await ethers.getContractFactory("Root",walletMnemonic);
    const _root = await upgrades.deployProxy(RootFactory, [
      registry.address,
      singletonRegistrar.address,
      omniRegistrar.address,
      layerZeroEndpointMock.address,
      NetworkConfig[NETWORK].layerzero.chainId,
      NETWORKS.map((NETWORK_) => NetworkConfig[NETWORK_].layerzero.chainId),
    ]);
    await _root.deployed();
    const root = RootFactory.attach(_root.address);

    const _contracts: IContracts = {
      LayerZeroEndpointMock: layerZeroEndpointMock,
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
    // @ts-ignore
    contracts[NETWORK] = { ..._contracts };
  }
  return contracts;
};
