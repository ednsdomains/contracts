import hre, {ethers, upgrades} from 'hardhat'
import {Wallet} from "ethers";
import NetworkConfig, {IConfig, INetworkConfig, Network} from "../network.config";
import {NETWORKS} from "../test/helpers/init";


//npx hardhat run scripts/deploy-Test.ts --network fantomTestnet
//npx hardhat run scripts/deploy-Test.ts --network bnbTestnet
async function deploy() {
    const getConfig : Record<string, any> = {
        bnbTestnet: NetworkConfig.network[Network.BNB_CHAIN_TESTNET],
        fantomTestnet: NetworkConfig.network[Network.FANTOM_TESTNET],
    }
    const provider = new hre.ethers.providers.JsonRpcProvider(
        getConfig[hre.network.name].url, {
        chainId: getConfig[hre.network.name].chainId,
        name: getConfig[hre.network.name].name,
    });

    // let walletMnemonic = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    let walletMnemonic = Wallet.fromMnemonic(process.env.MNEMONIC!)
    walletMnemonic = walletMnemonic.connect(provider)

    const RegistryFactory = await ethers.getContractFactory("Registry", walletMnemonic);
    const _registry = await upgrades.deployProxy(RegistryFactory);
    await _registry.deployed();
    const registry = RegistryFactory.attach(_registry.address);

    const PublicResolverSynchronizerFactory = await ethers.getContractFactory("PublicResolverSynchronizer");
    const _publicResolverSynchronizer = await upgrades.deployProxy(PublicResolverSynchronizerFactory, [
        getConfig[hre.network.name].layerzero.endpoint.address,
        getConfig[hre.network.name].layerzero.chainId,
        [10002,10012],
    ]);
    await _publicResolverSynchronizer.deployed();
    const publicResolverSynchronizer = PublicResolverSynchronizerFactory.attach(_publicResolverSynchronizer.address);

    const PublicResolver = await ethers.getContractFactory("PublicResolver");
    const _publicResolver = await upgrades.deployProxy(PublicResolver, [registry.address, publicResolverSynchronizer.address], { unsafeAllow: ["delegatecall"] });
    await _publicResolver.deployed();
    const publicResolver = PublicResolver.attach(_publicResolver.address);

    const OmniRegistrarSynchronizerFactory = await ethers.getContractFactory("OmniRegistrarSynchronizer");
    const _omniRegistrarSynchronizer = await upgrades.deployProxy(OmniRegistrarSynchronizerFactory, [
        getConfig[hre.network.name].layerzero.endpoint.address,
        getConfig[hre.network.name].layerzero.chainId,
        [10002,10012],
    ]);
    await _omniRegistrarSynchronizer.deployed();
    const omniRegistrarSynchronizer = OmniRegistrarSynchronizerFactory.attach(_omniRegistrarSynchronizer.address);

    const OmniRegistrarFactory = await ethers.getContractFactory("OmniRegistrar");
    const _omniRegistrar = await upgrades.deployProxy(OmniRegistrarFactory, [registry.address, omniRegistrarSynchronizer.address]);
    await _omniRegistrar.deployed();
    const omniRegistrar = OmniRegistrarFactory.attach(_omniRegistrar.address);

    await registry.grantRole(await registry.PUBLIC_RESOLVER_ROLE(),publicResolver.address)
    await registry.grantRole(await registry.REGISTRAR_ROLE(),omniRegistrar.address)
    console.log("registry",_registry.address)
    console.log("omniRegistrar",_omniRegistrar.address)
    console.log("omniRegistrarSynchronizer",_omniRegistrarSynchronizer.address)
    console.log("publicResolver",_publicResolver.address)
    console.log("publicResolverSynchronizer",_publicResolverSynchronizer.address)


}
async function main(){
    await deploy();
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
