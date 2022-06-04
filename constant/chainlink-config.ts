export enum MainnetChain {
  ETHEREUM = "ETHEREUM",
  BNB_CHAIN = "BNB_CHAIN",
  POLYGON = "POLYGON",
  RSK = "RSK",
  GNOSIS_CHAIN = "GNOSIS_CHAIN",
  AVALANCHE = "AVALANCHE",
  FANTOM = "FANTOM",
  ARBITRUM = "ARBITRUM",
  HECO_CHAIN = "HECO_CHAIN",
  OPTIMISM = "OPTIMISM",
  HARMONY = "HARMONY",
  MOONRIVER = "MOONRIVER",
  MOONBEAM = "MOONBEAM",
}

export enum TestnetChain {}

export interface ILinkTokenConfig {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}

// https://docs.chain.link/docs/link-token-contracts

// export const MainnetLinkTokenConfig: { [key in MainnetChain]: ILinkTokenConfig } = {
//   [MainnetChain.ETHEREUM]: {
//     chainId: 1,
//     address: " 0x514910771af9ca656af840dff83e8264ecf986ca",
//     name: "ChainLink Token",
//     symbol: "LINK",
//     decimals: 18,
//   },
// };
