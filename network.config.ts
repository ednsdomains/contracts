import { InContractChain } from "./scripts/src/constants/in-contract-chain";
import GetBlockConfig from "./getblock.config.json";
import * as dotenv from "dotenv";

dotenv.config();

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export enum Network {
  ETHEREUM = 1,
  GOERLI = 5,
  BNB_CHAIN = 56,
  BNB_CHAIN_TESTNET = 97,
  POLYGON = 137,
  POLYGON_MUMBAI = 80001,
  POLYGON_ZKEVM = 1101,
  POLYGON_ZKEVM_TESTNET = 1442,
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
  // HECO = 128,
  // HECO_TESTNET = 256,
  KCC = 321,
  KCC_TESTNET = 322,
  VELAS_EVM = 106,
  VELAS_EVM_TESTNET = 111,
  GNOSIS = 100,
  GNOSIS_CHIADO = 10200,
  MOONBEAM = 1284,
  MOONBASE_ALPHA = 1287,
  MOONRIVER = 1285,
  HARMONY = 1666600000,
  HARMONY_TESTNET = 1666700000,
  // ASTR = 492,
  // METIS = 1088,
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
  CELO = 42220,
  CELO_ALFAJORES = 44787,
  // TELOS_EVM = 40,
  // TELOS_EVM_TESTNET = 41
  ZKSYNC_ERA_TESTNET = 280,
  ZKSYNC_ERA = 324,
  LINEA = 59144,
  LINEA_GOERLI = 59140,
  BASE = 8453,
  BASE_GOERLI = 84531,
  BASE_SEPOLIA = 84532,
  SCROLL = 534352,
  SCROLL_SEPOLIA = 534351,
  CORE_DAO = 1116,
  CORE_DAO_TESTNET = 1115,
}

export const Mainnets = [
  // Network.ETHEREUM,
  Network.BNB_CHAIN,
  Network.POLYGON,
  Network.AVALANCHE,
  Network.FANTOM,
  Network.OPTIMISM,
  Network.ARBITRUM,
  Network.GNOSIS,
  Network.CELO,
  Network.OKC,
  // Network.ZKSYNC_ERA,
  Network.POLYGON_ZKEVM,
  Network.MOONBEAM,
  Network.MOONRIVER,
  Network.HARMONY,
  Network.IOTEX,
];

export const Testnets = [
  Network.GOERLI,
  Network.BNB_CHAIN_TESTNET,
  Network.POLYGON_MUMBAI,
  Network.AVALANCHE_FUJI,
  Network.FANTOM_TESTNET,
  // Network.OPTIMISM_GOERLI,
  // Network.ARBITRUM_GOERLI,
  Network.GNOSIS_CHIADO,
  Network.CELO_ALFAJORES,
  Network.OKC_TESTNET,
  // Network.ZKSYNC_ERA_TESTNET,
  // Network.POLYGON_ZKEVM_TESTNET,
  Network.MOONBASE_ALPHA,
  Network.HARMONY_TESTNET,
  Network.IOTEX_TESTNET,
  Network.LINEA_GOERLI,
  Network.BASE_GOERLI,
  Network.SCROLL_SEPOLIA,
  Network.CORE_DAO_TESTNET,
];

