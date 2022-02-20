import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BaseRegistrarImplementation, EDNSRegistrarController, EDNSRegistry, PublicResolver, ReverseRegistrar } from "../typechain";
import { namehash } from "ethers/lib/utils";
import Web3 from "web3";

const tlds: string[] = ["edns"];
const sampleDomain = {
  name: "one2cloud",
  tld: "edns"
};

const labelhash = (label: string) => ethers.utils.keccak256(ethers.utils.toUtf8Bytes(label));
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const ZERO_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000";

async function setupResolver(registry: EDNSRegistry, resolver: PublicResolver, account: SignerWithAddress) {
  const resolverNode = namehash("resolver");
  const resolverLabel = labelhash("resolver");
  await registry.setSubnodeOwner(ZERO_HASH, resolverLabel, account.address);
  await registry.setResolver(resolverNode, resolver.address);
  await resolver['setAddr(bytes32,address)'](resolverNode, resolver.address);
}

async function setupRegistrar(registry: EDNSRegistry, registrarController: EDNSRegistrarController, registrar: BaseRegistrarImplementation) {
  await registrar.addController(registrarController.address);
  for (let tld of tlds) {
    await registrarController.setTld(tld, namehash(tld));
    await registrar.setBaseNode(namehash(tld), true);
    await registry.setSubnodeOwner(ZERO_HASH, labelhash(tld), registrar.address);
  }
}

async function setupReverseRegistrar(registry: EDNSRegistry, reverseRegistrar: ReverseRegistrar, account: SignerWithAddress) {
  await registry.setSubnodeOwner(ZERO_HASH, labelhash("reverse"), account.address);
  await registry.setSubnodeOwner(namehash("reverse"), labelhash("addr"), reverseRegistrar.address);
}

describe("EDNS", function () {

  let registry: EDNSRegistry;
  let publicResolver: PublicResolver;
  let baseRegistrar: BaseRegistrarImplementation;
  let registrarController: EDNSRegistrarController;
  let reverseRegistrar: ReverseRegistrar;



  beforeEach(async function () {
    const EDNSRegistry = await ethers.getContractFactory("EDNSRegistry");
    const ReverseRegistrar = await ethers.getContractFactory("ReverseRegistrar");
    const PublicResolver = await ethers.getContractFactory("PublicResolver");
    const BaseRegistrarImplementation = await ethers.getContractFactory("BaseRegistrarImplementation");
    const EDNSRegistrarController = await ethers.getContractFactory("EDNSRegistrarController");

    registry = await EDNSRegistry.deploy();
    publicResolver = await PublicResolver.deploy(registry.address, ZERO_ADDRESS);
    baseRegistrar = await BaseRegistrarImplementation.deploy(registry.address);
    registrarController = await EDNSRegistrarController.deploy(baseRegistrar.address);
    reverseRegistrar = await ReverseRegistrar.deploy(registry.address, publicResolver.address);
  });

  describe("Initial setup", async function () {

    it("Should setup public resolver", async function () {
      const [owner] = await ethers.getSigners();
      await setupResolver(registry, publicResolver, owner);
    });

    it("Should setup registrar", async function () {
      await setupRegistrar(registry, registrarController, baseRegistrar);
      const tldAvailable = await registrarController.tldAvailable(sampleDomain.tld);
      expect(tldAvailable).to.equal(true);
    });

    it("Should setup reverse registrar", async function () {
      const [owner] = await ethers.getSigners();
      await setupReverseRegistrar(registry, reverseRegistrar, owner);
    });

    it("Should register a domain name with '.edns'", async function () {
      await setupRegistrar(registry, registrarController, baseRegistrar);
      const tldAvailable = await registrarController.tldAvailable(sampleDomain.tld);
      expect(tldAvailable).to.equal(true);

      const [owner] = await ethers.getSigners();
      const duration: number = 31104000; // 360 days;
      await registrarController.registerWithConfig(sampleDomain.name, sampleDomain.tld, owner.address, duration, publicResolver.address, owner.address);
    });

    it("Should able to resolve the address", async function () {
      const [owner] = await ethers.getSigners();
      await setupResolver(registry, publicResolver, owner);

      await setupRegistrar(registry, registrarController, baseRegistrar);
      const tldAvailable = await registrarController.tldAvailable(sampleDomain.tld);
      expect(tldAvailable).to.equal(true);

      await setupReverseRegistrar(registry, reverseRegistrar, owner);

      const duration: number = 31104000; // 360 days;
      await registrarController.registerWithConfig(sampleDomain.name, sampleDomain.tld, owner.address, duration, publicResolver.address, owner.address);

      const nodehash = namehash(sampleDomain.tld);
      const label = Web3.utils.soliditySha3(sampleDomain.name, nodehash);
      const hash = Web3.utils.soliditySha3(nodehash, label!);

      const addr = await publicResolver["addr(bytes32)"](hash!);
      expect(addr).to.equal(owner.address);
    })
  });

});