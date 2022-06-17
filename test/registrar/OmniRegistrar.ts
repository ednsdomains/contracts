import { expect } from "chai"
import { ethers } from "hardhat"
import {OmniRegistrar, PublicResolver} from "../../typechain";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";

describe("Omni Registrar: ", function () {
    const rinkebyChainID = 10001;
    const binanceChainID = 10002;
    let addr1:SignerWithAddress,addr2:SignerWithAddress, OmniRegistrar, lzEndPointRinkeby, lzEndPointBinance, LZEndpointMock, omniRinkeby:OmniRegistrar,omniBinance:OmniRegistrar,resolver:PublicResolver
    const TLD = "Test";
    const Domain = "alexb"
    const TLD_byte = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(TLD))
    const Domain_byte = ethers.utils.toUtf8Bytes(Domain)
    beforeEach(async function(){
        [addr1, addr2] = await ethers.getSigners();
        const Registry = await ethers.getContractFactory("Registry");
        const Rinkebyregistry = await Registry.deploy()
        await Rinkebyregistry.deployed()
        await Rinkebyregistry.initialize();

        const Binregistry = await Registry.deploy()
        await Binregistry.deployed()
        await Binregistry.initialize();

        const Resolver = await ethers.getContractFactory("PublicResolver");
        resolver = await Resolver.deploy();
        await resolver.deployed();
        //Create
        await Rinkebyregistry.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ROOT_ROLE")), addr1.address);
        await Rinkebyregistry["setRecord(string,address,address,bool,bool)"](TLD, addr1.address, resolver.address, true, false);

        await Binregistry.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ROOT_ROLE")), addr1.address);
        await Binregistry["setRecord(string,address,address,bool,bool)"](TLD, addr1.address, resolver.address, true, false);

        OmniRegistrar = await ethers.getContractFactory("OmniRegistrar");
        LZEndpointMock = await ethers.getContractFactory("LayerZeroEndpointMock")
        lzEndPointRinkeby = await LZEndpointMock.deploy(rinkebyChainID)
        lzEndPointBinance = await LZEndpointMock.deploy(binanceChainID)
        expect(await lzEndPointRinkeby.getChainId()).to.equal(rinkebyChainID)
        expect(await lzEndPointBinance.getChainId()).to.equal(binanceChainID)

 //------  deploy: base & other chain  -------------------------------------------------------
        omniRinkeby = await OmniRegistrar.deploy()
        await omniRinkeby.deployed()
        await omniRinkeby.initialize(Rinkebyregistry.address,lzEndPointRinkeby.address)
        omniBinance = await OmniRegistrar.deploy()
        await omniBinance.deployed()
        await omniBinance.initialize(Binregistry.address,lzEndPointRinkeby.address)
// internal bookkeeping for endpoints (not part of a real deploy, just for this test)
        lzEndPointRinkeby.setDestLzEndpoint(omniBinance.address,lzEndPointBinance.address)
        lzEndPointRinkeby.setDestLzEndpoint(omniRinkeby.address,lzEndPointRinkeby.address)
//------  setTrustedRemote(s) -------------------------------------------------------
        await omniBinance.setTrustedRemote(rinkebyChainID,omniRinkeby.address)
        await omniRinkeby.setTrustedRemote(binanceChainID,omniBinance.address)
//Set Controller Role
        await omniBinance.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ROOT_ROLE")), addr1.address);
        await omniBinance.setControllerApproval(ethers.utils.toUtf8Bytes(TLD),addr1.address,true)

        await Rinkebyregistry.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("REGISTRAR_ROLE")), omniRinkeby.address);
        await Rinkebyregistry.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("REGISTRAR_ROLE")), addr1.address);

        await Binregistry.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("REGISTRAR_ROLE")), omniBinance.address);
        await Binregistry.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("REGISTRAR_ROLE")), addr1.address);
    })
    it("sync Suc",async function(){
        const expirtDate = new Date();
        expirtDate.setMonth(expirtDate.getMonth() + 1);
        await omniBinance.register(Domain_byte,ethers.utils.toUtf8Bytes(TLD),addr1.address,Math.floor( expirtDate.getTime() / 1000))
        expect(await omniBinance["exists(bytes,bytes)"](ethers.utils.toUtf8Bytes(Domain),ethers.utils.toUtf8Bytes(TLD))).to.equal(true)
        expect(await omniRinkeby["exists(bytes,bytes)"](ethers.utils.toUtf8Bytes(Domain),ethers.utils.toUtf8Bytes(TLD))).to.equal(true)
    })
    it("",async function(){
        expect(1).to.equal(1)
    })


})