export interface INetworkConfig {
  [chainId: number]: {
    chain?: InContractChain;
    chainId: number;
    name: string;
    symbol: string;
    url: string;
    routerProtocol?: {
      v1: {
        chainId: number;
        handler: {
          generic: string;
        };
        fee: {
          token: { symbol: string; address: string }[];
        };
      };
    };
    multichain?: {
      v6?: {
        chainId: number;
        endpoint: {
          address: string;
        };
      };
      v7?: {
        chainId: number;
        endpoint: {
          address: string;
        };
      };
    };
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
    url: `https://go.getblock.io/${GetBlockConfig.shared.eth.mainnet.jsonRpc[0]}`,
    slip44: {
      coinId: 60,
    },
    layerzero: {
      chainId: 1,
      endpoint: {
        address: "0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675",
      },
    },
    routerProtocol: {
      v1: {
        chainId: 7,
        handler: {
          generic: "0x621F0549102262148f6a7D289D8330adf7CbC09F",
        },
        fee: {
          token: [
            {
              symbol: "WETH",
              address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
            },
            {
              symbol: "ROUTE",
              address: "0x16ECCfDbb4eE1A85A33f3A9B21175Cd7Ae753dB4",
            },
          ],
        },
      },
    },
    multichain: {
      v6: {
        chainId: Network.ETHEREUM,
        endpoint: {
          address: "0xC10Ef9F491C9B59f936957026020C321651ac078",
        },
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
    url: `https://go.getblock.io/${GetBlockConfig.shared.eth.goerli.jsonRpc[0]}`,
    slip44: {
      coinId: 60,
    },
    layerzero: {
      chainId: 10121,
      endpoint: {
        address: "0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23",
      },
    },
    multichain: {
      v6: {
        chainId: Network.GOERLI,
        endpoint: {
          address: "0x3D4e1981f822e87A1A4C05F2e4b3bcAdE5406AE3",
        },
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
    url: `https://go.getblock.io/${GetBlockConfig.shared.bsc.mainnet.jsonRpc[0]}`,
    slip44: {
      coinId: 714,
    },
    layerzero: {
      chainId: 102,
      endpoint: {
        address: "0x3c2269811836af69497E5F486A85D7316753cf62",
      },
    },
    multichain: {
      v6: {
        chainId: Network.BNB_CHAIN,
        endpoint: {
          address: "0xC10Ef9F491C9B59f936957026020C321651ac078",
        },
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
    url: `https://go.getblock.io/${GetBlockConfig.shared.bsc.testnet.jsonRpc[0]}`,
    slip44: {
      coinId: 714,
    },
    layerzero: {
      chainId: 10102,
      endpoint: {
        address: "0x6Fcb97553D41516Cb228ac03FdC8B9a0a9df04A1",
      },
    },
    multichain: {
      v6: {
        chainId: Network.BNB_CHAIN_TESTNET,
        endpoint: {
          address: "0xD2b88BA56891d43fB7c108F23FE6f92FEbD32045",
        },
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
    url: `https://go.getblock.io/${GetBlockConfig.shared.avax.mainnet.jsonRpc[0]}`,
    slip44: {
      coinId: 9005,
    },
    layerzero: {
      chainId: 106,
      endpoint: {
        address: "0x3c2269811836af69497E5F486A85D7316753cf62",
      },
    },
    multichain: {
      v6: {
        chainId: Network.AVALANCHE,
        endpoint: {
          address: "0xC10Ef9F491C9B59f936957026020C321651ac078",
        },
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
    url: `https://go.getblock.io/${GetBlockConfig.shared.avax.testnet.jsonRpc[0]}`,
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
    url: `https://go.getblock.io/${GetBlockConfig.shared.matic.mainnet.jsonRpc[0]}`,
    slip44: {
      coinId: 966,
    },
    layerzero: {
      chainId: 109,
      endpoint: {
        address: "0x3c2269811836af69497E5F486A85D7316753cf62",
      },
    },
    multichain: {
      v6: {
        chainId: Network.POLYGON,
        endpoint: {
          address: "0xC10Ef9F491C9B59f936957026020C321651ac078",
        },
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
    url: `https://go.getblock.io/${GetBlockConfig.shared.matic.testnet.jsonRpc[0]}`,
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
    url: `https://go.getblock.io/${GetBlockConfig.shared.arb.mainnet.jsonRpc[0]}`,
    slip44: {
      coinId: 9001,
    },
    layerzero: {
      chainId: 110,
      endpoint: {
        address: "0x3c2269811836af69497E5F486A85D7316753cf62",
      },
    },
    multichain: {
      v6: {
        chainId: Network.ARBITRUM,
        endpoint: {
          address: "0xC10Ef9F491C9B59f936957026020C321651ac078",
        },
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
    url: `https://go.getblock.io/${GetBlockConfig.shared.arb.goerli.jsonRpc[0]}`,
    slip44: {
      coinId: 9001,
    },
    layerzero: {
      chainId: 10143,
      endpoint: {
        address: "0x6aB5Ae6822647046626e83ee6dB8187151E1d5ab",
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
    url: `https://go.getblock.io/${GetBlockConfig.shared.op.mainnet.jsonRpc[0]}`,
    slip44: {
      coinId: 614,
    },
    layerzero: {
      chainId: 111,
      endpoint: {
        address: "0x3c2269811836af69497E5F486A85D7316753cf62",
      },
    },
    multichain: {
      v6: {
        chainId: Network.OPTIMISM,
        endpoint: {
          address: "0xC10Ef9F491C9B59f936957026020C321651ac078",
        },
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
    url: `https://go.getblock.io/${GetBlockConfig.shared.op.testnet.jsonRpc[0]}`,
    slip44: {
      coinId: 614,
    },
    layerzero: {
      chainId: 10132,
      endpoint: {
        address: "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1",
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
    url: `https://go.getblock.io/${GetBlockConfig.shared.ftm.mainnet.jsonRpc[0]}`,
    slip44: {
      coinId: 1007,
    },
    layerzero: {
      chainId: 112,
      endpoint: {
        address: "0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7",
      },
    },
    multichain: {
      v6: {
        chainId: Network.FANTOM,
        endpoint: {
          address: "0xC10Ef9F491C9B59f936957026020C321651ac078",
        },
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
    url: `https://go.getblock.io/${GetBlockConfig.shared.ftm.testnet.jsonRpc[0]}`,
    slip44: {
      coinId: 1007,
    },
    layerzero: {
      chainId: 10112,
      endpoint: {
        address: "0x7dcAD72640F835B0FA36EFD3D6d3ec902C7E5acf",
      },
    },
    multichain: {
      v6: {
        chainId: 4002,
        endpoint: {
          address: "0xc629d02732EE932db1fa83E1fcF93aE34aBFc96B",
        },
      },
    },
    chainlink: {
      token: {
        name: "ChainLink Token on Fantom",
        symbol: "LINK",
        decimals: 18,
        address: "0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F",
      },
    },
  },
  [Network.IOTEX]: {
    chainId: Network.IOTEX,
    chain: InContractChain.IOTEX,
    name: "IoTeX Mainnet",
    symbol: "IOTX",
    // url: `https://iotex-mainnet.gateway.pokt.network/v1/lb/${process.env.POKT_PORTAL_ID}`,
    url: "https://babel-api.mainnet.iotex.io",
    slip44: {
      coinId: 304,
    },
    multichain: {
      v6: {
        chainId: Network.IOTEX,
        endpoint: {
          address: "0xC10Ef9F491C9B59f936957026020C321651ac078",
        },
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
  [Network.OKC_TESTNET]: {
    chainId: Network.OKC_TESTNET,
    chain: InContractChain.OKC,
    name: "OKC Testnet",
    symbol: "OKT",
    url: `https://exchaintestrpc.okex.org`,
    slip44: {
      coinId: 996,
    },
    layerzero: {
      chainId: 10155,
      endpoint: {
        address: "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1",
      },
    },
  },
  [Network.OKC]: {
    chainId: Network.OKC,
    chain: InContractChain.OKC,
    name: "OKC Mainnet",
    symbol: "OKT",
    url: `https://oKc-mainnet.gateway.pokt.network/v1/lb/${process.env.POKT_PORTAL_ID}`,
    slip44: {
      coinId: 996,
    },
    layerzero: {
      chainId: 155,
      endpoint: {
        address: "0x9740FF91F1985D8d2B71494aE1A2f723bb3Ed9E4",
      },
    },
  },
  // [Network.HECO_TESTNET]: {
  //   chainId: Network.HECO_TESTNET,
  //   name: "HECO Testnet",
  //   symbol: "HT",
  //   url: `https://http-testnet.hecochain.com/`,
  // },
  // [Network.HECO]: {
  //   chainId: Network.HECO,
  //   name: "HECO Mainnet",
  //   symbol: "HT",
  //   url: `https://http-mainnet.hecochain.com`,
  // },
  [Network.KCC]: {
    chainId: Network.KCC,
    name: "KCC Mainnet",
    symbol: "KCS",
    url: `https://go.getblock.io/${GetBlockConfig.shared.kcc.mainnet.jsonRpc[0]}`,
    slip44: {
      coinId: 642,
    },
  },
  [Network.KCC_TESTNET]: {
    chainId: Network.KCC_TESTNET,
    name: "KCC Testnet",
    symbol: "KCS",
    url: `https://go.getblock.io/${GetBlockConfig.shared.kcc.mainnet.jsonRpc[0]}`,
    slip44: {
      coinId: 642,
    },
  },
  [Network.GNOSIS]: {
    chain: InContractChain.GNOSIS,
    chainId: Network.GNOSIS,
    name: "Gnosis Chain",
    symbol: "XDAI",
    url: `https://go.getblock.io/${GetBlockConfig.shared.gno.mainnet.jsonRpc[0]}`,
    slip44: {
      coinId: 700,
    },
    layerzero: {
      chainId: 145,
      endpoint: {
        address: "0x9740FF91F1985D8d2B71494aE1A2f723bb3Ed9E4",
      },
    },
    multichain: {
      v6: {
        chainId: Network.GNOSIS,
        endpoint: {
          address: "0xC10Ef9F491C9B59f936957026020C321651ac078",
        },
      },
    },
  },
  [Network.GNOSIS_CHIADO]: {
    chain: InContractChain.GNOSIS,
    chainId: Network.GNOSIS_CHIADO,
    name: "Gnosis Chiado",
    symbol: "XDAI",
    url: `https://rpc.chiado.gnosis.gateway.fm`,
    slip44: {
      coinId: 700,
    },
    layerzero: {
      chainId: 10145,
      endpoint: {
        address: "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1",
      },
    },
  },
  [Network.MOONBEAM]: {
    chain: InContractChain.MOONBEAM,
    chainId: Network.MOONBEAM,
    name: "Moonbeam",
    symbol: "GLMR",
    url: `https://go.getblock.io/${GetBlockConfig.shared.glmr.mainnet.jsonRpc[0]}`,
    slip44: {
      coinId: 1284,
    },
    layerzero: {
      chainId: 126,
      endpoint: {
        address: "0x9740FF91F1985D8d2B71494aE1A2f723bb3Ed9E4",
      },
    },
  },
  [Network.MOONBASE_ALPHA]: {
    chain: InContractChain.MOONBEAM,
    chainId: Network.MOONBASE_ALPHA,
    name: "Moonbase Alphanet",
    symbol: "DEV",
    url: `https://moonbase-alpha.public.blastapi.io`,
    layerzero: {
      chainId: 10126,
      endpoint: {
        address: "0xb23b28012ee92E8dE39DEb57Af31722223034747",
      },
    },
  },
  [Network.MOONRIVER]: {
    chain: InContractChain.MOONRIVER,
    chainId: Network.MOONRIVER,
    name: "Moonriver",
    symbol: "MOVR",
    url: `https://go.getblock.io/${GetBlockConfig.shared.movr.mainnet.jsonRpc[0]}`,
    slip44: {
      coinId: 1285,
    },
    multichain: {
      v6: {
        chainId: Network.MOONRIVER,
        endpoint: {
          address: "0xC10Ef9F491C9B59f936957026020C321651ac078",
        },
      },
    },
    layerzero: {
      chainId: 167,
      endpoint: {
        address: "0x7004396C99D5690da76A7C59057C5f3A53e01704",
      },
    },
  },
  [Network.CELO]: {
    chain: InContractChain.CELO,
    chainId: Network.CELO,
    name: "Celo Mainnet",
    symbol: "CELO",
    url: `https://celo-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    slip44: {
      coinId: 52751,
    },
    layerzero: {
      chainId: 125,
      endpoint: {
        address: "0x3A73033C0b1407574C76BdBAc67f126f6b4a9AA9",
      },
    },
  },
  [Network.CELO_ALFAJORES]: {
    chain: InContractChain.CELO,
    chainId: Network.CELO_ALFAJORES,
    name: "Celo Alfajores Testnet",
    symbol: "CELO",
    url: `https://celo-alfajores.infura.io/v3/${process.env.INFURA_API_KEY}`,
    slip44: {
      coinId: 52751,
    },
    layerzero: {
      chainId: 10125,
      endpoint: {
        address: "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1",
      },
    },
  },
  [Network.ZKSYNC_ERA]: {
    chain: InContractChain.ZKSYNC,
    chainId: Network.ZKSYNC_ERA,
    name: "zkSync Era Mainnet",
    symbol: "ETH",
    url: `https://mainnet.era.zksync.io`,
    slip44: {
      coinId: 804,
    },
    layerzero: {
      chainId: 165,
      endpoint: {
        address: "0x9b896c0e23220469C7AE69cb4BbAE391eAa4C8da",
      },
    },
  },
  [Network.ZKSYNC_ERA_TESTNET]: {
    chain: InContractChain.ZKSYNC,
    chainId: Network.ZKSYNC_ERA_TESTNET,
    name: "zkSync Era Testnet",
    symbol: "ETH",
    url: `https://testnet.era.zksync.dev`,
    slip44: {
      coinId: 60,
    },
    layerzero: {
      chainId: 10165,
      endpoint: {
        address: "0x093D2CF57f764f09C3c2Ac58a42A2601B8C79281",
      },
    },
  },
  [Network.POLYGON_ZKEVM]: {
    chain: InContractChain.POLYGON_ZKEVM,
    chainId: Network.POLYGON_ZKEVM,
    name: "Polygon zkEVM",
    symbol: "ETH",
    url: `https://zkevm-rpc.com`,
    layerzero: {
      chainId: 158,
      endpoint: {
        address: "0x9740FF91F1985D8d2B71494aE1A2f723bb3Ed9E4",
      },
    },
  },
  [Network.POLYGON_ZKEVM_TESTNET]: {
    chain: InContractChain.POLYGON_ZKEVM,
    chainId: Network.POLYGON_ZKEVM_TESTNET,
    name: "Polygon zkEVM Testnet",
    symbol: "ETH",
    url: `https://go.getblock.io/${GetBlockConfig.shared["polygon-zkevm"].mainnet.jsonRpc[0]}`,
    slip44: {
      coinId: 60,
    },
    layerzero: {
      chainId: 10158,
      endpoint: {
        address: "0x6aB5Ae6822647046626e83ee6dB8187151E1d5ab",
      },
    },
  },
  [Network.HARMONY]: {
    chain: InContractChain.HARMONY,
    chainId: Network.HARMONY,
    name: "Harmony One",
    symbol: "ONE",
    url: `https://go.getblock.io/${GetBlockConfig.shared.one.mainnet.jsonRpc[0]}`,
    slip44: {
      coinId: 1023,
    },
    layerzero: {
      chainId: 116,
      endpoint: {
        address: "0x9740FF91F1985D8d2B71494aE1A2f723bb3Ed9E4",
      },
    },
  },
  [Network.HARMONY_TESTNET]: {
    chain: InContractChain.HARMONY,
    chainId: Network.HARMONY_TESTNET,
    name: "Harmony One Testnet",
    symbol: "ONE",
    url: `https://api.s0.b.hmny.io`,
    slip44: {
      coinId: 1023,
    },
    layerzero: {
      chainId: 10133,
      endpoint: {
        address: "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1",
      },
    },
  },
  [Network.LINEA]: {
    chain: InContractChain.LINEA,
    chainId: Network.LINEA,
    name: "Linea",
    symbol: "ETH",
    url: `https://go.getblock.io/${GetBlockConfig.shared.linea.mainnet.jsonRpc[0]}`,
    slip44: {
      coinId: 60,
    },
    layerzero: {
      chainId: 183,
      endpoint: {
        address: "0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7",
      },
    },
  },
  [Network.LINEA_GOERLI]: {
    chain: InContractChain.LINEA,
    chainId: Network.LINEA_GOERLI,
    name: "Linea Goerli Testnet",
    symbol: "ETH",
    url: `https://rpc.goerli.linea.build`,
    slip44: {
      coinId: 60,
    },
    layerzero: {
      chainId: 10157,
      endpoint: {
        address: "0x6aB5Ae6822647046626e83ee6dB8187151E1d5ab",
      },
    },
  },
  [Network.BASE]: {
    chain: InContractChain.BASE,
    chainId: Network.BASE,
    name: "BASE",
    symbol: "ETH",
    url: `https://go.getblock.io/${GetBlockConfig.shared.base.mainnet.jsonRpc[0]}`,
    slip44: {
      coinId: 60,
    },
    layerzero: {
      chainId: 184,
      endpoint: {
        address: "0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7",
      },
    },
  },
  [Network.BASE_SEPOLIA]: {
    chain: InContractChain.BASE,
    chainId: Network.BASE_SEPOLIA,
    name: "Base Sepolia Testnet",
    symbol: "ETH",
    url: `https://sepolia.base.org`,
    slip44: {
      coinId: 60,
    },
    layerzero: {
      chainId: 10160,
      endpoint: {
        address: "0x6aB5Ae6822647046626e83ee6dB8187151E1d5ab",
      },
    },
  },
  [Network.BASE_GOERLI]: {
    chain: InContractChain.BASE,
    chainId: Network.BASE_GOERLI,
    name: "Base Goerli Testnet",
    symbol: "ETH",
    url: `https://go.getblock.io/${GetBlockConfig.shared.base.goerli.jsonRpc[0]}`,
    slip44: {
      coinId: 60,
    },
    layerzero: {
      chainId: 10160,
      endpoint: {
        address: "0x6aB5Ae6822647046626e83ee6dB8187151E1d5ab",
      },
    },
  },
  [Network.SCROLL_SEPOLIA]: {
    chain: InContractChain.SCROLL,
    chainId: Network.SCROLL_SEPOLIA,
    name: "Scroll Sepolia Testnet",
    symbol: "ETH",
    url: `https://sepolia-rpc.scroll.io`,
    layerzero: {
      chainId: 10214,
      endpoint: {
        address: "0x6098e96a28E02f27B1e6BD381f870F1C8Bd169d3",
      },
    },
  },
  [Network.SCROLL]: {
    chain: InContractChain.SCROLL,
    chainId: Network.SCROLL,
    name: "Scroll",
    symbol: "ETH",
    url: `https://rpc.scroll.io`,
    slip44: {
      coinId: 60,
    },
    layerzero: {
      chainId: 214,
      endpoint: {
        address: "0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7",
      },
    },
  },
  [Network.CORE_DAO]: {
    chain: InContractChain.CORE_DAO,
    chainId: Network.CORE_DAO,
    name: "Core Chain MainNet",
    symbol: "CORE",
    url: `https://rpc.coredao.org/`,
    slip44: {
      coinId: 1116,
    },
    layerzero: {
      chainId: 153,
      endpoint: {
        address: "0x9740FF91F1985D8d2B71494aE1A2f723bb3Ed9E4",
      },
    },
  },
  [Network.CORE_DAO_TESTNET]: {
    chain: InContractChain.CORE_DAO,
    chainId: Network.CORE_DAO_TESTNET,
    name: "Core Chain TestNet",
    symbol: "tCORE",
    url: `https://rpc.test.btcs.network/`,
    slip44: {
      coinId: 1116,
    },
    layerzero: {
      chainId: 10153,
      endpoint: {
        address: "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1",
      },
    },
  },
};

export default config;
