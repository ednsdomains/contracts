import * as dotenv from "dotenv";

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
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    goerli: {
      chainId: 4,
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    // BNB Chain
    bnb: {
      chainId: 56,
      url: `https://bsc.getblock.io/${process.env.GETBLOCK_API_KEY}/mainnet/`,
    },
    bnb_testnet: {
      chainId: 97,
      url: `https://bsc.getblock.io/${process.env.GETBLOCK_API_KEY}/testnet/`,
    },
    // Fantom
    fantom: {
      chainId: 250,
      url: `https://ftm.getblock.io/${process.env.GETBLOCK_API_KEY}/mainnet/`,
    },
    fantom_testnet: {
      chainId: 4002,
      url: `https://rpc.testnet.fantom.network/`,
    },
    // Optimism
    optimisim: {
      chainId: 10,
      url: `https://optimism-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    optimisim_kovan: {
      chainId: 69,
      url: `https://optimism-kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    // Polygon
    polygon: {
      chainId: 137,
      url: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    polygon_mumbai: {
      chainId: 80001,
      url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    // Arbitrum
    arbitrum: {
      chainId: 42161,
      url: `https://arbitrum-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    arbitrum_rinkeby: {
      chainId: 421611,
      url: `https://arbitrum-rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    // Avalanche
    avalanche: {
      chainId: 43114,
      url: `https://avalanche-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    avalanche_fuji: {
      chainId: 43113,
      url: `https://avalanche-fuji.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    gnosis: {
      chainId: 100,
      url: `https://solitary-dimensional-frost.xdai.quiknode.pro/${process.env.QUICKNODE_API_KEY}/`,
    },
    iotex: {
      chainId: 4689,
      url: `https://rpc.ankr.com/iotex`,
    },
    iotex_testnet: {
      chainId: 4690,
      url: `https://babel-api.testnet.iotex.io`,
    },
    okc: {
      chainId: 66,
      url: `https://exchainrpc.okex.org`,
    },
    okc_testnet: {
      chainId: 65,
      url: `https://exchaintestrpc.okex.org`,
    },
    kcc: {
      chainId: 321,
      url: `https://kcc.getblock.io/${process.env.GETBLOCK_API_KEY}/mainnet/`,
    },
    kcc_testnet: {
      chainId: 322,
      url: `https://rpc-testnet.kcc.network`,
    },
    mixin: {
      chainId: 73927,
      url: `https://geth.mvm.dev`,
    },
    cronos: {
      chainId: 25,
      url: `https://cro.getblock.io/${process.env.GETBLOCK_API_KEY}/mainnet/`,
    },
    cronos_testnet: {
      chainId: 338,
      url: `https://evm-t3.cronos.org`,
    },
    celo: {
      chainId: 42220,
      url: `https://celo-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    celo_alfajores: {
      chainId: 44787,
      url: `https://celo-alfajores.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    evmos: {
      chainId: 9001,
      url: `https://eth.bd.evmos.org:8545`,
    },
    evmos_testmet: {
      chainId: 9000,
      url: `https://eth.bd.evmos.dev:8545`,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY || undefined,
    showTimeSpent: true,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  contractSizer: {
    alphaSort: false,
    runOnCompile: true,
    disambiguatePaths: false,
    only: [
      "Registry",
      "BaseRegistrar",
      "ClassicalRegistrarController",
      "UniversalRegistrarController",
      "BatchRegistrarController",
      "PublicResolver",
      "Root",
      "Wrapper",
      "Bridge",
      "Portal",
      "LayerZeroProvider",
    ],
  },
};

if (config.networks) {
  for (const net of Object.keys(config.networks)) {
    config.networks[net]!.accounts = process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : undefined;
  }
}

// const task_init = async (taskArgs: any, hre_: HardhatRuntimeEnvironment): Promise<{ signer: SignerWithAddress; network: Network; networks: Network[] }> => {
//   const networks = !!taskArgs["mainnet"] ? Mainnets : Testnets;
//   const network = hre_.network.config.chainId;
//   if (!network) throw new Error("Chain ID not set");
//   const signer = await createSigner(network);
//   if (!networks.includes(network)) throw new Error("Incorrect network");
//   return { signer, network, networks };
// };

// ================================= //
// ========== Deployment ========== //
// ================================= //
// task("deploy:token")
//   .addOptionalParam("mainnet", "Deploy on mainnet", false, types.boolean)
//   .setAction(async (taskArgs, hre) => {
//     const { signer, network, networks } = await task_init(taskArgs, hre);
//     await deployToken({ signer, networks, network });
//   });
//
// // =========================== //
// // ========== Setup ========== //
// // =========================== //
// //
// // ============================= //
// // ========== Upgrade ========== //
// // ============================= //
// task("upgrade:token")
//   .addOptionalParam("mainnet", "Deploy on mainnet", false, types.boolean)
//   .setAction(async (taskArgs, hre) => {
//     const { signer, network, networks } = await task_init(taskArgs, hre);
//     const contracts = await load(network, signer);
//     await upgradeToken({ signer, contracts });
//   });

export default config;
