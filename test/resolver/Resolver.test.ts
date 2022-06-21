import { ethers } from "hardhat";
import { PublicResolver, Registry } from "../../typechain";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Resolver", function () {
  let resolver: PublicResolver;
  let registry: Registry;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  beforeEach(async function () {
    const Registry = await ethers.getContractFactory("Registry");
    registry = await Registry.deploy();
    await registry.deployed();
    [addr1, addr2] = await ethers.getSigners();
    await registry.initialize();

    const Synchronizer = await ethers.getContractFactory("Synchronizer");
    const synchronizer = await Synchronizer.deploy();

    const Resolver = await ethers.getContractFactory("PublicResolver");
    resolver = await Resolver.deploy();
    await resolver.deployed();
    await resolver.initialize(registry.address,synchronizer.address);
  });

  it("Resolver init", async function () {
    // expect(await resolver.registry).to.equal(registry.address);
  });
});
