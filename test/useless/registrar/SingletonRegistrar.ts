// import {PublicResolver, Registry, SingletonRegistrar, Synchronizer} from "../../typechain";
// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
// import { ethers } from "hardhat";
// import { expect } from "chai";
// import { BigNumberish, utils } from "ethers";

// describe("SingletonRegistrar", function () {
//   let resolver: PublicResolver;
//   let registry: Registry;
//   let singletonRegistrar: SingletonRegistrar;
//   let addr1: SignerWithAddress;
//   let addr2: SignerWithAddress;
//   let synchronizer :Synchronizer;
//   const TLD = "test";
//   const Domain = "alexbs";
//   // const TLD_byte = ethers.utils.toUtf8Bytes(TLD)
//   const TLD_byte = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(TLD));
//   const Domain_byte = ethers.utils.toUtf8Bytes(Domain);
//   beforeEach(async function () {
//     const Registry = await ethers.getContractFactory("Registry");
//     registry = await Registry.deploy();
//     await registry.deployed();

//     const Synchronizer = await ethers.getContractFactory("Synchronizer");
//     synchronizer = await Synchronizer.deploy();
//     [addr1, addr2] = await ethers.getSigners();
//     await registry.initialize();

//     const Resolver = await ethers.getContractFactory("PublicResolver");
//     resolver = await Resolver.deploy();
//     await resolver.deployed();
//     await resolver.initialize(registry.address,synchronizer.address);

//     const SingletonRegistrar = await ethers.getContractFactory("SingletonRegistrar");
//     singletonRegistrar = await SingletonRegistrar.deploy();
//     await singletonRegistrar.deployed();
//     await singletonRegistrar.initialize(registry.address);

//     //SET TLD
//     await registry.grantRole(await registry.REGISTRAR_ROLE(), singletonRegistrar.address);
//     await registry.grantRole(await registry.ROOT_ROLE(), addr1.address);
//     await registry.grantRole(await registry.REGISTRAR_ROLE(), addr1.address);
//     await registry["setRecord(bytes,address,address,bool,bool)"](ethers.utils.toUtf8Bytes(TLD),addr1.address,resolver.address,false,false);
//     //SET TLD END

//     await singletonRegistrar.grantRole(await singletonRegistrar.ROOT_ROLE(), addr1.address);
//   });

//   it("Singleton Registrar init", async function () {
//     expect(await registry.hasRole(await registry.REGISTRAR_ROLE(), singletonRegistrar.address)).to.equal(true);
//     expect(await registry.hasRole(await registry.REGISTRAR_ROLE(), addr1.address)).to.equal(true);
//     expect(await registry["exists(bytes32)"](TLD_byte)).to.equal(true);
//   });

//   it("Singleton Registrar Register", async function () {
//     await singletonRegistrar.setControllerApproval(ethers.utils.toUtf8Bytes(TLD), addr1.address, true);
//     const expirtDate = new Date();
//     expirtDate.setMonth(expirtDate.getMonth() + 1);
//     await singletonRegistrar.register(ethers.utils.toUtf8Bytes(Domain), ethers.utils.toUtf8Bytes(TLD), addr1.address, Math.floor(expirtDate.getTime() / 1000));
//   });
//   describe("Domain Managment", function () {
//     let durations: BigNumberish;
//     let expirtDate = new Date();
//     expirtDate.setMonth(12);
//     durations = expirtDate.getTime();
//     beforeEach(async function () {
//       await singletonRegistrar.setControllerApproval(ethers.utils.toUtf8Bytes(TLD), addr1.address, true);
//       await singletonRegistrar.register(ethers.utils.toUtf8Bytes(Domain), ethers.utils.toUtf8Bytes(TLD), addr1.address, durations);
//     });
//     it("Exists", async function () {
//       expect(await singletonRegistrar["exists(bytes,bytes)"](ethers.utils.toUtf8Bytes(Domain), ethers.utils.toUtf8Bytes(TLD))).to.equal(true);
//     });
//     it("ownerOf", async function () {
//       expect(await singletonRegistrar["ownerOf(bytes,bytes)"](ethers.utils.toUtf8Bytes(Domain), ethers.utils.toUtf8Bytes(TLD))).to.equal(addr1.address);
//     });
//     it("available", async function () {
//       expect(await singletonRegistrar["available(bytes,bytes)"](ethers.utils.toUtf8Bytes(Domain), ethers.utils.toUtf8Bytes(TLD))).to.equal(false);
//     });
//     it("Token ID", async function () {
//       expect(await singletonRegistrar.tokenId(ethers.utils.toUtf8Bytes(Domain), ethers.utils.toUtf8Bytes(TLD))).to.equal(
//         ethers.utils.keccak256(ethers.utils.toUtf8Bytes(Domain + "." + TLD)),
//       );
//     });
//     it("Renew", async function () {
//       const baiseExpiryTime = await singletonRegistrar.expiry(ethers.utils.toUtf8Bytes(Domain), ethers.utils.toUtf8Bytes(TLD));
//       await singletonRegistrar.renew(ethers.utils.toUtf8Bytes(Domain), ethers.utils.toUtf8Bytes(TLD), expirtDate.getTime());
//       const newExpiryTime = await singletonRegistrar.expiry(ethers.utils.toUtf8Bytes(Domain), ethers.utils.toUtf8Bytes(TLD));
//       expect(newExpiryTime).to.be.above(baiseExpiryTime);
//     });
//     // it("Reclaim", async function () {
//     //     expect(await singletonRegistrar["ownerOf(bytes,bytes)"](ethers.utils.toUtf8Bytes(Domain),ethers.utils.toUtf8Bytes(TLD))).to.equal(addr1.address)
//     //     await singletonRegistrar.connect(addr1).reclaim(ethers.utils.toUtf8Bytes(Domain),ethers.utils.toUtf8Bytes(TLD),addr2.address)
//     //     expect(await singletonRegistrar["ownerOf(bytes,bytes)"](ethers.utils.toUtf8Bytes(Domain),ethers.utils.toUtf8Bytes(TLD))).to.equal(addr2.address)
//     // })
//     it("transferFrom", async function () {
//       const tokenID = await singletonRegistrar.tokenId(ethers.utils.toUtf8Bytes(Domain), ethers.utils.toUtf8Bytes(TLD));
//       expect(await singletonRegistrar["ownerOf(bytes,bytes)"](ethers.utils.toUtf8Bytes(Domain), ethers.utils.toUtf8Bytes(TLD))).to.equal(addr1.address);
//       await singletonRegistrar.transferFrom(addr1.address, addr2.address, tokenID);
//       expect(await singletonRegistrar["ownerOf(bytes,bytes)"](ethers.utils.toUtf8Bytes(Domain), ethers.utils.toUtf8Bytes(TLD))).to.equal(addr2.address);
//       await singletonRegistrar.connect(addr2).transferFrom(addr2.address, addr1.address, tokenID);
//       expect(await singletonRegistrar["ownerOf(bytes,bytes)"](ethers.utils.toUtf8Bytes(Domain), ethers.utils.toUtf8Bytes(TLD))).to.equal(addr1.address);
//     });
//   });
// });
