import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Network } from "../../network.config";
import Contracts from "../../static/contracts.json";
import { getProvider } from "./get-provider";
import { ethers } from "hardhat";
import { IDeployedContracts } from "../interfaces/deployed-contracts";
import { IContracts } from "../interfaces/contracts";
import { string } from "hardhat/internal/core/params/argumentTypes";
import { Wallet } from "ethers";

export const fullLoad = async (networks: Network[], signer: SignerWithAddress | Wallet): Promise<IDeployedContracts> => {
  const contracts: IDeployedContracts = {};

  for (const network of networks) {
    const provider_ = getProvider(network);
    const signer_ = signer.connect(provider_);
    const contracts_ = Contracts[network];

    const TokenFactory = await ethers.getContractFactory("Token", signer_);
    const Token = TokenFactory.attach(contracts_.Token);

    const TokenPriceOracleFactory = await ethers.getContractFactory("TokenPriceOracle", signer_);
    const TokenPriceOracle = TokenPriceOracleFactory.attach(contracts_.TokenPriceOracle);

    const DomainPriceOracleFactory = await ethers.getContractFactory("DomainPriceOracle", signer_);
    const DomainPriceOracle = DomainPriceOracleFactory.attach(contracts_.DomainPriceOracle);

    const RegistryFactory = await ethers.getContractFactory("Registry", signer_);
    const Registry = RegistryFactory.attach(contracts_.Registry);

    const PublicResolverSynchronizerFactory = await ethers.getContractFactory("PublicResolverSynchronizer", signer_);
    const PublicResolverSynchronizer = PublicResolverSynchronizerFactory.attach(contracts_.PublicResolverSynchronizer);

    const PublicResolverFactory = await ethers.getContractFactory("PublicResolver", signer_);
    const PublicResolver = PublicResolverFactory.attach(contracts_.PublicResolver);

    const SingletonRegistrarFactory = await ethers.getContractFactory("SingletonRegistrar", signer_);
    const SingletonRegistrar = SingletonRegistrarFactory.attach(contracts_.SingletonRegistrar);

    const SingletonRegistrarControllerFactory = await ethers.getContractFactory("SingletonRegistrarController", signer_);
    const SingletonRegistrarController = SingletonRegistrarControllerFactory.attach(contracts_.SingletonRegistrarController);

    const OmniRegistrarSynchronizerFactory = await ethers.getContractFactory("OmniRegistrarSynchronizer", signer_);
    const OmniRegistrarSynchronizer = OmniRegistrarSynchronizerFactory.attach(contracts_.OmniRegistrarSynchronizer);

    const OmniRegistrarFactory = await ethers.getContractFactory("OmniRegistrar", signer_);
    const OmniRegistrar = OmniRegistrarFactory.attach(contracts_.OmniRegistrar);

    const OmniRegistrarControllerFactory = await ethers.getContractFactory("OmniRegistrarController", signer_);
    const OmniRegistrarController = OmniRegistrarControllerFactory.attach(contracts_.OmniRegistrarController);

    const RootFactory = await ethers.getContractFactory("Root", signer_);
    const Root = RootFactory.attach(contracts_.Root);

    contracts[network] = {
      Token,
      Registry,
      PublicResolver,
      PublicResolverSynchronizer,
      SingletonRegistrar,
      SingletonRegistrarController,
      OmniRegistrar,
      OmniRegistrarController,
      OmniRegistrarSynchronizer,
      TokenPriceOracle,
      DomainPriceOracle,
      Root,
    };
  }

  return contracts;
};

export async function load(network: Network, signer: SignerWithAddress | Wallet): Promise<IContracts> {
  const contracts_ = Contracts[network];

  const TokenFactory = await ethers.getContractFactory("Token", signer);
  const Token = TokenFactory.attach(contracts_.Token);

  const TokenPriceOracleFactory = await ethers.getContractFactory("TokenPriceOracle", signer);
  const TokenPriceOracle = TokenPriceOracleFactory.attach(contracts_.TokenPriceOracle);

  const DomainPriceOracleFactory = await ethers.getContractFactory("DomainPriceOracle", signer);
  const DomainPriceOracle = DomainPriceOracleFactory.attach(contracts_.DomainPriceOracle);

  const RegistryFactory = await ethers.getContractFactory("Registry", signer);
  const Registry = RegistryFactory.attach(contracts_.Registry);

  const PublicResolverSynchronizerFactory = await ethers.getContractFactory("PublicResolverSynchronizer", signer);
  const PublicResolverSynchronizer = PublicResolverSynchronizerFactory.attach(contracts_.PublicResolverSynchronizer);

  const PublicResolverFactory = await ethers.getContractFactory("PublicResolver", signer);
  const PublicResolver = PublicResolverFactory.attach(contracts_.PublicResolver);

  const SingletonRegistrarFactory = await ethers.getContractFactory("SingletonRegistrar", signer);
  const SingletonRegistrar = SingletonRegistrarFactory.attach(contracts_.SingletonRegistrar);

  const SingletonRegistrarControllerFactory = await ethers.getContractFactory("SingletonRegistrarController", signer);
  const SingletonRegistrarController = SingletonRegistrarControllerFactory.attach(contracts_.SingletonRegistrarController);

  const OmniRegistrarSynchronizerFactory = await ethers.getContractFactory("OmniRegistrarSynchronizer", signer);
  const OmniRegistrarSynchronizer = OmniRegistrarSynchronizerFactory.attach(contracts_.OmniRegistrarSynchronizer);

  const OmniRegistrarFactory = await ethers.getContractFactory("OmniRegistrar", signer);
  const OmniRegistrar = OmniRegistrarFactory.attach(contracts_.OmniRegistrar);

  const OmniRegistrarControllerFactory = await ethers.getContractFactory("OmniRegistrarController", signer);
  const OmniRegistrarController = OmniRegistrarControllerFactory.attach(contracts_.OmniRegistrarController);

  const RootFactory = await ethers.getContractFactory("Root", signer);
  const Root = RootFactory.attach(contracts_.Root);

  return {
    Token,
    Registry,
    PublicResolver,
    PublicResolverSynchronizer,
    SingletonRegistrar,
    SingletonRegistrarController,
    OmniRegistrar,
    OmniRegistrarController,
    OmniRegistrarSynchronizer,
    TokenPriceOracle,
    DomainPriceOracle,
    Root,
  };
}
