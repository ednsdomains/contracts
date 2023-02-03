import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ClassicalRegistrarController, LayerZeroEndpointMock, PublicResolver, Registrar, Registry, Root, TokenMock, Wrapper } from "../typechain";
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

describe("Classical Test", function () {
  let signerList: SignerWithAddress[];
  // let fakeLzEndpointMock:LayerZeroEndpointMock;
  const today = new Date();
  let use_registry: Registry;
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
      await use_registry.grantRole(await use_registry.ROOT_ROLE(), signerList[0].address);
      await use_registry.grantRole(await use_registry.REGISTRAR_ROLE(), signerList[0].address);
    });
  });
  describe("TLD  Test", function () {
    it("Set tld record", async () => {
      const exipryDate = today.setFullYear(today.getFullYear() + 1);
      await use_registry["setRecord(bytes,address,address,uint64,bool,uint8)"](tldNode, signerList[0].address, use_publicResolver.address, exipryDate, true, 0);
      const owner = await use_registry.callStatic["isExists(bytes32)"](ethers.utils.keccak256(tldNode));
      expect(owner).to.equal(true);
    });
    it("Set disable tld record", async () => {
      const exipryDate = today.setFullYear(today.getFullYear() + 1);
      await use_registry["setRecord(bytes,address,address,uint64,bool,uint8)"](disableTldNode, signerList[0].address, use_publicResolver.address, exipryDate, false, 0);
      const owner = await use_registry.callStatic["isExists(bytes32)"](ethers.utils.keccak256(tldNode));
      expect(owner).to.equal(true);
    });
    it("Set tld existed record", async () => {
      let throwError = false;
      try {
        const exipryDate = today.setFullYear(today.getFullYear() + 1);
        await use_registry["setRecord(bytes,address,address,uint64,bool,uint8)"](tldNode, signerList[0].address, use_publicResolver.address, exipryDate, true, 0);
        const owner = await use_registry.callStatic["isExists(bytes32)"](ethers.utils.keccak256(tldNode));
        expect(owner).to.equal(true);
      } catch (e) {
        throwError = true;
      }
      expect(throwError).to.equal(true);
    });
  });

  describe("Domain Test", function () {
    it("Set Domain record", async () => {
      const exipryDate = today.setFullYear(today.getFullYear() + 1);
      await use_registry["setRecord(bytes,bytes,address,address,uint64)"](nameNode, tldNode, signerList[0].address, use_publicResolver.address, exipryDate);
      const owner = await use_registry["isExists(bytes32,bytes32)"](ethers.utils.keccak256(nameNode), ethers.utils.keccak256(tldNode));
      expect(owner).to.equal(true);
    });
    it("Set Domain record - Exists Domain", async () => {
      let throwError = false;
      try {
        const exipryDate = today.setFullYear(today.getFullYear() + 1);
        await use_registry["setRecord(bytes,bytes,address,address,uint64)"](nameNode, tldNode, signerList[0].address, use_publicResolver.address, exipryDate);
        const owner = await use_registry["isExists(bytes32,bytes32)"](ethers.utils.keccak256(nameNode), ethers.utils.keccak256(tldNode));
      } catch (e) {
        throwError = true;
      }
      expect(throwError).to.equal(true);
    });
  });

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
      const subDomain = ethers.utils.toUtf8Bytes("sub");
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
        console.log((e as Error).message);
      }
      const getText = await use_publicResolver_ac2.getText(hostNode, nameNode, tldNode);
      expect(getText).to.equal(originalValue);
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
        console.log((e as Error).message);
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
        console.log((e as Error).message);
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
        console.log((e as Error).message);
      }
      const getAddress = await use_publicResolver_ac2.getMultiCoinAddress(hostNode, nameNode, tldNode, 0);
      expect(getAddress.toLowerCase().toLowerCase()).to.equal(signerList[1].address.toLowerCase());
    });
  });
});
