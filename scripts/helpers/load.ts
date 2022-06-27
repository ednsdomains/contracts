import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Network } from "../../network.config";
import Contracts from "../../static/contracts.json";
import { createProvider } from "../helpers/provider";
import { ethers } from "hardhat";
import { IDeployedContracts } from "../interfaces/deployed-contracts";

export interface ILoadInput {
  networks: Network[];
  signer: SignerWithAddress;
}
export const load = async (input: ILoadInput): Promise<IDeployedContracts> => {
  const contracts: IDeployedContracts = {};

  for (const network of input.networks) {
    const provider_ = createProvider(network);
    const signer_ = input.signer.connect(provider_);
    const contracts_ = Contracts[network];

    const TokenFactory = await ethers.getContractFactory("Token", signer_);
    const Token = TokenFactory.attach(contracts_.Token);

    const TokenPriceOracleFactory = await ethers.getContractFactory("TokenPriceOracle", signer_);
    const TokenPriceOracle = TokenPriceOracleFactory.attach(contracts_.TokenPriceOracle);

    // TODO:

    // contracts[network] = {
    //   Token,
    //   Registry,
    //   PublicResolver,
    //   PublicResolverSynchronizer,
    //   SingletonRegistrar,
    //   SingletonRegistrarController,
    //   OmniRegistrar,
    //   OmniRegistrarController,
    //   OmniRegistrarSynchronizer,
    //   TokenPriceOracle,
    //   DomainPriceOracle,
    //   Root,
    // };
  }

  return contracts;
};
