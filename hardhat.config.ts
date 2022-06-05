import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
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
    version: process.env.SOLIDITY_VERSION || "0.8.9",
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
      url: ``,
    },
    rinkeby: {
      chainId: 4,
      url: ``,
    },
    // BNB Chain
    bsc: {
      chainId: 56,
      url: ``,
    },
    bscTestnet: {
      chainId: 97,
      url: ``,
    },
    // Fantom
    opera: {
      chainId: 250,
      url: ``,
    },
    ftmTestnet: {
      chainId: 4002,
      url: ``,
    },
    // Optimism
    optimisticEthereum: {
      chainId: 10,
      url: ``,
    },
    optimisticKovan: {
      chainId: 69,
      url: ``,
    },
    // Polygon
    polygon: {
      chainId: 137,
      url: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}` || "",
    },
    polygonMumbai: {
      chainId: 80001,
      url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_API_KEY}` || "",
    },
    // Arbitrum
    arbitrumOne: {
      chainId: 42161,
      url: ``,
    },
    arbitrumTestnet: {
      chainId: 421611,
      url: ``,
    },
    // Avalanche
    avalanche: {
      chainId: 43114,
      url: ``,
    },
    avalancheFujiTestnet: {
      chainId: 43113,
      url: ``,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  mocha: {
    parallel: true,
  },
  contractSizer: {
    alphaSort: false,
    runOnCompile: true,
    disambiguatePaths: false,
    only: ["Registry", "SingletonRegistrar", "SingletonRegistrarController", "Token", "DomainPriceOracle", "TokenPriceOracle", "PublicResolver", "Root"],
  },
};

export default config;
