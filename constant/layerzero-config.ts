export enum TestnetChain {
  ETHEREUM_RINKEBY = "ETHEREUM_RINKEBY",
  BSC_TESTNET = "BSC_TESTNET",
  AVALANCHE_FUJI = "AVALANCHE_FUJI",
  POLYGON_MUMBAI = "POLYGON_MUMBAI",
  ARBITRUM_RINKEBY = "ARBITRUM_RINKEBY",
  OPTIMISM_KOVAN = "OPTIMISM_KOVAN",
  FANTOM_TESTNET = "FANTOM_TESTNET",
}

export enum MainnetChain {
  ETHEREUM = "ETHEREUM",
  BSC = "BSC",
  AVALANCHE = "AVALANCHE",
  POLYGON = "POLYGON",
  ARBITRUM = "ARBITRUM",
  OPTIMISM = "OPTIMISM",
  FANTOM = "FANTOM",
}

export const MainnetConfig: {
  [key in MainnetChain]: { chainId: number; endpoint: string };
} = {
  [MainnetChain.ETHEREUM]: {
    chainId: 1,
    endpoint: "0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675",
  },
  [MainnetChain.BSC]: {
    chainId: 2,
    endpoint: "0x3c2269811836af69497E5F486A85D7316753cf62",
  },
  [MainnetChain.AVALANCHE]: {
    chainId: 6,
    endpoint: "0x3c2269811836af69497E5F486A85D7316753cf62",
  },
  [MainnetChain.POLYGON]: {
    chainId: 9,
    endpoint: "0x3c2269811836af69497E5F486A85D7316753cf62",
  },
  [MainnetChain.ARBITRUM]: {
    chainId: 10,
    endpoint: "0x3c2269811836af69497E5F486A85D7316753cf62",
  },
  [MainnetChain.OPTIMISM]: {
    chainId: 11,
    endpoint: "0x3c2269811836af69497E5F486A85D7316753cf62",
  },
  [MainnetChain.FANTOM]: {
    chainId: 12,
    endpoint: "0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7",
  },
};

export const TestnetConfig: {
  [key in TestnetChain]: { chainId: number; endpoint: string };
} = {
  [TestnetChain.ETHEREUM_RINKEBY]: {
    chainId: 10001,
    endpoint: "0x79a63d6d8BBD5c6dfc774dA79bCcD948EAcb53FA",
  },
  [TestnetChain.BSC_TESTNET]: {
    chainId: 10002,
    endpoint: "0x6Fcb97553D41516Cb228ac03FdC8B9a0a9df04A1",
  },
  [TestnetChain.AVALANCHE_FUJI]: {
    chainId: 10006,
    endpoint: "0x93f54D755A063cE7bB9e6Ac47Eccc8e33411d706",
  },
  [TestnetChain.POLYGON_MUMBAI]: {
    chainId: 10009,
    endpoint: "0xf69186dfBa60DdB133E91E9A4B5673624293d8F8",
  },
  [TestnetChain.ARBITRUM_RINKEBY]: {
    chainId: 10010,
    endpoint: "0x4D747149A57923Beb89f22E6B7B97f7D8c087A00",
  },
  [TestnetChain.OPTIMISM_KOVAN]: {
    chainId: 10011,
    endpoint: "0x72aB53a133b27Fa428ca7Dc263080807AfEc91b5",
  },
  [TestnetChain.FANTOM_TESTNET]: {
    chainId: 10012,
    endpoint: "0x7dcAD72640F835B0FA36EFD3D6d3ec902C7E5acf",
  },
};
