import { expect } from "chai"
import { ethers } from "hardhat"

describe("Omni Registrar: ", function () {
    const rinkebyChainID = 10001
    const binanceChainID = 10002
    let owner, OmniRegistrar, lzEndPointRinkeby, lzEndPointBinance, LZEndpointMock, omniRinkeby,omniBinance

    beforeEach(async function(){
        const Registry = await ethers.getContractFactory("Registry");
        const registry = await Registry.deploy()
        await registry.deployed()

        OmniRegistrar = await ethers.getContractFactory("OmniRegistrar");
        LZEndpointMock = await ethers.getContractFactory("LayerZeroEndpointMock")
        lzEndPointRinkeby = await LZEndpointMock.deploy(rinkebyChainID)
        lzEndPointBinance = await LZEndpointMock.deploy(binanceChainID)
        expect(await lzEndPointRinkeby.getChainId()).to.equal(rinkebyChainID)
        expect(await lzEndPointBinance.getChainId()).to.equal(binanceChainID)

 //------  deploy: base & other chain  -------------------------------------------------------
        omniRinkeby = await OmniRegistrar.deploy()
        await omniRinkeby.deployed()
        await omniRinkeby.initialize(registry.address,lzEndPointRinkeby.address)
        omniBinance = await OmniRegistrar.deploy()
        await omniBinance.deployed()
        await omniBinance.initialize(registry.address,lzEndPointRinkeby.address)
// internal bookkeeping for endpoints (not part of a real deploy, just for this test)
        lzEndPointRinkeby.setDestLzEndpoint(omniBinance.address,lzEndPointBinance.address)
        lzEndPointRinkeby.setDestLzEndpoint(omniRinkeby.address,lzEndPointRinkeby.address)
//------  setTrustedRemote(s) -------------------------------------------------------
        await omniBinance.setTrustedRemote(rinkebyChainID,omniRinkeby.address)
        await omniRinkeby.setTrustedRemote(binanceChainID,omniBinance.address)

    })
    it("",async function(){
        expect(1).to.equal(1)
    })


})