import {PublicResolver, Registry, SingletonRegistrar} from "../../typechain";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {ethers} from "hardhat";
import {expect} from "chai";
import {utils} from "ethers";

describe("SingletonRegistrar", function () {
    let resolver: PublicResolver;
    let registry: Registry;
    let singletonRegistrar:SingletonRegistrar
    let addr1: SignerWithAddress;
    let addr2: SignerWithAddress;
    const TLD = "test"
    const Domain = "alexb"
    // const TLD_byte = ethers.utils.toUtf8Bytes(TLD)
    const TLD_byte = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(TLD))
    const Domain_byte = ethers.utils.toUtf8Bytes(Domain)
    beforeEach(async function () {
        const Registry = await ethers.getContractFactory("Registry");
        registry = await Registry.deploy();
        await registry.deployed();
        [addr1, addr2] = await ethers.getSigners();
        await registry.initialize();

        const Resolver = await ethers.getContractFactory("PublicResolver");
        resolver = await Resolver.deploy();
        await resolver.deployed();
        await resolver.initialize(registry.address);

        const SingletonRegistrar = await ethers.getContractFactory("SingletonRegistrar")
        singletonRegistrar = await SingletonRegistrar.deploy();
        await singletonRegistrar.deployed()
        await singletonRegistrar.initialize(registry.address)

        //SET TLD
        await registry.grantRole(await registry.REGISTRAR_ROLE(), singletonRegistrar.address);
        await registry.grantRole(await registry.ROOT_ROLE(), addr1.address);
        await registry.grantRole(await registry.REGISTRAR_ROLE(), addr1.address);
        await registry["setRecord(string,address,address,bool,bool)"](TLD, addr1.address, resolver.address, true, false);
        //SET TLD END

        await singletonRegistrar.grantRole(await singletonRegistrar.ROOT_ROLE(),addr1.address)
    });

    it("Singleton Registrar init", async function () {
        expect(await registry.hasRole(await registry.REGISTRAR_ROLE(),singletonRegistrar.address)).to.equal(true)
        expect(await registry.hasRole(await registry.REGISTRAR_ROLE(),addr1.address)).to.equal(true)
        expect(await registry["exists(bytes32)"](TLD_byte)).to.equal(true)

    });

    it("Singleton Registrar Register", async function () {
        await singletonRegistrar.setControllerApproval(ethers.utils.toUtf8Bytes(TLD),addr1.address,true)
        // await singletonRegistrar.setControllerApproval(ethers.utils.toUtf8Bytes(TLD),"0x0000000000000000000000000000000000000000",true)
        const expirtDate = new Date();
        expirtDate.setMonth(expirtDate.getMonth() + 1);
        await singletonRegistrar.register(Domain_byte,ethers.utils.toUtf8Bytes(TLD),addr1.address,expirtDate.getTime())
    });
});