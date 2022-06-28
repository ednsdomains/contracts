import {DeployChainIDs, TestnetConfig} from "../constant/layerzero-config";
import {ethers, upgrades} from "hardhat";
import {Registry} from "../typechain";

const hre = require("hardhat")

async function main(){
    const FANTOM_config = TestnetConfig["FANTOM"];
    const OmniRegistrarSynchronizer = await hre.ethers.getContractFactory("OmniRegistrarSynchronizer");
    const omniRegistrarSynchronizer = await upgrades.deployProxy(OmniRegistrarSynchronizer,[FANTOM_config.endpoint,FANTOM_config.chainId,DeployChainIDs], { initializer:'initialize',unsafeAllowCustomTypes: true })

    console.log("omniRegistrarSynchronizer deployed to:", omniRegistrarSynchronizer.address);

    const Registry = await ethers.getContractFactory("Registry");
    const registry = await upgrades.deployProxy(Registry,[], { initializer:'initialize',unsafeAllowCustomTypes: true,unsafeAllow: ['delegatecall'] })


    const Resolver = await ethers.getContractFactory("PublicResolver");
    const resolver = await Resolver.deploy();
    // await resolver.deployed()

    const OmniRegistrar = await ethers.getContractFactory("OmniRegistrar");
    const omniRegistrar = await upgrades.deployProxy(OmniRegistrar,[registry.address,omniRegistrarSynchronizer.address], {initializer:'initialize', unsafeAllowCustomTypes: true })
    // await registry.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ROOT_ROLE")), addr1.address);
    // await registry["setRecord(bytes,address,address,bool,bool)"](ethers.utils.toUtf8Bytes(TLD),addr1.address,resolver.address,false,true);
    console.log("omniRegistrar deployed to:", omniRegistrar.address);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
