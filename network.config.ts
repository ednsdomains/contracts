export enum Network {
  ETHEREUM = 1,
  RINKEBY = 4,
  BNB_CHAIN = 56,
  BNB_CHAIN_TESTNET = 97,
  POLYGON = 137,
  POLYGON_MUMBAI = 80001,
  AVALANCHE = 43114,
  AVALANCHE_FUJI = 43113,
  FANTOM = 250,
  FANTOM_TESTNET = 4002,
  OPTIMISM = 10,
  OPTIMISM_KOVAN = 69,
  ARBITRUM = 42161,
  ARBITRUM_RINKEBY = 421611,
}

export const Mainnets = [Network.ETHEREUM, Network.BNB_CHAIN, Network.POLYGON, Network.AVALANCHE, Network.FANTOM, Network.OPTIMISM, Network.ARBITRUM];

export const Testnets = [
  Network.RINKEBY,
  Network.BNB_CHAIN_TESTNET,
  Network.POLYGON_MUMBAI,
  Network.AVALANCHE_FUJI,
  Network.FANTOM_TESTNET,
  Network.OPTIMISM_KOVAN,
  Network.ARBITRUM_RINKEBY,
];

export interface INetworkConfig {
  [chainId: number]: {
    chainId: number;
    name: string;
    symbol: string;
    url: string;
    layerzero: {
      chainId: number;
      endpoint: {
        address: string;
      };
    };
    chainlink: {
      token: {
        name: string;
        symbol: string;
        decimals: number;
        address: string;
      };
    };
    slip44: {
      coinId: number;
    };
    contract?: {
      Registry: string;
      PublicResolver: string;
      PublicResolverSynchronizer: string;
      SingletonRegistrar: string;
      SingletonRegistrarController: string;
      OmniRegistrar: string;
      OmniRegistrarController: string;
      omniRegistrarSynchronizer: string;
      Root: string;
      DomainPriceOracle: string;
      TokenPriceOracle: string;
      Token: string;
    };
  };
}

export interface IConfig {
  network: INetworkConfig;
}

const config: IConfig = {
  network: {
    [Network.ETHEREUM]: {
      chainId: 1,
      name: "Ethereum",
      symbol: "ETH",
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      slip44: {
        coinId: 60,
      },
      layerzero: {
        chainId: 1,
        endpoint: {
          address: "0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675",
        },
      },
      chainlink: {
        token: {
          name: "ChainLink Token",
          symbol: "LINK",
          decimals: 18,
          address: "0x514910771af9ca656af840dff83e8264ecf986ca",
        },
      },
    },
    [Network.RINKEBY]: {
      chainId: 4,
      name: "Ethereum Rinkeby",
      symbol: "rETH",
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      slip44: {
        coinId: 60,
      },
      layerzero: {
        chainId: 10001,
        endpoint: {
          address: "0x79a63d6d8BBD5c6dfc774dA79bCcD948EAcb53FA",
        },
      },
      chainlink: {
        token: {
          name: "ChainLink Token",
          symbol: "LINK",
          decimals: 18,
          address: "0x01BE23585060835E02B77ef475b0Cc51aA1e0709",
        },
      },
    },
    [Network.BNB_CHAIN]: {
      chainId: 56,
      name: "BNB Chain",
      symbol: "BNB",
      url: `https://bsc.getblock.io/mainnet/?api_key=${process.env.GETBLOCK_API_KEY}`,
      slip44: {
        coinId: 714,
      },
      layerzero: {
        chainId: 2,
        endpoint: {
          address: "0x3c2269811836af69497E5F486A85D7316753cf62",
        },
      },
      chainlink: {
        token: {
          name: "ChainLink Token",
          symbol: "LINK",
          decimals: 18,
          address: "0x404460c6a5ede2d891e8297795264fde62adbb75",
        },
      },
    },
    [Network.BNB_CHAIN_TESTNET]: {
      chainId: 97,
      name: "BNB Chain Testnet",
      symbol: "tBNB",
      url: `https://bsc.getblock.io/testnet/?api_key=${process.env.GETBLOCK_API_KEY}`,
      slip44: {
        coinId: 714,
      },
      layerzero: {
        chainId: 10002,
        endpoint: {
          address: "0x6Fcb97553D41516Cb228ac03FdC8B9a0a9df04A1",
        },
      },
      chainlink: {
        token: {
          name: "ChainLink Token",
          symbol: "LINK",
          decimals: 18,
          address: "0x84b9b910527ad5c03a9ca831909e21e236ea7b06",
        },
      },
    },
  },
};

export default config;
