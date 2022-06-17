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
    contract?: {
      Registry: string;
      PublicResolver: string;
      SingletonRegistrar: string;
      SingletonRegistrarController: string;
      OmniRegistrar: string;
      OmniRegistrarController: string;
      Root: string;
      DomainPriceOracle: string;
      TokenPriceOracle: string;
      Token: string;
    };
  };
}

const config: INetworkConfig = {
  [Network.ETHEREUM]: {
    chainId: 1,
    name: "Ethereum",
    symbol: "ETH",
    url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
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
};
