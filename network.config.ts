import { InContractChain } from "./scripts/src/constants/in-contract-chain";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export enum Network {
  ETHEREUM = 1,
  GOERLI = 5,
  BNB_CHAIN = 56,
  BNB_CHAIN_TESTNET = 97,
  POLYGON = 137,
  POLYGON_MUMBAI = 80001,
  AVALANCHE = 43114,
  AVALANCHE_FUJI = 43113,
  FANTOM = 250,
  FANTOM_TESTNET = 4002,
  OPTIMISM = 10,
  OPTIMISM_GOERLI = 420,
  ARBITRUM = 42161,
  ARBITRUM_GOERLI = 421613,
  IOTEX = 4689,
  IOTEX_TESTNET = 4690,
  OKC = 66,
  OKC_TESTNET = 65,
  HECO = 128,
  HECO_TESTNET = 256,
  KCC = 321,
  KCC_TESTNET = 322,
  VELAS_EVM = 106,
  VELAS_EVM_TESTNET = 111,
  GNOSIS = 100,
  GNOSIS_CHIADO = 10200,
  MOONBEAM = 1284,
  MOONRIVER = 1285,
  // CRONOS = 25,
  // CRONOS_TESTNET = 338,
  // EVMOS = 9001,
  // EVMOS_TESTNET = 9000,
  // KLAYTN = 8217,
  // KLAYTN_TESTNET = 1001,
  // AURORA = 1313161554,
  // AURORA_TESTNET = 1313161555,
  // FUSE = 122,
  // FUSE_TESTNET = 123,
  // CELO = 42220,
  // CELO_ALFAJORES = 44787,
  // TELOS_EVM = 40,
  // TELOS_EVM_TESTNET = 41
}

export const Mainnets = [Network.ETHEREUM, Network.BNB_CHAIN, Network.POLYGON, Network.AVALANCHE, Network.FANTOM, Network.OPTIMISM, Network.ARBITRUM, Network.GNOSIS];

export const Testnets = [
  Network.GOERLI,
  Network.BNB_CHAIN_TESTNET,
  Network.POLYGON_MUMBAI,
  Network.AVALANCHE_FUJI,
  Network.FANTOM_TESTNET,
  Network.OPTIMISM_GOERLI,
  Network.ARBITRUM_GOERLI,
  Network.GNOSIS_CHIADO,
];

export interface INetworkConfig {
  [chainId: number]: {
    chain?: InContractChain;
    chainId: number;
    name: string;
    symbol: string;
    url: string;
    layerzero?: {
      chainId: number;
      endpoint: {
        address: string;
      };
    };
    chainlink?: {
      token: {
        name: string;
        symbol: string;
        decimals: number;
        address: string;
      };
      api?: {
        oracle: {
          address: string;
        };
        jobId: string;
      };
    };
    slip44?: {
      coinId: number;
    };
  };
}

export interface IConfig {
  network: INetworkConfig;
}

