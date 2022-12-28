import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Network } from "../../network.config";
import Contracts from "../../static/contracts.json";
import { getProvider } from "./get-provider";
import { ethers } from "hardhat";
import { IDeployedContracts } from "../interfaces/deployed-contracts";
import { IContracts } from "../interfaces/contracts";
import { Wallet } from "ethers";

export async function getContracts(network: Network, signer: SignerWithAddress | Wallet): Promise<IContracts> {
  const contracts_ = Contracts[network];

  const TokenFactory = await ethers.getContractFactory("Token", signer);
  const Token = TokenFactory.attach(contracts_.Token);

  const TokenPriceOracleFactory = await ethers.getContractFactory("TokenPriceOracle", signer);
  const TokenPriceOracle = TokenPriceOracleFactory.attach(contracts_.TokenPriceOracle);

  const DomainPriceOracleFactory = await ethers.getContractFactory("DomainPriceOracle", signer);
  const DomainPriceOracle = DomainPriceOracleFactory.attach(contracts_.DomainPriceOracle);

  const RegistryFactory = await ethers.getContractFactory("Registry", signer);
  const Registry = RegistryFactory.attach(contracts_.Registry);

  const PublicResolverFactory = await ethers.getContractFactory("PublicResolver", signer);
  const PublicResolver = PublicResolverFactory.attach(contracts_.PublicResolver);

  const BaseRegistrarFactory = await ethers.getContractFactory("Registrar", signer);
  const Registrar = BaseRegistrarFactory.attach(contracts_.Registrar);

  const ClassicalRegistrarControllerFactory = await ethers.getContractFactory("ClassicalRegistrarController", signer);
  const ClassicalRegistrarController = ClassicalRegistrarControllerFactory.attach(contracts_.ClassicalRegistrarController);

  // const SingletonRegistrarControllerFactory = await ethers.getContractFactory("SingletonRegistrarController", signer);
  // const SingletonRegistrarController = SingletonRegistrarControllerFactory.attach(contracts_.SingletonRegistrarController);

  const RootFactory = await ethers.getContractFactory("Root", signer);
  const Root = RootFactory.attach(contracts_.Root);

  return {
    Registry,
    PublicResolver,
    Registrar,
    ClassicalRegistrarController,
    Root,
  };
}
