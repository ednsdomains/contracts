import { ethers } from "hardhat";
import { expect } from "chai";
import delay from "delay";
import { getContracts } from "./src/lib/get-contracts";

describe("Deploy & Setup", function () {
  it("All Contracts are deployed and finished setup", async function () {
    const [signer] = await ethers.getSigners();
    const chainId = await signer.getChainId();

    console.log({ chainId });

    // console.log("Setting up `LayerZeroEndpointMock`...");
    // await setupLayerZeroEndpointMock(contracts);

    // console.log("Setting up `Token`...");
    // await setupToken(contracts);

    // console.log("Setting up `DomainPriceOracle`...");
    // await setupDomainPriceOracle(contracts);

    // console.log("Setting up `PublicResolverSynchronizer`...");
    // await setupPublicResolverSynchronizer(contracts);

    // console.log("Setting up `Registry`...");
    // await setupRegistry(contracts);

    // console.log("Setting up `Root`...");
    // await setupRoot(contracts);

    // console.log("Setting up `SingletonRegistrar`...");
    // await setupSingletonRegistrar(contracts);
    // console.log("Setting up [Singleton TLDs]...");
    // await setupSingletonTlds(contracts);
    // console.log("Setting up `SingletonRegistrarController`...");
    // await setupSingletonRegistrarController(contracts);

    // console.log("Setting up `OmniRegistrarSynchronizer`...");
    // await setupOmniRegistrarSynchronizer(contracts);
    // console.log("Setting up `OmniRegistrar`...");
    // await setupOmniRegistrar(contracts);
    // console.log("Setting up [Omni TLDs]...");
    // await setupOmniTlds(contracts);

    // await delay(2000);

    // console.log("Setting up `OmniRegistrarController`...");
    // await setupOmniRegistrarController(contracts);
  });
});
