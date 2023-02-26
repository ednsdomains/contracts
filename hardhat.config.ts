import * as dotenv from "dotenv";
import NetworkConfig from "./network.config";
import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-web3";
import "@nomiclabs/hardhat-solhint";
import "@nomiclabs/hardhat-etherscan";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "hardhat-contract-sizer";
import "solidity-coverage";

dotenv.config();
// https://hardhat.org/config/
// https://hardhat.org/guides/compile-contracts/
const config: HardhatUserConfig = {
  solidity: {
    version: process.env.SOLIDITY_VERSION || "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Ethereum
    mainnet: {
      chainId: 1,
    },
    goerli: {
      chainId: 5,
    },
    // BNB Chain
    bnb: {
      chainId: 56,
    },
    bnb_testnet: {
      chainId: 97,
    },
    // Fantom
    fantom: {
      chainId: 250,
    },
    fantom_testnet: {
      chainId: 4002,
    },
    // Optimism
    optimisim: {
      chainId: 10,
    },
    optimisim_goerli: {
      chainId: 420,
    },
    // Polygon
    polygon: {
      chainId: 137,
    },
    polygon_mumbai: {
      chainId: 80001,
    },
    // Arbitrum
    arbitrum: {
      chainId: 42161,
    },
    arbitrum_goerli: {
      chainId: 421613,
    },
    // Avalanche
    avalanche: {
      chainId: 43114,
    },
    avalanche_fuji: {
      chainId: 43113,
    },
    gnosis: {
      chainId: 100,
    },
    gnosis_chiado: {
      chainId: 10200,
    },
    iotex: {
      chainId: 4689,
    },
    iotex_testnet: {
      chainId: 4690,
    },
    okc: {
      chainId: 66,
    },
    okc_testnet: {
      chainId: 65,
    },
    kcc: {
      chainId: 321,
    },
    kcc_testnet: {
      chainId: 322,
    },
    mixin: {
      chainId: 73927,
    },
    cronos: {
      chainId: 25,
    },
    cronos_testnet: {
      chainId: 338,
    },
    celo: {
      chainId: 42220,
    },
    celo_alfajores: {
      chainId: 44787,
    },
    evmos: {
      chainId: 9001,
    },
    evmos_testmet: {
      chainId: 9000,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY || undefined,
    showTimeSpent: true,
  },
  etherscan: {
    // https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-etherscan#adding-support-for-other-networks
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY || "",
      goerli: process.env.ETHERSCAN_API_KEY || "",
      polygon: process.env.POLYGONSCAN_API_KEY || "",
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || "",
      bsc: process.env.BSCSCAN_API_KEY || "",
      bscTestnet: process.env.BSCSCAN_API_KEY || "",
      optimisticEthereum: process.env.OPTIMISTIC_ETHERSCAN_API_KEY || "",
      optimisticGoerli: process.env.OPTIMISTIC_ETHERSCAN_API_KEY || "",
      avalanche: process.env.SNOWTRACE_API_KEY || "",
      avalancheFujiTestnet: process.env.SNOWTRACE_API_KEY || "",
      arbitrumOne: process.env.ARBISCAN_API_KEY || "",
      arbitrumGoerli: process.env.ARBISCAN_API_KEY || "",
      gnosis: process.env.GNOSISSCAN_API_KEY || "",
      ftm: process.env.FTMSCAN_API_KEY || "",
      ftmTestnet: process.env.FTMSCAN_API_KEY || "",
    },
    customChains: [],
  },
  contractSizer: {
    alphaSort: false,
    runOnCompile: true,
    disambiguatePaths: false,
    only: [
      "Registry",
      "Registrar",
      "ClassicalRegistrarController",
      "UniversalRegistrarController",
      "BatchRegistrarController",
      "PublicResolver",
      "Root",
      "Wrapper",
      "Bridge",
      "Portal",
      "Synchronizer",
      "LayerZeroProvider",
    ],
  },
};

if (config.networks) {
  for (const network in config.networks) {
    const chainId = config.networks[network]?.chainId;
    if (chainId) {
      if (NetworkConfig[chainId]) {
        // @ts-ignore
        config.networks[network].url = NetworkConfig[chainId].url;
        if (process.env.PRIVATE_KEY) config.networks[network]!.accounts = [process.env.PRIVATE_KEY];
      } else {
        delete config.networks[network];
      }
    }
  }
}
export default config;
