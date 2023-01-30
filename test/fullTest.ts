import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {BaseRegistrar, ClassicalRegistrarController, PublicResolver, Registry} from "../typechain";
import {ethers} from "hardhat";
import {deployLayerZero} from "./lastest/deploy/layerZeroEndPointMock";
import {deployRegistry} from "./lastest/deploy/registry";
import {expect} from "chai";

describe("Classical Test",   function () {
    let signerList: SignerWithAddress[] ;
    let fakeLzEndpointMock;
    let use_registry: Registry;
    let use_registry_ac2: Registry;
    let use_publicResolver: PublicResolver;
    let use_publicResolver_ac2: PublicResolver;
    let use_baseRegistrar: BaseRegistrar;
    let use_classicalRegistrarController: ClassicalRegistrarController;
    const hostNode = ethers.utils.toUtf8Bytes("@");
    const subHostNode = ethers.utils.toUtf8Bytes("sub");
    const tldNode = ethers.utils.toUtf8Bytes("classicalTLD");
    const nameNode = ethers.utils.toUtf8Bytes("domain");
    const srcChainID = 1;


    it("Deploy Contract - FakeLzEndpointMock", async () => {
        signerList = await ethers.getSigners()
        fakeLzEndpointMock = await deployLayerZero(srcChainID)
        expect(fakeLzEndpointMock.address).not.equals(null)
    })
    it("Deploy Contract - Registry", async () => {
        [use_registry, use_registry_ac2] = await deployRegistry(signerList[1])
        expect(use_registry.address).not.equals(null)
    })

})
