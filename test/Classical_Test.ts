import {expect} from "chai";
import {ethers, upgrades} from "hardhat";
import {BaseRegistrar, ClassicalRegistrarController, PublicResolver, Registry, Token} from "../typechain";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";

describe("Classical Test", function () {
    let addr1: SignerWithAddress[];
    let fakeLzEndpointMock
    let use_registry:Registry
    let use_token:Token
    let use_publicResolver:PublicResolver
    let use_baseRegistrar:BaseRegistrar
    let use_classicalRegistrarController : ClassicalRegistrarController
    it("Deploy Contract", async () => {
        const srcChainID = 1
        addr1 = await ethers.getSigners();
        //Deploy LzEndpoint
        const LZEndpointMock = await ethers.getContractFactory("LayerZeroEndpointMock")
        fakeLzEndpointMock = await LZEndpointMock.deploy(srcChainID)

        //Deploy Registry
        const RegistryFactory = await ethers.getContractFactory("Registry");
        const _registry = await upgrades.deployProxy(RegistryFactory);
        await _registry.deployed();
        use_registry = RegistryFactory.attach(_registry.address);
        expect(use_registry.address).not.equal(null)

        //Deploy Token
        const TokenFactory = await ethers.getContractFactory("Token");
        const _token = await upgrades.deployProxy(TokenFactory, [await fakeLzEndpointMock.callStatic.getChainId(), fakeLzEndpointMock.address]);
        await _token.deployed();
        use_token = TokenFactory.attach(_token.address);
        expect(use_token.address).not.equal(null)

        //Deploy TokenPrice
        const TokenPriceOracleFactory = await ethers.getContractFactory("TokenPriceOracleMock");
        const tokenPriceOracle = await TokenPriceOracleFactory.deploy(
            '0x514910771af9ca656af840dff83e8264ecf986ca',
            '0x514910771af9ca656af840dff83e8264ecf986ca',
            ethers.utils.keccak256(ethers.utils.toUtf8Bytes("0")),
        );
        await tokenPriceOracle.deployed();
        expect(tokenPriceOracle.address).not.equal(null)

        //Deploy DomainPriceOracle
        const DomainPriceOracleFactory = await ethers.getContractFactory("DomainPriceOracle");
        const _domainPriceOracle = await upgrades.deployProxy(DomainPriceOracleFactory, [tokenPriceOracle.address]);
        await _domainPriceOracle.deployed();
        const domainPriceOracle = DomainPriceOracleFactory.attach(_domainPriceOracle.address);
        expect(domainPriceOracle.address).not.equal(null)

        //Deploy PublicResolver
        const PublicResolverSynchronizerFactory = await ethers.getContractFactory("PublicResolverSynchronizer");
        const _publicResolverSynchronizer = await upgrades.deployProxy(PublicResolverSynchronizerFactory, [
            fakeLzEndpointMock.address,
            await fakeLzEndpointMock.callStatic.getChainId(),
            [10002, 10012],
        ]);
        await _publicResolverSynchronizer.deployed();
        const publicResolverSynchronizer = PublicResolverSynchronizerFactory.attach(_publicResolverSynchronizer.address);
        expect(publicResolverSynchronizer.address).not.equal(null)

        //Deploy PublicResolver
        const PublicResolver = await ethers.getContractFactory("PublicResolver");
        const _publicResolver = await upgrades.deployProxy(PublicResolver, [_registry.address, _publicResolverSynchronizer.address], { unsafeAllow: ["delegatecall"] });
        await _publicResolver.deployed();
        use_publicResolver = PublicResolver.attach(_publicResolver.address);
        expect(_publicResolver.address).not.equal(null)

        //Deploy BaseRegistrar
        const BaseRegistrar = await ethers.getContractFactory("BaseRegistrar")
        const _baseRegistrar = await upgrades.deployProxy(BaseRegistrar,[_registry.address])
        await _baseRegistrar.deployed();
        use_baseRegistrar = BaseRegistrar.attach(_baseRegistrar.address)
        expect(_baseRegistrar.address).not.equal(null)

        //Deploy ClassicalRegistrarController
        const ClassicalRegistrarController = await ethers.getContractFactory("ClassicalRegistrarController")
        const _classicalRegistrarController = await upgrades.deployProxy(ClassicalRegistrarController,[_token.address,domainPriceOracle.address,tokenPriceOracle.address, _baseRegistrar.address,1] )
        await _classicalRegistrarController.deployed();
        use_classicalRegistrarController = ClassicalRegistrarController.attach(_classicalRegistrarController.address)
        expect(use_classicalRegistrarController.address).not.equal(null)

        await publicResolverSynchronizer.setResolver(use_publicResolver.address);
        await use_registry.grantRole(await use_registry.PUBLIC_RESOLVER_ROLE(), use_publicResolver.address);
        await use_registry.grantRole(await use_registry.REGISTRAR_ROLE(), use_classicalRegistrarController.address);
        await use_registry.grantRole(await use_registry.ROOT_ROLE(), addr1[0].address);
        await use_baseRegistrar.grantRole(await use_baseRegistrar.ROOT_ROLE(),addr1[0].address )
    });

    it("Regisiter TLD", async ()=>{
        const tldByte = ethers.utils.formatBytes32String("classicalTLD")
        await use_registry["setRecord(bytes,address,address,bool,uint8)"](tldByte,addr1[0].address,use_publicResolver.address,true,0 )

        const owner = await use_registry.callStatic["isExists(bytes32)"](ethers.utils.keccak256(tldByte))
        expect(owner).to.equal(true)

    })

    it("Approval Controller" , async()=>{
        const tldByte = ethers.utils.formatBytes32String("classicalTLD")
        let approved = await use_baseRegistrar.isControllerApproved(ethers.utils.keccak256(tldByte),use_classicalRegistrarController.address)
        expect(approved).to.equal(false)
        await use_baseRegistrar.setControllerApproval(tldByte,use_classicalRegistrarController.address,true)
        approved = await use_baseRegistrar.isControllerApproved(ethers.utils.keccak256(tldByte),use_classicalRegistrarController.address)
        expect(approved).to.equal(true)
    })
    it("Regisiter Domain", async ()=>{
        const domainByte = ethers.utils.formatBytes32String("domain")
        const tldByte = ethers.utils.formatBytes32String("classicalTLD")
        console.log(domainByte)
        await use_classicalRegistrarController.register((domainByte),tldByte,addr1[0].address,9999999)
    })



})
