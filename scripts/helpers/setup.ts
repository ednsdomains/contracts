import { ethers } from "hardhat";
import { Network } from "../../network.config";
import NetworkConfig from "../../network.config";
import SingletonTlds from "../../static/singleton-tlds.json";
import OmniTlds from "../../static/omni-tlds.json";
import { IContracts } from "../interfaces/contracts";
import { IDeployedContracts } from "../interfaces/deployed-contracts";

interface ISetupInput {
  contracts: IDeployedContracts;
  networks: Network[];
}

export const setupToken = async (input: ISetupInput) => {
  for (const network of input.networks) {
    for (const network_ of input.networks) {
      if (network_ !== network) {
        const isTrustedRemote = await input.contracts[network].Token.isTrustedRemote(NetworkConfig[network_].layerzero.chainId, input.contracts[network_].Token.address);
        if (isTrustedRemote) {
          await input.contracts[network].Token.setTrustedRemote(NetworkConfig[network_].layerzero.chainId, input.contracts[network_].Token.address);
        }
      }
    }
  }
};

// TODO:
export const setupDomainPriceOracle = async (input: ISetupInput) => {};

// TODO:
export const setupTokenPriceOracle = async (input: ISetupInput) => {};

export const setupPublicResolverSynchronizer = async (input: ISetupInput) => {
  for (const network of input.networks) {
    // Set Trust Remote
    for (const network_ of input.networks) {
      if (network_ !== network) {
        const isTrustedRemote = await input.contracts[network].PublicResolverSynchronizer.isTrustedRemote(
          NetworkConfig[network_].layerzero.chainId,
          input.contracts[network_].Token.address,
        );
        if (!isTrustedRemote) {
          await input.contracts[network].PublicResolverSynchronizer.setTrustedRemote(
            NetworkConfig[network_].layerzero.chainId,
            input.contracts[network_].PublicResolverSynchronizer.address,
          );
        }
      }
    }
    // Set the `PublicResolver` address for the `Synchronizer`
    await input.contracts[network].PublicResolverSynchronizer.setResolver(input.contracts[network].PublicResolver.address);
  }
};

export const setupRegistry = async (input: ISetupInput) => {
  for (const network of input.networks) {
    await input.contracts[network].Registry.grantRole(await input.contracts[network].Registry.ROOT_ROLE(), input.contracts[network].Root.address);
    await input.contracts[network].Registry.grantRole(await input.contracts[network].Registry.PUBLIC_RESOLVER_ROLE(), input.contracts[network].PublicResolver.address);
    await input.contracts[network].Registry.grantRole(await input.contracts[network].Registry.REGISTRAR_ROLE(), input.contracts[network].SingletonRegistrar.address);
    await input.contracts[network].Registry.grantRole(await input.contracts[network].Registry.REGISTRAR_ROLE(), input.contracts[network].OmniRegistrar.address);
  }
};

export const setupSingletonRegistrar = async (input: ISetupInput) => {
  for (const network of input.networks) {
    // Grant `ROOT_ROLE` to `Root` contract
    await input.contracts[network].SingletonRegistrar.grantRole(await input.contracts[network].SingletonRegistrar.ROOT_ROLE(), input.contracts[network].Root.address);
    // Set the `baseUrl` for metadata
    await input.contracts[network].SingletonRegistrar.setBaseURI("https://md.edns.domains"); // No `/` at the end
  }
};

export const setupSingletonRegistrarController = async (input: ISetupInput) => {
  for (const network of input.networks) {
    for (const tld_ of SingletonTlds[network]) {
      const tld = ethers.utils.toUtf8Bytes(tld_);
      // Allow the `SingletonRegistrarController` to register to the `SingletonRegistrar`
      await input.contracts[network].Root.setControllerApproval(tld, input.contracts[network].SingletonRegistrarController.address, true);
    }
  }
};

export const setupOmniRegistrarSynchronizer = async (input: ISetupInput) => {
  for (const network of input.networks) {
    // Set Trust Remote
    for (const network_ of input.networks) {
      if (network_ !== network) {
        const isTrustedRemote = await input.contracts[network].OmniRegistrarSynchronizer.isTrustedRemote(
          NetworkConfig[network_].layerzero.chainId,
          input.contracts[network_].Token.address,
        );
        if (!isTrustedRemote) {
          await input.contracts[network].OmniRegistrarSynchronizer.setTrustedRemote(
            NetworkConfig[network_].layerzero.chainId,
            input.contracts[network_].OmniRegistrarSynchronizer.address,
          );
        }
      }
    }
    // Set the `OmniRegistrar` address for the `Synchronizer`
    await input.contracts[network].OmniRegistrarSynchronizer.setRegistrar(input.contracts[network].OmniRegistrar.address);
  }
};

export const setupOmniRegistrar = async (input: ISetupInput) => {
  for (const network of input.networks) {
    await input.contracts[network].OmniRegistrar.grantRole(await input.contracts[network].OmniRegistrar.ROOT_ROLE(), input.contracts[network].Root.address);
    // Set the `baseUrl` for metadata
    await input.contracts[network].OmniRegistrar.setBaseURI("https://md.edns.domains"); // No `/` at the end
  }
};

export const setupOmniRegistrarController = async (input: ISetupInput) => {
  for (const network of input.networks) {
    for (const tld_ of OmniTlds) {
      const tld = ethers.utils.toUtf8Bytes(tld_);
      const isTldExists = await input.contracts[network].Registry["exists(bytes32)"](ethers.utils.keccak256(tld));
      console.log({ isTldExists, network, tld: ethers.utils.keccak256(tld), registry: input.contracts[network].Registry.address });
      // Allow the `OmniRegistrarController` to register to the `OmniRegistrar`
      await input.contracts[network].Root.setControllerApproval(tld, input.contracts[network].OmniRegistrarController.address, true);
    }
  }
};

export const setupRoot = async (input: ISetupInput) => {
  for (const network of input.networks) {
    // Set Trust Remote
    for (const network_ of input.networks) {
      if (network_ !== network) {
        const isTrustedRemote = await input.contracts[network].OmniRegistrarSynchronizer.isTrustedRemote(
          NetworkConfig[network_].layerzero.chainId,
          input.contracts[network_].Token.address,
        );
        if (!isTrustedRemote) {
          await input.contracts[network].Root.setTrustedRemote(NetworkConfig[network_].layerzero.chainId, input.contracts[network_].Root.address);
        }
      }
    }
  }
};

export const setupSingletonTlds = async (input: ISetupInput) => {
  for (const network of input.networks) {
    const tlds_ = SingletonTlds[`${network}`];
    for (const tld_ of tlds_) {
      const tld = ethers.utils.toUtf8Bytes(tld_);
      await input.contracts[network].Root.register(tld, input.contracts[network].PublicResolver.address, true, false);
    }
  }
};

export const setupOmniTlds = async (input: ISetupInput) => {
  for (const tld_ of OmniTlds) {
    const tld = ethers.utils.toUtf8Bytes(tld_);
    await input.contracts[input.networks[0]].Root.register(tld, input.contracts[input.networks[0]].PublicResolver.address, true, true);
  }
};
