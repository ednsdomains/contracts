import {
  setupDomainPriceOracle,
  setupOmniRegistrar,
  setupOmniRegistrarController,
  setupOmniRegistrarSynchronizer,
  setupOmniTlds,
  setupPublicResolverSynchronizer,
  setupRegistry,
  setupRoot,
  setupSingletonRegistrar,
  setupSingletonRegistrarController,
  setupSingletonTlds,
  setupToken,
} from "../helpers/setup";
import { Testnets as networks } from "../../network.config";
import delay from "delay";
import { ethers } from "hardhat";
import { IDeployedContracts } from "../interfaces/deployed-contracts";
import { load } from "../helpers/load";

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Wallet Address:", await signer.getAddress());

  const contracts: IDeployedContracts = await load({ networks, signer });

  console.log("Setting up `Token`...");
  await setupToken({ contracts, networks });

  console.log("Setting up `DomainPriceOracle`...");
  await setupDomainPriceOracle({ contracts, networks });

  console.log("Setting up `PublicResolverSynchronizer`...");
  await setupPublicResolverSynchronizer({ contracts, networks });

  console.log("Setting up `Registry`...");
  await setupRegistry({ contracts, networks });

  console.log("Setting up `Root`...");
  await setupRoot({ contracts, networks });

  console.log("Setting up `SingletonRegistrar`...");
  await setupSingletonRegistrar({ contracts, networks });
  console.log("Setting up [Singleton TLDs]...");
  await setupSingletonTlds({ contracts, networks });
  console.log("Setting up `SingletonRegistrarController`...");
  await setupSingletonRegistrarController({ contracts, networks });

  console.log("Setting up `OmniRegistrarSynchronizer`...");
  await setupOmniRegistrarSynchronizer({ contracts, networks });
  console.log("Setting up `OmniRegistrar`...");
  await setupOmniRegistrar({ contracts, networks });
  console.log("Setting up [Omni TLDs]...");
  await setupOmniTlds({ contracts, networks });

  console.log("Wait for 30 seconds...");
  await delay(30000);

  console.log("Setting up `OmniRegistrarController`...");
  await setupOmniRegistrarController({ contracts, networks });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
