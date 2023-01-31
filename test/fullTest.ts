import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {
    ClassicalRegistrarController,
    LayerZeroEndpointMock,
    PublicResolver, Registrar,
    Registry, Root, TokenMock, Wrapper
} from "../typechain";
import {ethers} from "hardhat";
import {deployLayerZero} from "./lastest/deploy/layerZeroEndPointMock";
import {deployRegistry} from "./lastest/deploy/01_registry";
import {expect} from "chai";
import {deployWrapper} from "../scripts/src/deploy";
import {deployDefaultWrapper} from "./lastest/deploy/02_deploy_DefaultWrapper";
import {deployPublicResolver} from "./lastest/deploy/03_publicResolver";
import {deployRegistrar} from "./lastest/deploy/04_registrar";
import {deployRoot} from "./lastest/deploy/05_root";
import {deployTokenMock} from "./lastest/deploy/06_tokenMock";
import {deployClassicalRegistrarController} from "./lastest/deploy/07_classicalRegistrarController";

describe("Classical Test",    function () {
    let signerList: SignerWithAddress[];
    // let fakeLzEndpointMock:LayerZeroEndpointMock;
    let use_registry: Registry;
    let use_registry_ac2: Registry;
    let use_defaultWrapper: Wrapper;
    let use_publicResolver: PublicResolver;
    let use_publicResolver_ac2: PublicResolver;
    let use_registrar: Registrar;
    let use_root :Root
    let use_token:TokenMock
    let use_classicalRegistrarController: ClassicalRegistrarController;
    const hostNode = ethers.utils.toUtf8Bytes("@");
    const subHostNode = ethers.utils.toUtf8Bytes("sub");
    const tldNode = ethers.utils.toUtf8Bytes("ablcll");
    const nameNode = ethers.utils.toUtf8Bytes("domain");
    const srcChainID = 1;

    it("get Signer", async () => {
        signerList = await ethers.getSigners()
    })
    describe("Deploy Contract",    function () {
        it("Registry", async () => {
            [use_registry, use_registry_ac2] = await deployRegistry(signerList[1])
            expect(use_registry.address).not.equals(null)
            expect(await use_registry.signer.getAddress()).not.equals(await use_registry_ac2.signer.getAddress())
        })
        it("DefaultWrapper", async () => {
            use_defaultWrapper = await deployDefaultWrapper({
                registryAddress: use_registry.address,
                nftName: "Test Name Service",
                nftSymbol: "TNS"
            })
            expect(use_defaultWrapper.address).not.equals(null)
        })
        it("PublicResolver", async () => {
            [use_publicResolver, use_publicResolver_ac2] = await deployPublicResolver(signerList[1], {registryAddress: use_registry.address})
            expect(use_publicResolver.address).not.equals(null)
            expect(await use_publicResolver.signer.getAddress()).not.equals(await use_publicResolver_ac2.signer.getAddress())
        })

        it("Registrar", async () => {
            use_registrar = await deployRegistrar({
                registryAddress: use_registry.address,
                resolverAddress: use_publicResolver.address
            })
            expect(use_registrar.address).not.equals(null)
        })

        it("Root", async () => {
            use_root = await deployRoot({
                registryAddress: use_registry.address,
                registrarAddress: use_registrar.address
            })
            expect(use_root.address).not.equals(null)
        })

        it("TokenMock", async () => {
            use_token = await deployTokenMock()
            expect(use_token.address).not.equals(null)
        })

        it("Classical Registrar Controller", async () => {
            use_classicalRegistrarController = await deployClassicalRegistrarController({
                tokenAddress: use_token.address,
                registrarAddress: use_registrar.address,
                rootAddress: use_root.address
            })
            expect(use_classicalRegistrarController).not.equals(null)
        })
    })
    describe("Setup Contract",    function () {
        it("grant Role", async ()=>{
            await use_registry.grantRole(await use_registry.ROOT_ROLE(), signerList[0].address);
        })
    })
    describe("TLD  Test", function (){
        it("Set tld record", async () => {
            let today = new Date()
            const exipryDate = today.setFullYear(today.getFullYear()+1)
            await use_registry["setRecord(bytes,address,address,uint64,bool,uint8)"](tldNode,signerList[0].address,use_publicResolver.address,exipryDate,true,0);
            const owner = await use_registry.callStatic["isExists(bytes32)"](ethers.utils.keccak256(tldNode));
            expect(owner).to.equal(true);
        });
        it("Set tld existed record", async () => {
            let throwError = false
            try {
                let today = new Date()
                const exipryDate = today.setFullYear(today.getFullYear()+1)
                await use_registry["setRecord(bytes,address,address,uint64,bool,uint8)"](tldNode,signerList[0].address,use_publicResolver.address,exipryDate,true,0);
                const owner = await use_registry.callStatic["isExists(bytes32)"](ethers.utils.keccak256(tldNode));
                expect(owner).to.equal(true);
            }catch (e) {
                throwError = true
            }
           expect(throwError).to.equal(true)
        });
    })
})
