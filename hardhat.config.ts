import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.2",
      },
      {
        version: "0.8.10",
      },
    ],
  },
  // etherscan: {
  //   apiKey: "",
  // },
  networks: {
    matic: {
      url: `https://polygon-rpc.com`,
    },
    maticmum: {
      url:
        `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_API_KEY}` ||
        "",
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}` || "",
    },
    iotexTestnet: {
      url: `https://babel-api.testnet.iotex.io`,
      chainId: 4690,
      gas: 8500000,
      gasPrice: 1000000000000,
    },
    iotex: {
      url: `https://babel-api.mainnet.iotex.io`,
      chainId: 4689,
    },
    okcTestnet: {
      url: `https://exchaintestrpc.okex.org`,
      chainId: 65,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
