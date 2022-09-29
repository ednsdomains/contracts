import { ethers } from "hardhat";
import NetworkConfig, { Network } from "../../network.config";
import Tlds from "../../static/tlds.json";
import { IDeployedContracts } from "../interfaces/deployed-contracts";

export interface ISetupInput {
  contracts: IDeployedContracts;
  network: Network;
  networks: Network[];
}

// export const setupToken = async (input: ISetupInput) => {
//   for (const network_ of input.networks) {
//     if (network_ !== input.network) {
//       const isTrustedRemote = await input.contracts[input.network].Token.isTrustedRemote(NetworkConfig[network_].layerzero.chainId, input.contracts[network_].Token.address);
//       if (isTrustedRemote) {
//         await input.contracts[input.network].Token.setTrustedRemote(NetworkConfig[network_].layerzero.chainId, input.contracts[network_].Token.address);
//       }
//     }
//   }
// };

// TODO:
export const setupDomainPriceOracle = async (input: ISetupInput) => {};

// TODO:
export const setupTokenPriceOracle = async (input: ISetupInput) => {};

export const setupPublicResolverSynchronizer = async (input: ISetupInput) => {
  // Set Trust Remote
  for (const network_ of input.networks) {
    if (network_ !== input.network) {
      const isTrustedRemote = await input.contracts[input.network].PublicResolverSynchronizer.isTrustedRemote(
        NetworkConfig[network_].layerzero.chainId,
        input.contracts[network_].Token.address,
      );
      if (!isTrustedRemote) {
        await input.contracts[input.network].PublicResolverSynchronizer.setTrustedRemote(
          NetworkConfig[network_].layerzero.chainId,
          input.contracts[network_].PublicResolverSynchronizer.address,
        );
      }
    }
  }
  // Set the `PublicResolver` address for the `Synchronizer`
  await input.contracts[input.network].PublicResolverSynchronizer.setResolver(input.contracts[input.network].PublicResolver.address);
};

export const setupRegistry = async (input: ISetupInput) => {
  await input.contracts[input.network].Registry.grantRole(await input.contracts[input.network].Registry.ROOT_ROLE(), input.contracts[input.network].Root.address);
  await input.contracts[input.network].Registry.grantRole(
    await input.contracts[input.network].Registry.PUBLIC_RESOLVER_ROLE(),
    input.contracts[input.network].PublicResolver.address,
  );
  await input.contracts[input.network].Registry.grantRole(
    await input.contracts[input.network].Registry.REGISTRAR_ROLE(),
    input.contracts[input.network].SingletonRegistrar.address,
  );
  await input.contracts[input.network].Registry.grantRole(await input.contracts[input.network].Registry.REGISTRAR_ROLE(), input.contracts[input.network].OmniRegistrar.address);
};

export const setupSingletonRegistrar = async (input: ISetupInput) => {
  // Grant `ROOT_ROLE` to `Root` contract
  await input.contracts[input.network].SingletonRegistrar.grantRole(
    await input.contracts[input.network].SingletonRegistrar.ROOT_ROLE(),
    input.contracts[input.network].Root.address,
  );
  // Set the `baseUrl` for metadata
  await input.contracts[input.network].SingletonRegistrar.setBaseURI("https://md.edns.domains"); // No `/` at the end
};

export const setupSingletonRegistrarController = async (input: ISetupInput) => {
  for (const tld_ of SingletonTlds[`${input.network}`]) {
    const tld = ethers.utils.toUtf8Bytes(tld_);
    // Allow the `SingletonRegistrarController` to register to the `SingletonRegistrar`
    await input.contracts[input.network].Root.setControllerApproval(tld, input.contracts[input.network].SingletonRegistrarController.address, true);
  }
};

export const setupOmniRegistrarSynchronizer = async (input: ISetupInput) => {
  // Set Trust Remote
  for (const network_ of input.networks) {
    if (network_ !== input.network) {
      const isTrustedRemote = await input.contracts[input.network].OmniRegistrarSynchronizer.isTrustedRemote(
        NetworkConfig[network_].layerzero.chainId,
        input.contracts[network_].Token.address,
      );
      if (!isTrustedRemote) {
        await input.contracts[input.network].OmniRegistrarSynchronizer.setTrustedRemote(
          NetworkConfig[network_].layerzero.chainId,
          input.contracts[network_].OmniRegistrarSynchronizer.address,
        );
      }
    }
  }
  // Set the `OmniRegistrar` address for the `Synchronizer`
  await input.contracts[input.network].OmniRegistrarSynchronizer.setRegistrar(input.contracts[input.network].OmniRegistrar.address);
};

export const setupOmniRegistrar = async (input: ISetupInput) => {
  await input.contracts[input.network].OmniRegistrar.grantRole(await input.contracts[input.network].OmniRegistrar.ROOT_ROLE(), input.contracts[input.network].Root.address);
  // Set the `baseUrl` for metadata
  await input.contracts[input.network].OmniRegistrar.setBaseURI("https://md.edns.domains"); // No `/` at the end
};

export const setupOmniRegistrarController = async (input: ISetupInput) => {
  for (const tld_ of OmniTlds) {
    const tld = ethers.utils.toUtf8Bytes(tld_);
    // Allow the `OmniRegistrarController` to register to the `OmniRegistrar`
    await input.contracts[input.network].Root.setControllerApproval(tld, input.contracts[input.network].OmniRegistrarController.address, true);
  }
};

export const setupRoot = async (input: ISetupInput) => {
  // Set Trust Remote
  for (const network_ of input.networks) {
    if (network_ !== input.network) {
      const isTrustedRemote = await input.contracts[input.network].OmniRegistrarSynchronizer.isTrustedRemote(
        NetworkConfig[network_].layerzero.chainId,
        input.contracts[network_].Token.address,
      );
      if (!isTrustedRemote) {
        await input.contracts[input.network].Root.setTrustedRemote(NetworkConfig[network_].layerzero.chainId, input.contracts[network_].Root.address);
      }
    }
  }
};

export const setupSingletonTlds = async (input: ISetupInput) => {
  const tlds_ = SingletonTlds[`${input.network}`];
  for (const tld_ of tlds_) {
    const tld = ethers.utils.toUtf8Bytes(tld_);
    await input.contracts[input.network].Root.register(tld, input.contracts[input.network].PublicResolver.address, true, false);
  }
};

export const setupOmniTlds = async (input: ISetupInput) => {
  for (const tld_ of OmniTlds) {
    const tld = ethers.utils.toUtf8Bytes(tld_);
    await input.contracts[input.networks[0]].Root.register(tld, input.contracts[input.networks[0]].PublicResolver.address, true, true);
  }
};
