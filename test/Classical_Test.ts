import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { BaseRegistrar, ClassicalRegistrarController, PublicResolver, Registry, Token } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Classical Test", function () {
  let addr1: SignerWithAddress[];
  let fakeLzEndpointMock;
  let use_registry: Registry;
  let use_token: Token;
  let use_publicResolver: PublicResolver;
  let use_baseRegistrar: BaseRegistrar;
  let use_classicalRegistrarController: ClassicalRegistrarController;
  const hostNode = ethers.utils.toUtf8Bytes("@");
  const subHostNode = ethers.utils.toUtf8Bytes("sub");
  const tldNode = ethers.utils.toUtf8Bytes("classicalTLD");
  const nameNode = ethers.utils.toUtf8Bytes("domain");
  it("Deploy Contract", async () => {
    const srcChainID = 1;
    addr1 = await ethers.getSigners();
    //Deploy LzEndpoint
    const LZEndpointMock = await ethers.getContractFactory("LayerZeroEndpointMock");
    fakeLzEndpointMock = await LZEndpointMock.deploy(srcChainID);

    //Deploy Registry
    const RegistryFactory = await ethers.getContractFactory("Registry");
    const _registry = await upgrades.deployProxy(RegistryFactory);
    await _registry.deployed();
    use_registry = RegistryFactory.attach(_registry.address);
    expect(use_registry.address).not.equal(null);

    //Deploy Token
    const TokenFactory = await ethers.getContractFactory("Token");
    const _token = await upgrades.deployProxy(TokenFactory, [await fakeLzEndpointMock.callStatic.getChainId(), fakeLzEndpointMock.address]);
    await _token.deployed();
    use_token = TokenFactory.attach(_token.address);
    expect(use_token.address).not.equal(null);

    //Deploy TokenPrice
    const TokenPriceOracleFactory = await ethers.getContractFactory("TokenPriceOracleMock");
    const tokenPriceOracle = await TokenPriceOracleFactory.deploy(
      "0x514910771af9ca656af840dff83e8264ecf986ca",
      "0x514910771af9ca656af840dff83e8264ecf986ca",
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes("0")),
    );
    await tokenPriceOracle.deployed();
    expect(tokenPriceOracle.address).not.equal(null);

    //Deploy DomainPriceOracle
    const DomainPriceOracleFactory = await ethers.getContractFactory("DomainPriceOracle");
    const _domainPriceOracle = await upgrades.deployProxy(DomainPriceOracleFactory, [tokenPriceOracle.address]);
    await _domainPriceOracle.deployed();
    const domainPriceOracle = DomainPriceOracleFactory.attach(_domainPriceOracle.address);
    expect(domainPriceOracle.address).not.equal(null);

    //Deploy PublicResolver
    const PublicResolverSynchronizerFactory = await ethers.getContractFactory("PublicResolverSynchronizer");
    const _publicResolverSynchronizer = await upgrades.deployProxy(PublicResolverSynchronizerFactory, [
      fakeLzEndpointMock.address,
      await fakeLzEndpointMock.callStatic.getChainId(),
      [10002, 10012],
    ]);
    await _publicResolverSynchronizer.deployed();
    const publicResolverSynchronizer = PublicResolverSynchronizerFactory.attach(_publicResolverSynchronizer.address);
    expect(publicResolverSynchronizer.address).not.equal(null);

    //Deploy PublicResolver
    const PublicResolver = await ethers.getContractFactory("PublicResolver");
    const _publicResolver = await upgrades.deployProxy(PublicResolver, [_registry.address, _publicResolverSynchronizer.address], { unsafeAllow: ["delegatecall"] });
    await _publicResolver.deployed();
    use_publicResolver = PublicResolver.attach(_publicResolver.address);
    expect(_publicResolver.address).not.equal(null);

    //Deploy BaseRegistrar
    const BaseRegistrar = await ethers.getContractFactory("BaseRegistrar");
    const _baseRegistrar = await upgrades.deployProxy(BaseRegistrar, [_registry.address]);
    await _baseRegistrar.deployed();
    use_baseRegistrar = BaseRegistrar.attach(_baseRegistrar.address);
    expect(_baseRegistrar.address).not.equal(null);

    //Deploy ClassicalRegistrarController
    const ClassicalRegistrarController = await ethers.getContractFactory("ClassicalRegistrarController");
    const _classicalRegistrarController = await upgrades.deployProxy(ClassicalRegistrarController, [
      _token.address,
      domainPriceOracle.address,
      tokenPriceOracle.address,
      _baseRegistrar.address,
      1,
    ]);
    await _classicalRegistrarController.deployed();
    use_classicalRegistrarController = ClassicalRegistrarController.attach(_classicalRegistrarController.address);
    expect(use_classicalRegistrarController.address).not.equal(null);

    await publicResolverSynchronizer.setResolver(use_publicResolver.address);
    await use_registry.grantRole(await use_registry.PUBLIC_RESOLVER_ROLE(), use_publicResolver.address);
    await use_registry.grantRole(await use_registry.REGISTRAR_ROLE(), use_baseRegistrar.address);
    await use_registry.grantRole(await use_registry.ROOT_ROLE(), addr1[0].address);
    await use_baseRegistrar.grantRole(await use_baseRegistrar.ROOT_ROLE(), addr1[0].address);
  });

  it("Regisiter TLD", async () => {
    const tldByte = ethers.utils.toUtf8Bytes("classicalTLD");
    await use_registry["setRecord(bytes,address,address,bool,uint8)"](tldByte, addr1[0].address, use_publicResolver.address, true, 0);

    const owner = await use_registry.callStatic["isExists(bytes32)"](ethers.utils.keccak256(tldByte));
    expect(owner).to.equal(true);
  });

  it("Approval Controller", async () => {
    const tldByte = ethers.utils.toUtf8Bytes("classicalTLD");
    let approved = await use_baseRegistrar.isControllerApproved(ethers.utils.keccak256(tldByte), use_classicalRegistrarController.address);
    expect(approved).to.equal(false);
    await use_baseRegistrar.setControllerApproval(tldByte, use_classicalRegistrarController.address, true);
    approved = await use_baseRegistrar.isControllerApproved(ethers.utils.keccak256(tldByte), use_classicalRegistrarController.address);
    expect(approved).to.equal(true);
  });

  it("Simple Regisiter Domain", async () => {
    const domainByte = ethers.utils.toUtf8Bytes("domain");
    const tldByte = ethers.utils.toUtf8Bytes("classicalTLD");
    await use_classicalRegistrarController.register(domainByte, tldByte, addr1[0].address, 999999999999999);
    // await use_classicalRegistrarController.register((domainByte),tldByte,addr1[0].address,999999999999999)
    expect(await use_registry.isLive(ethers.utils.keccak256(domainByte), ethers.utils.keccak256(tldByte))).to.equal(true);
  });

  it("Set Text Record", async () => {
    // const [name, tld] = ("domain.classicalTLD").split('.');
    await use_publicResolver.setText(hostNode, nameNode, tldNode, "Text Set Text");
    expect(await use_publicResolver.getText(hostNode, nameNode, tldNode)).to.equal("Text Set Text");
    // const labelhash = ethers.utils.solidityKeccak256(['string', 'bytes32'], [name, basenode]);
    // const nodehash = ethers.utils.solidityKeccak256(['bytes32', 'bytes32'], [basenode, labelhash]);
  });
  it("Set Multi Text", async () => {
    await use_publicResolver.setMultiText(hostNode, nameNode, tldNode, "github", "0x14A1A496fABc43bFAfC358005dE336a7B5222b20");
    await use_publicResolver.setMultiText(subHostNode, nameNode, tldNode, "github", "0x14A1A496fABc43bFAfC358005dE336a7B5222b20");
    expect((await use_publicResolver.getMultiText(hostNode, nameNode, tldNode, "github")).toLowerCase()).to.equal("0x14A1A496fABc43bFAfC358005dE336a7B5222b20".toLowerCase());
  });

  it("Set Coins Address Record", async () => {
    // await use_publicResolver.setMultiCoinAddress()
    await use_publicResolver.setAddress(hostNode, nameNode, tldNode, "0x14A1A496fABc43bFAfC358005dE336a7B5222b20");
    expect(await use_publicResolver.getAddress(hostNode, nameNode, tldNode)).to.equal("0x14A1A496fABc43bFAfC358005dE336a7B5222b20");
  });

  it("Set Multi Coin Record", async () => {
    await use_publicResolver.setMultiCoinAddress(hostNode, nameNode, tldNode, 1, "0x14A1A496fABc43bFAfC358005dE336a7B5222b20");
    expect((await use_publicResolver.getMultiCoinAddress(hostNode, nameNode, tldNode, 1)).toLowerCase()).to.equal("0x14A1A496fABc43bFAfC358005dE336a7B5222b20".toLowerCase());
  });

  it("ReverseAddress", async () => {
    await use_publicResolver.setReverseAddress(hostNode, nameNode, tldNode, "0x14A1A496fABc43bFAfC358005dE336a7B5222b20");
    expect(await use_publicResolver.getReverseAddress("0x14A1A496fABc43bFAfC358005dE336a7B5222b20")).to.equal("domain.classicalTLD");
  });

  it("ReverseAddress-SubDomain", async () => {
    await use_publicResolver.setReverseAddress(subHostNode, nameNode, tldNode, "0x14A1A496fABc43bFAfC358005dE336a7B5222b20");
    expect(await use_publicResolver.getReverseAddress("0x14A1A496fABc43bFAfC358005dE336a7B5222b20")).to.equal("sub.domain.classicalTLD");
  });

  it("Owner of Domain", async () => {
    const owner = await use_registry["getOwner(bytes32,bytes32)"](ethers.utils.keccak256(nameNode), ethers.utils.keccak256(tldNode));
    expect(owner).to.equal(addr1[0].address);
  });

  it("Transfer", async () => {
    // await use_classicalRegistrarController.register((nameNode),tldNode,addr1[0].address,999999999999999)
    // console.log(await use_baseRegistrar["isExists(bytes,bytes)"](nameNode, tldNode));
    // console.log(await use_classicalRegistrarController["isAvailable(bytes,bytes)"](nameNode,tldNode));
    const tokenId = await use_registry["getTokenId(bytes,bytes)"](nameNode, tldNode);
    // console.log(await use_registry.ownerOf(tokenId))
    await use_registry.transferFrom(addr1[0].address, addr1[1].address, tokenId);
    expect(await use_registry["getOwner(bytes32,bytes32)"](ethers.utils.keccak256(nameNode), ethers.utils.keccak256(tldNode))).to.equal(addr1[1].address);
  });

  it("Set Record with wrong owner", async () => {
    try {
      await use_publicResolver.setMultiText(hostNode, nameNode, tldNode, "github", "new Owner");
    } catch (e) {
      console.log("Error Log:");
      console.log({ e });
      expect((await use_publicResolver.getMultiText(hostNode, nameNode, tldNode, "github")).toLowerCase()).to.equal("0x14A1A496fABc43bFAfC358005dE336a7B5222b20".toLowerCase());
    }
  });

  it("Set Record with wrong owner (sub domain)", async () => {
    try {
      await use_publicResolver.setMultiText(subHostNode, nameNode, tldNode, "github", "new Owner");
    } catch (e) {
      console.log("Error Log:");
      console.log({ e });
      expect((await use_publicResolver.getMultiText(subHostNode, nameNode, tldNode, "github")).toLowerCase()).to.equal("0x14A1A496fABc43bFAfC358005dE336a7B5222b20".toLowerCase());
    }
  });
});
