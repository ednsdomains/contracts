import { Chain } from "./chain";

export interface ILinkTokenConfig {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}

// https://docs.chain.link/docs/link-token-contracts

export const MainnetLinkTokenConfig: { [key in Chain]: ILinkTokenConfig } = {
  [Chain.ETHEREUM]: {
    chainId: 1,
    address: "0x514910771af9ca656af840dff83e8264ecf986ca",
    name: "ChainLink Token",
    symbol: "LINK",
    decimals: 18,
  },
  [Chain.BNB_CHAIN]: {
    chainId: 56,
    address: "0x404460c6a5ede2d891e8297795264fde62adbb75",
    name: "ChainLink Token",
    symbol: "LINK",
    decimals: 18,
  },
  [Chain.POLYGON]: {
    chainId: 137,
    address: "0xb0897686c545045afc77cf20ec7a532e3120e0f1",
    name: "ChainLink Token",
    symbol: "LINK",
    decimals: 18,
  },
  [Chain.AVALANCHE]: {
    chainId: 43114,
    address: "0x5947BB275c521040051D82396192181b413227A3",
    name: "ChainLink Token on Avalanche",
    symbol: "LINK",
    decimals: 18,
  },
  [Chain.FANTOM]: {
    chainId: 250,
    address: "0x6F43FF82CCA38001B6699a8AC47A2d0E66939407",
    name: "ChainLink Token on Fantom",
    symbol: "LINK",
    decimals: 18,
  },
  [Chain.ARBITRUM]: {
    chainId: 42161,
    address: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
    name: "ChainLink Token on Arbitrum Mainnet",
    symbol: "LINK",
    decimals: 18,
  },
  [Chain.OPTIMISM]: {
    chainId: 10,
    address: "0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6",
    name: "ChainLink Token on Optimism Mainnet",
    symbol: "LINK",
    decimals: 18,
  },
};

export const TestnetLinkTokenConfig: { [key in Chain]: ILinkTokenConfig } = {
  [Chain.ETHEREUM]: {
    chainId: 4,
    address: "0x01BE23585060835E02B77ef475b0Cc51aA1e0709",
    name: "ChainLink Token",
    symbol: "LINK",
    decimals: 18,
  },
  [Chain.BNB_CHAIN]: {
    chainId: 97,
    address: "0x84b9b910527ad5c03a9ca831909e21e236ea7b06",
    name: "ChainLink Token",
    symbol: "LINK",
    decimals: 18,
  },
  [Chain.POLYGON]: {
    chainId: 80001,
    address: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    name: "ChainLink Token",
    symbol: "LINK",
    decimals: 18,
  },
  [Chain.AVALANCHE]: {
    chainId: 43113,
    address: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
    name: "ChainLink Token on Avalanche",
    symbol: "LINK",
    decimals: 18,
  },
  [Chain.FANTOM]: {
    chainId: 4002,
    address: "0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F",
    name: "ChainLink Token on Fantom",
    symbol: "LINK",
    decimals: 18,
  },
  [Chain.ARBITRUM]: {
    chainId: 421611,
    address: "0x615fBe6372676474d9e6933d310469c9b68e9726",
    name: "ChainLink Token on Arbitrum Rinkeby",
    symbol: "LINK",
    decimals: 18,
  },
  [Chain.OPTIMISM]: {
    chainId: 69,
    address: "0x4911b761993b9c8c0d14Ba2d86902AF6B0074F5B",
    name: "ChainLink Token on Optimism Kovan",
    symbol: "LINK",
    decimals: 18,
  },
};