const config: INetworkConfig = {
  [Network.ETHEREUM]: {
    chainId: Network.ETHEREUM,
    chain: InContractChain.ETHEREUM,
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
  [Network.GOERLI]: {
    chainId: Network.GOERLI,
    chain: InContractChain.ETHEREUM,
    name: "Ethereum Goerli",
    symbol: "gETH",
    url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
    slip44: {
      coinId: 60,
    },
    layerzero: {
      chainId: 10121,
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
    chainId: Network.BNB_CHAIN,
    chain: InContractChain.BNB,
    name: "BNB Chain",
    symbol: "BNB",
    url: `https://bsc.getblock.io/${process.env.GETBLOCK_API_KEY}/mainnet/`,
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
    chainId: Network.BNB_CHAIN_TESTNET,
    chain: InContractChain.BNB,
    name: "BNB Chain Testnet",
    symbol: "tBNB",
    url: `https://bsc.getblock.io/${process.env.GETBLOCK_API_KEY}/testnet/`,
    slip44: {
      coinId: 714,
    },
    layerzero: {
      chainId: 10102,
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
  [Network.AVALANCHE]: {
    chainId: Network.AVALANCHE,
    chain: InContractChain.AVALANCHE,
    name: "Avalanche C-Chain",
    symbol: "AVAX",
    url: `https://avalanche-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    slip44: {
      coinId: 9005,
    },
    layerzero: {
      chainId: 6,
      endpoint: {
        address: "0x3c2269811836af69497E5F486A85D7316753cf62",
      },
    },
    chainlink: {
      token: {
        name: "ChainLink Token on Avalanche",
        symbol: "LINK",
        decimals: 18,
        address: "0x5947BB275c521040051D82396192181b413227A3",
      },
    },
  },
  [Network.AVALANCHE_FUJI]: {
    chainId: Network.AVALANCHE_FUJI,
    chain: InContractChain.AVALANCHE,
    name: "Avalanche Fuji",
    symbol: "AVAX",
    url: `https://avalanche-fuji.infura.io/v3/${process.env.INFURA_API_KEY}`,
    slip44: {
      coinId: 9005,
    },
    layerzero: {
      chainId: 10106,
      endpoint: {
        address: "0x93f54D755A063cE7bB9e6Ac47Eccc8e33411d706",
      },
    },
    chainlink: {
      token: {
        name: "ChainLink Token on Avalanche",
        symbol: "LINK",
        decimals: 18,
        address: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
      },
    },
  },
  [Network.POLYGON]: {
    chainId: Network.POLYGON,
    chain: InContractChain.POLYGON,
    name: "Polygon",
    symbol: "MATIC",
    url: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    slip44: {
      coinId: 966,
    },
    layerzero: {
      chainId: 9,
      endpoint: {
        address: "0x3c2269811836af69497E5F486A85D7316753cf62",
      },
    },
    chainlink: {
      token: {
        name: "ChainLink Token",
        symbol: "LINK",
        decimals: 18,
        address: "0xb0897686c545045afc77cf20ec7a532e3120e0f1",
      },
    },
  },
  [Network.POLYGON_MUMBAI]: {
    chainId: Network.POLYGON_MUMBAI,
    chain: InContractChain.POLYGON,
    name: "Polygon Mumbai",
    symbol: "MATIC",
    url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_API_KEY}`,
    slip44: {
      coinId: 966,
    },
    layerzero: {
      chainId: 10109,
      endpoint: {
        address: "0xf69186dfBa60DdB133E91E9A4B5673624293d8F8",
      },
    },
    chainlink: {
      token: {
        name: "ChainLink Token",
        symbol: "LINK",
        decimals: 18,
        address: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
      },
    },
  },
  [Network.ARBITRUM]: {
    chainId: Network.ARBITRUM,
    chain: InContractChain.ARBITRUM,
    name: "Arbitrum",
    symbol: "ETH",
    url: `https://arbitrum-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    slip44: {
      coinId: 9001,
    },
    layerzero: {
      chainId: 10,
      endpoint: {
        address: "0x3c2269811836af69497E5F486A85D7316753cf62",
      },
    },
    chainlink: {
      token: {
        name: "ChainLink Token on Arbitrum Mainnet",
        symbol: "LINK",
        decimals: 18,
        address: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
      },
    },
  },
  [Network.ARBITRUM_GOERLI]: {
    chainId: Network.ARBITRUM_GOERLI,
    chain: InContractChain.ARBITRUM,
    name: "Arbitrum Goerli",
    symbol: "ETH",
    url: `https://arbitrum-goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
    slip44: {
      coinId: 9001,
    },
    layerzero: {
      chainId: 10143,
      endpoint: {
        address: "0x4D747149A57923Beb89f22E6B7B97f7D8c087A00",
      },
    },
    chainlink: {
      token: {
        name: "ChainLink Token on Arbitrum Goerli",
        symbol: "LINK",
        decimals: 18,
        address: "0x615fBe6372676474d9e6933d310469c9b68e9726",
      },
    },
  },
  [Network.OPTIMISM]: {
    chainId: Network.OPTIMISM,
    chain: InContractChain.OPTIMISM,
    name: "Optimism",
    symbol: "ETH",
    url: `https://optimism-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    slip44: {
      coinId: 614,
    },
    layerzero: {
      chainId: 11,
      endpoint: {
        address: "0x3c2269811836af69497E5F486A85D7316753cf62",
      },
    },
    chainlink: {
      token: {
        name: "ChainLink Token on Optimism Mainnet",
        symbol: "LINK",
        decimals: 18,
        address: "0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6",
      },
    },
  },
  [Network.OPTIMISM_GOERLI]: {
    chainId: Network.OPTIMISM_GOERLI,
    chain: InContractChain.OPTIMISM,
    name: "Optimism Goerli",
    symbol: "ETH",
    url: `https://optimism-goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
    slip44: {
      coinId: 614,
    },
    layerzero: {
      chainId: 10132,
      endpoint: {
        address: "0x72aB53a133b27Fa428ca7Dc263080807AfEc91b5",
      },
    },
    chainlink: {
      token: {
        name: "ChainLink Token on Optimism Goerli",
        symbol: "LINK",
        decimals: 18,
        address: "0x4911b761993b9c8c0d14Ba2d86902AF6B0074F5B",
      },
    },
  },
  [Network.FANTOM]: {
    chainId: Network.FANTOM,
    chain: InContractChain.FANTOM,
    name: "Fantom",
    symbol: "FTM",
    url: `https://ftm.getblock.io/${process.env.GETBLOCK_API_KEY}/mainnet/`,
    slip44: {
      coinId: 1007,
    },
    layerzero: {
      chainId: 12,
      endpoint: {
        address: "0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7",
      },
    },
    chainlink: {
      token: {
        name: "ChainLink Token on Fantom",
        symbol: "LINK",
        decimals: 18,
        address: "0x6F43FF82CCA38001B6699a8AC47A2d0E66939407",
      },
    },
  },
  [Network.FANTOM_TESTNET]: {
    chainId: Network.FANTOM_TESTNET,
    chain: InContractChain.FANTOM,
    name: "Fantom testnet",
    symbol: "FTM",
    url: `https://rpc.ankr.com/fantom_testnet`,
    slip44: {
      coinId: 1007,
    },
    layerzero: {
      chainId: 10012,
      endpoint: {
        address: "0x7dcAD72640F835B0FA36EFD3D6d3ec902C7E5acf",
      },
    },
    // TODO: chainlink
    chainlink: {
      token: {
        name: "ChainLink Token on Fantom",
        symbol: "LINK",
        decimals: 18,
        address: "0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F",
      },
    },
  },
  [Network.IOTEX_TESTNET]: {
    chainId: Network.IOTEX_TESTNET,
    chain: InContractChain.IOTEX,
    name: "IoTeX Testnet",
    symbol: "IOTX-T",
    url: `https://babel-api.testnet.iotex.io`,
    slip44: {
      coinId: 304,
    },
  },
  [Network.IOTEX]: {
    chainId: Network.IOTEX,
    chain: InContractChain.IOTEX,
    name: "IoTeX Mainnet",
    symbol: "IOTX",
    url: `https://rpc.ankr.com/iotex`,
    slip44: {
      coinId: 304,
    },
  },
  [Network.OKC_TESTNET]: {
    chainId: Network.OKC_TESTNET,
    name: "OKC Testnet",
    symbol: "OKT",
    url: `https://exchaintestrpc.okex.org`,
  },
  [Network.OKC]: {
    chainId: Network.OKC,
    name: "OKC Mainnet",
    symbol: "OKT",
    url: `https://exchainrpc.okex.org`,
  },
  [Network.HECO_TESTNET]: {
    chainId: Network.HECO_TESTNET,
    name: "HECO Testnet",
    symbol: "HT",
    url: `https://http-testnet.hecochain.com/`,
  },
  [Network.HECO]: {
    chainId: Network.HECO,
    name: "HECO Mainnet",
    symbol: "HT",
    url: `https://http-mainnet.hecochain.com`,
  },
  [Network.KCC_TESTNET]: {
    chainId: Network.KCC_TESTNET,
    name: "KCC Testnet",
    symbol: "KCS",
    url: `https://rpc-testnet.kcc.network`,
    slip44: {
      coinId: 641,
    },
  },
  [Network.KCC]: {
    chainId: Network.KCC,
    name: "KCC Mainnet",
    symbol: "KCS",
    url: `https://kcc.getblock.io/${process.env.GETBLOCK_API_KEY}/mainnet/`,
    slip44: {
      coinId: 641,
    },
  },
  [Network.GNOSIS]: {
    chainId: Network.GNOSIS,
    name: "Gnosis Chain",
    symbol: "XDAI",
    url: `https://rpc.gnosischain.com`,
    slip44: {
      coinId: 700,
    },
  },
  [Network.GNOSIS]: {
    chainId: Network.GNOSIS_CHIADO,
    name: "Gnosis Chiado",
    symbol: "XDAI",
    url: `https://rpc.chiado.gnosis.gateway.fm`,
    slip44: {
      coinId: 700,
    },
  },
  [Network.MOONBEAM]: {
    chainId: Network.MOONBEAM,
    name: "Moonbeam",
    symbol: "GLMR",
    url: `https://rpc.api.moonbeam.network`,
    slip44: {
      coinId: 1284,
    },
  },
  [Network.MOONRIVER]: {
    chainId: Network.MOONRIVER,
    name: "Moonriver",
    symbol: "MOVR",
    url: `https://rpc.api.moonriver.moonbeam.network`,
    slip44: {
      coinId: 1285,
    },
  },
};

export default config;
