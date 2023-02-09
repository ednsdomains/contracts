import { ClassicalRegistrarController, LayerZeroEndpointMock, PublicResolver, Registrar,
  Registry, Root, TokenMock, Wrapper } from "../typechain";
import { ethers } from "hardhat";
import { deployLayerZero } from "./lastest/deploy/layerZeroEndPointMock";
import { deployRegistry } from "./lastest/deploy/01_registry";
import { expect } from "chai";
import { deployWrapper } from "../scripts/src/deploy";
import { deployDefaultWrapper } from "./lastest/deploy/02_deploy_DefaultWrapper";
import { deployPublicResolver } from "./lastest/deploy/03_publicResolver";
import { deployRegistrar } from "./lastest/deploy/04_registrar";
import { deployRoot } from "./lastest/deploy/05_root";
import { deployTokenMock } from "./lastest/deploy/06_tokenMock";
import { deployClassicalRegistrarController } from "./lastest/deploy/07_classicalRegistrarController";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Classical Test", function () {
  let signerList: SignerWithAddress[];
  // let fakeLzEndpointMock:LayerZeroEndpointMock;
  const today = new Date();
  let use_registry:Registry;
  let use_registry_ac2: Registry;
  let use_defaultWrapper: Wrapper;
  let use_publicResolver: PublicResolver;
  let use_publicResolver_ac2: PublicResolver;
  let use_registrar: Registrar;
  let use_root: Root;
  let use_token: TokenMock;
  let use_classicalRegistrarController: ClassicalRegistrarController;
  const hostNode = ethers.utils.toUtf8Bytes("@");
  const subHostNode = ethers.utils.toUtf8Bytes("sub");
  const tldNode = ethers.utils.toUtf8Bytes("tld");
  const disableTldNode = ethers.utils.toUtf8Bytes("disableTld");
  const nameNode = ethers.utils.toUtf8Bytes("domain");
  const subDomain = ethers.utils.toUtf8Bytes("sub");
  const subDomain2 = ethers.utils.toUtf8Bytes("sub2");
  const srcChainID = 1;

  it("get Signer", async () => {
    signerList = await ethers.getSigners();
  });
  describe("Deploy Contract", function () {
    it("Registry", async () => {
      [use_registry, use_registry_ac2] = await deployRegistry(signerList[1]);
      expect(use_registry.address).not.equals(null);
      expect(await use_registry.signer.getAddress()).not.equals(await use_registry_ac2.signer.getAddress());
    });
    it("DefaultWrapper", async () => {
      use_defaultWrapper = await deployDefaultWrapper({
        registryAddress: use_registry.address,
        nftName: "Test Name Service",
        nftSymbol: "TNS",
      });
      expect(use_defaultWrapper.address).not.equals(null);
    });
    it("PublicResolver", async () => {
      [use_publicResolver, use_publicResolver_ac2] = await deployPublicResolver(signerList[1], { registryAddress: use_registry.address });
      expect(use_publicResolver.address).not.equals(null);
      expect(await use_publicResolver.signer.getAddress()).not.equals(await use_publicResolver_ac2.signer.getAddress());
    });

    it("Registrar", async () => {
      use_registrar = await deployRegistrar({
        registryAddress: use_registry.address,
        resolverAddress: use_publicResolver.address,
      });
      expect(use_registrar.address).not.equals(null);
    });

    it("Root", async () => {
      use_root = await deployRoot({
        registryAddress: use_registry.address,
        registrarAddress: use_registrar.address,
      });
      expect(use_root.address).not.equals(null);
    });

    it("TokenMock", async () => {
      use_token = await deployTokenMock();
      expect(use_token.address).not.equals(null);
    });

    it("Classical Registrar Controller", async () => {
      use_classicalRegistrarController = await deployClassicalRegistrarController({
        tokenAddress: use_token.address,
        registrarAddress: use_registrar.address,
        rootAddress: use_root.address,
      });
      expect(use_classicalRegistrarController).not.equals(null);
    });
  });
  describe("Setup Contract", function () {
    it("grant Role", async () => {
      await use_registry.grantRole(await use_registry.WRAPPER_ROLE(), use_defaultWrapper.address)
      await use_registry.grantRole(await use_registry.ROOT_ROLE(), use_root.address);
      await use_registry.grantRole(await use_registry.REGISTRAR_ROLE(), use_registrar.address);
      // await use_registry.grantRole(await use_registry.)

      await use_registrar.grantRole(await use_registrar.ROOT_ROLE(),use_root.address)
    });
  });
  describe("TLD  Test", function () {
    it("Set tld record", async () => {
      const exipryDate = today.setFullYear(today.getFullYear() + 1);
      await use_root.register(tldNode,use_publicResolver.address,exipryDate, signerList[0].address, true, 0);
      const owner = await use_registry.callStatic["isExists(bytes32)"](ethers.utils.keccak256(tldNode));
      expect(owner).to.equal(true);
    });
    it("setControllerApproval", async ()=>{
      // use_registrar.setControllerApproval(ethers.utils.keccak256(tldNode),use_classicalRegistrarController.address,true)
      await use_root.setControllerApproval(ethers.utils.keccak256(tldNode),use_classicalRegistrarController.address,true)
      expect(await use_registrar.isControllerApproved(ethers.utils.keccak256(tldNode),use_classicalRegistrarController.address)).to.equal(true)
    })
    it("Set disable tld record", async () => {
      const exipryDate = today.setFullYear(today.getFullYear() + 1);
      await use_root.register(disableTldNode,use_publicResolver.address,exipryDate, signerList[0].address, false, 0);
      const owner = await use_registry.callStatic["isExists(bytes32)"](ethers.utils.keccak256(tldNode));
      expect(owner).to.equal(true);
    });
    it("Set tld existed record", async () => {
      let throwError = false;
      try {
        const exipryDate = today.setFullYear(today.getFullYear() + 1);
        await use_root.register(tldNode,use_publicResolver.address,exipryDate, signerList[0].address, false, 0);
        const owner = await use_registry.callStatic["isExists(bytes32)"](ethers.utils.keccak256(tldNode));
        // console.log("Not Error")
      } catch (e) {
        throwError = true;
      }
      expect(throwError).to.equal(true);
    });
    it("set Wrapper ", async ()=>{
      await use_registry.setWrapper(ethers.utils.keccak256(tldNode),true,use_defaultWrapper.address)
    })
  });

  describe("Domain Test", function () {
    it("Set Domain record", async () => {
      const exipryDate = today.setFullYear(today.getFullYear() + 1);
      // await use_registry["setRecord(bytes,bytes,address,address,uint64)"](nameNode, tldNode, signerList[0].address, use_publicResolver.address, exipryDate);
      await use_classicalRegistrarController["register(bytes,bytes,address,uint64)"](nameNode,tldNode,signerList[0].address,exipryDate)
      const owner = await use_registry["isExists(bytes32,bytes32)"](ethers.utils.keccak256(nameNode), ethers.utils.keccak256(tldNode));
      expect(owner).to.equal(true);
    });
    it("Set Sub Domain record", async () => {
        const exipryDate = today.setFullYear(today.getFullYear() + 1);
        await use_registry["setRecord(bytes,bytes,bytes,uint16)"](subDomain, nameNode, tldNode, 36000);
        const owner = await use_registry["isExists(bytes32,bytes32,bytes32)"](ethers.utils.keccak256(subDomain), ethers.utils.keccak256(nameNode),ethers.utils.keccak256(tldNode));
        expect(owner).to.equal(true)
    });
  });
  describe("Domain Test - Error", function (){
    it("Set Domain record - Exists Domain", async () => {
      let throwError = false;
      try {
        const exipryDate = today.setFullYear(today.getFullYear() + 1);
        await use_registry["setRecord(bytes,bytes,address,address,uint64)"](nameNode, tldNode, signerList[0].address, use_publicResolver.address, exipryDate);
        const owner = await use_registry["isExists(bytes32,bytes32)"](ethers.utils.keccak256(nameNode), ethers.utils.keccak256(tldNode));
      } catch (e) {
        // console.log(`     `,(e as Error).message);
        throwError = true;
      }
      expect(throwError).to.equal(true);
    });
  })

  describe("Set Text Record", function () {
    it("Text Record", async () => {
      const dummyText = "Test Set Text Record";
      await use_publicResolver.setText(hostNode, nameNode, tldNode, dummyText);
      const getText = await use_publicResolver.getText(hostNode, nameNode, tldNode);
      expect(getText).to.equal(dummyText);
    });
    it("Text Record - OverWrite", async () => {
      const dummyText = "Test Set Text Record OverWrite";
      await use_publicResolver.setText(hostNode, nameNode, tldNode, dummyText);
      const getText = await use_publicResolver.getText(hostNode, nameNode, tldNode);
      expect(getText).to.equal(dummyText);
    });
    it("Text Record - subDomain", async () => {
      const dummyText = "subText";
      await use_publicResolver.setText(subDomain, nameNode, tldNode, dummyText);
      const getText = await use_publicResolver.getText(subDomain, nameNode, tldNode);
      const getHostText = await use_publicResolver.getText(hostNode, nameNode, tldNode);
      expect(getText).to.equal(dummyText);
      expect(getHostText).to.equal("Test Set Text Record OverWrite");
    });
  });
  describe("Set Text Record - Error", function () {
    it("Set Record with signer is not owner", async () => {
      const originalValue = "Test Set Text Record OverWrite";
      const newText = "Test Set Text Record";
      try {
        await use_publicResolver_ac2.setText(hostNode, nameNode, tldNode, newText);
      } catch (e) {
        // console.log(`     `,(e as Error).message);
      }
      const getText = await use_publicResolver_ac2.getText(hostNode, nameNode, tldNode);
      expect(getText).to.equal(originalValue);
    });
    it("Set Record with signer is not owner - subDomain", async () => {
      const dummyText = "subText";
      const newText = "new Text"
      let error = false
      try {
        await use_publicResolver_ac2.setText(newText, nameNode, tldNode, dummyText);
      }catch (e) {
        // console.log(`     `,(e as Error).message);
        error = true
      }
      const getText = await use_publicResolver.getText(subDomain, nameNode, tldNode);
      const getHostText = await use_publicResolver.getText(hostNode, nameNode, tldNode);
      expect(getText).to.equal(dummyText);
      expect(getHostText).to.equal("Test Set Text Record OverWrite");
      expect(error).to.equal(true)
    });
  });
  describe("Set Typed Text Record", function () {
    it("Set Text Typed Record", async () => {
      const typeEmail = ethers.utils.toUtf8Bytes("email");
      const typedEmailText = "alexwg2018@gmail.com";
      const typeName = ethers.utils.toUtf8Bytes("name");
      const typedNameText = "alexwg";

      await use_publicResolver.setTypedText(hostNode, nameNode, tldNode, typeEmail, typedEmailText);
      await use_publicResolver.setTypedText(hostNode, nameNode, tldNode, typeName, typedNameText);

      const getEmail = await use_publicResolver.getTypedText(hostNode, nameNode, tldNode, typeEmail);
      const getName = await use_publicResolver.getTypedText(hostNode, nameNode, tldNode, typeName);
      expect(getEmail).to.equal(typedEmailText);
      expect(getName).to.equal(typedNameText);
    });
    it("Set Text Typed Record - OverWrite", async () => {
      const type = ethers.utils.toUtf8Bytes("email");
      const typedText = "new Typed Record";
      await use_publicResolver.setTypedText(hostNode, nameNode, tldNode, type, typedText);
      const getText = await use_publicResolver.getTypedText(hostNode, nameNode, tldNode, type);
      expect(getText).to.equal(typedText);
    });
  });
  describe("Set Typed Text Record - Error", function () {
    it("Set Record with signer is not owner", async () => {
      const originaltypedText = "new Typed Record";
      const type = ethers.utils.toUtf8Bytes("email");
      const newTypedText = "Test Set Text Record";
      try {
        await use_publicResolver_ac2.setTypedText(hostNode, nameNode, tldNode, type, newTypedText);
      } catch (e) {
        // console.log(`     `,(e as Error).message);
      }
      const getText = await use_publicResolver_ac2.getTypedText(hostNode, nameNode, tldNode, type);
      expect(getText).to.equal(originaltypedText);
    });
  });

  describe("Set Address Record", function () {
    it("Set Address Record", async () => {
      await use_publicResolver.setAddress(hostNode, nameNode, tldNode, signerList[0].address);
      const getAddress = await use_publicResolver.getAddress(hostNode, nameNode, tldNode);
      expect(getAddress.toLowerCase()).to.equal(signerList[0].address.toLowerCase());
    });
    it("Set Address Record - Overwrite", async () => {
      await use_publicResolver.setAddress(hostNode, nameNode, tldNode, signerList[1].address);
      const getAddress = await use_publicResolver.getAddress(hostNode, nameNode, tldNode);
      expect(getAddress.toLowerCase()).to.equal(signerList[1].address.toLowerCase());
    });
  });
  describe("Set Address Record - Error", function () {
    it("Set Address Record - signer is not owner", async () => {
      try {
        await use_publicResolver_ac2.setAddress(hostNode, nameNode, tldNode, signerList[2].address);
      } catch (e) {
        // console.log(`     `,(e as Error).message);
      }
      const getAddress = await use_publicResolver_ac2.getAddress(hostNode, nameNode, tldNode);
      expect(getAddress).to.equal(signerList[1].address);
    });
  });

  describe("Set MultiCoinAddress Record", function () {
    it("Set MultiAddress Record", async () => {
      await use_publicResolver.setMultiCoinAddress(hostNode, nameNode, tldNode, 0, signerList[0].address);
      await use_publicResolver.setMultiCoinAddress(hostNode, nameNode, tldNode, 1, signerList[1].address);
      const getAddress0 = await use_publicResolver.getMultiCoinAddress(hostNode, nameNode, tldNode, 0);
      const getAddress1 = await use_publicResolver.getMultiCoinAddress(hostNode, nameNode, tldNode, 1);
      expect(getAddress0.toLowerCase().toLowerCase()).to.equal(signerList[0].address.toLowerCase());
      expect(getAddress1.toLowerCase().toLowerCase()).to.equal(signerList[1].address.toLowerCase());
    });
    it("Set MultiCoinAddress Record - Overwrite", async () => {
      await use_publicResolver.setMultiCoinAddress(hostNode, nameNode, tldNode, 0, signerList[1].address);
      const getAddress = await use_publicResolver.getMultiCoinAddress(hostNode, nameNode, tldNode, 0);
      expect(getAddress.toLowerCase()).to.equal(signerList[1].address.toLowerCase());
    });
  });

  describe("Set MultiCoinAddress Record - Error", function () {
    it("Set MultiAddress Record - Signer not owner", async () => {
      try {
        await use_publicResolver_ac2.setMultiCoinAddress(hostNode, nameNode, tldNode, 0, signerList[0].address);
      } catch (e) {
        // console.log(`     `,(e as Error).message);
      }
      const getAddress = await use_publicResolver_ac2.getMultiCoinAddress(hostNode, nameNode, tldNode, 0);
      expect(getAddress.toLowerCase().toLowerCase()).to.equal(signerList[1].address.toLowerCase());
    });
  });

  describe("Reserve Domain", function () {
    it("Set Reserve Address", async ()=>{
      await use_publicResolver.setReverseAddress(hostNode,nameNode,tldNode,signerList[0].address)
      expect(await use_publicResolver.callStatic.getReverseAddress(signerList[0].address)).to.equal(`domain.tld`)
    })

  });


  describe("Transfer Domain", function () {
    it("Transfer Domain",async ()=>{
      const tokenId = await use_registry["getTokenId(bytes,bytes)"](nameNode,tldNode)
      await use_defaultWrapper.transferFrom(signerList[0].address,signerList[1].address,tokenId)
      expect(await use_defaultWrapper.ownerOf(tokenId)).to.equal(signerList[1].address)
      expect(await use_registry["getOwner(bytes32,bytes32)"](ethers.utils.keccak256(nameNode),ethers.utils.keccak256(tldNode))).to.equal(signerList[1].address)
    }) //  transfer -> setOwner at Wrapper and Registry. But not set user.
  });

  describe("Rental Domain", function () {
    it("Set User Domain",async ()=>{
      const exipryDate = new Date().setMonth(today.getMonth()+1);
      const tokenId = await use_registry["getTokenId(bytes,bytes)"](nameNode,tldNode)
      await use_defaultWrapper.setUser(tokenId,signerList[1].address,exipryDate)
      expect(await use_registry["getUser(bytes32,bytes32)"](ethers.utils.keccak256(nameNode),ethers.utils.keccak256(tldNode))).to.equal(signerList[1].address)
    })
  });

  describe("Test after Rental", function (){
    it("Set Sub Domain Record",async ()=>{
      const exipryDate = today.setFullYear(today.getFullYear() + 1);
      await use_registry_ac2["setRecord(bytes,bytes,bytes,uint16)"](subDomain2, nameNode, tldNode, 36000);
      const owner = await use_registry["isExists(bytes32,bytes32,bytes32)"](ethers.utils.keccak256(subDomain2), ethers.utils.keccak256(nameNode),ethers.utils.keccak256(tldNode));
      expect(owner).to.equal(true)
    })
    it("signer 1 can set Old Domain record",async ()=>{
      await use_publicResolver.setText(subDomain, nameNode, tldNode, "I am old user");
      expect(await use_publicResolver.getText(subDomain,nameNode,tldNode)).to.equal("I am old user")
    })
    it("signer 2 can set new Domain record",async ()=>{
      await use_publicResolver_ac2.setText(subDomain2, nameNode, tldNode, "I am new user");
      expect(await use_publicResolver.getText(subDomain2,nameNode,tldNode)).to.equal("I am new user")
    })
  })


});
