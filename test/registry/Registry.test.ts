import { PublicResolver, Registry } from "../../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Registry", function () {
  let registry: Registry;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  beforeEach(async function () {
    const Registry = await ethers.getContractFactory("Registry");
    registry = await Registry.deploy();
    await registry.deployed();
    [addr1, addr2] = await ethers.getSigners();
    await registry.initialize();
  });
  describe("Role", async function () {
    describe("Init Role", async function () {
      it("Has ADMIN_ROLE", async function () {
        expect(await registry.hasRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE")), addr1.address), "Address 1 Have Not ADMIN ROLE.").to.equal(true);
        expect(await registry.hasRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE")), addr2.address), "Address 2 Have ADMIN ROLE.").to.equal(false);
      });
      it("Has DEFAULT_ADMIN_ROLE", async function () {
        expect(await registry.hasRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("DEFAULT_ADMIN_ROLE")), addr1.address), "Address 1 Have Not DEFAULT_ADMIN_ROLE.").to.equal(
          true,
        );
        expect(await registry.hasRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("DEFAULT_ADMIN_ROLE")), addr2.address), "Address 2 Have DEFAULT_ADMIN_ROLE.").to.equal(false);
      });
      it("REGISTRAR_ROLE Admin is ADMIN_ROLE", async function () {
        expect(await registry.getRoleAdmin(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("REGISTRAR_ROLE"))), "Address 1 Have Not REGISTRAR_ROLE.").to.equal(
          ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE")),
        );
      });
      it("ROOT_ROLE Admin is ADMIN_ROLE", async function () {
        expect(await registry.getRoleAdmin(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ROOT_ROLE"))), "Address 1 Have Not ROOT_ROLE.").to.equal(
          ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE")),
        );
      });
    });
    it("Set Role( ADMIN_ROLE )", async function () {
      expect(await registry.hasRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE")), addr2.address), "Address 2 Have ADMIN ROLE.").to.equal(false);
      await registry.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE")), addr2.address);
      expect(await registry.hasRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE")), addr2.address), "Address 2 Have Not ADMIN ROLE.").to.equal(true);
    });
  });
  describe("TLD", async function () {
    const TLD = "Test";
    it("Create TLD", async function () {
      const Resolver = await ethers.getContractFactory("PublicResolver");
      const resolver = await Resolver.deploy();
      await resolver.deployed();
      expect(await registry["exists(bytes32)"](ethers.utils.keccak256(ethers.utils.toUtf8Bytes(TLD))), "TLD Exist").to.equal(false);
      await registry.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ROOT_ROLE")), addr1.address);
      await registry["setRecord(string,address,address,bool,bool)"](TLD, addr1.address, resolver.address, true, false);
      expect(await registry["exists(bytes32)"](ethers.utils.keccak256(ethers.utils.toUtf8Bytes(TLD))), "TLD Not Exist").to.equal(true);
    });
    describe("TLD Management", async function () {
      let resolver: PublicResolver;
      beforeEach(async function () {
        const Resolver = await ethers.getContractFactory("PublicResolver");
        resolver = await Resolver.deploy();
        await resolver.deployed();
        await registry.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ROOT_ROLE")), addr1.address);
        await registry["setRecord(string,address,address,bool,bool)"](TLD, addr1.address, resolver.address, false, false);
      });
      it("TLD EXIST", async function () {
        expect(await registry["exists(bytes32)"](ethers.utils.keccak256(ethers.utils.toUtf8Bytes(TLD)))).to.equal(true);
      });
      it("TLD ENABLE", async function () {
        expect(await registry.enable(ethers.utils.keccak256(ethers.utils.toUtf8Bytes(TLD)))).to.equal(false);
        await registry.setEnable(ethers.utils.keccak256(ethers.utils.toUtf8Bytes(TLD)), true);
        expect(await registry.enable(ethers.utils.keccak256(ethers.utils.toUtf8Bytes(TLD)))).to.equal(true);
      });
      it("TLD OMNI", async function () {
        expect(await registry.omni(ethers.utils.keccak256(ethers.utils.toUtf8Bytes(TLD)))).to.equal(false);
      });
      it("TLD Set Resolver", async function () {
        expect(await registry["resolver(bytes32)"](ethers.utils.keccak256(ethers.utils.toUtf8Bytes(TLD)))).to.equal(resolver.address);

        const Resolver = await ethers.getContractFactory("PublicResolver");
        const newresolver = await Resolver.deploy();
        await newresolver.deployed();
        await registry["setResolver(bytes32,address)"](ethers.utils.keccak256(ethers.utils.toUtf8Bytes(TLD)), newresolver.address);
        expect(await registry["resolver(bytes32)"](ethers.utils.keccak256(ethers.utils.toUtf8Bytes(TLD)))).to.equal(newresolver.address);
      });
    });
  });

  describe("Domain", async function () {
    const TLD = "Test";
    const DOMAIN = "EDNS";
    beforeEach(async function () {
      const TLDResolver = await ethers.getContractFactory("PublicResolver");
      const tLDresolver = await TLDResolver.deploy();
      await tLDresolver.deployed();
      await registry.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ROOT_ROLE")), addr1.address);
      await registry["setRecord(string,address,address,bool,bool)"](TLD, addr1.address, tLDresolver.address, true, false);
      await registry.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("REGISTRAR_ROLE")), addr1.address);
    });

    it("Create Domain", async function () {
      const DomainResolver = await ethers.getContractFactory("PublicResolver");
      const domainResolver = await DomainResolver.deploy();
      await domainResolver.deployed();
      expect(
        await registry["exists(bytes32,bytes32)"](ethers.utils.keccak256(ethers.utils.toUtf8Bytes(DOMAIN)), ethers.utils.keccak256(ethers.utils.toUtf8Bytes(TLD))),
        "Domain Exist",
      ).to.equal(false);
      const expirtDate = new Date();
      expirtDate.setMonth(expirtDate.getMonth() + 1);
      await registry["setRecord(string,string,address,address,uint256)"](DOMAIN, TLD, addr2.address, domainResolver.address, expirtDate.getTime());
      expect(
        await registry["exists(bytes32,bytes32)"](ethers.utils.keccak256(ethers.utils.toUtf8Bytes(DOMAIN)), ethers.utils.keccak256(ethers.utils.toUtf8Bytes(TLD))),
        "Domain Not Exist",
      ).to.equal(true);
    });

    describe("Domain Management", async function () {
      beforeEach(async function () {
        const DomainResolver = await ethers.getContractFactory("PublicResolver");
        const domainResolver = await DomainResolver.deploy();
        await domainResolver.deployed();
        const expirtDate = new Date();
        expirtDate.setMonth(expirtDate.getMonth() + 1);
        await registry["setRecord(string,string,address,address,uint256)"](DOMAIN, TLD, addr2.address, domainResolver.address, expirtDate.getTime());
      });
      ///TODO
    });
  });
});
