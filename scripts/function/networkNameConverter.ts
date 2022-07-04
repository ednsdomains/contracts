import NetworkConfig, {Network} from "../../network.config";

export function networkNameConverter(networkName:string){
    const getConfig: Record<string, Network> = {
        mainnet:Network.ETHEREUM,
        rinkeby:Network.RINKEBY,
        bnb:Network.BNB_CHAIN,
        bnbTestnet: Network.BNB_CHAIN_TESTNET,
        avalanche:Network.AVALANCHE,
        avalancheFuji:Network.AVALANCHE_FUJI,
        polygon:Network.POLYGON,
        polygonMumbai:Network.POLYGON_MUMBAI,
        arbitrum:Network.ARBITRUM,
        arbitrumRinkeby:Network.ARBITRUM_RINKEBY,
        fantomTestnet: Network.FANTOM_TESTNET,
    };

    return getConfig[networkName]
}
