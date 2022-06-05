import { Chain } from "./chain";

export interface ILayerZeroConfig {
  chainId: number;
  endpoint: string;
}

export const MainnetConfig: {
  [key in Chain]: ILayerZeroConfig;
} = {
  [Chain.ETHEREUM]: {
    chainId: 1,
    endpoint: "0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675",
  },
  [Chain.BNB_CHAIN]: {
    chainId: 2,
    endpoint: "0x3c2269811836af69497E5F486A85D7316753cf62",
  },
  [Chain.AVALANCHE]: {
    chainId: 6,
    endpoint: "0x3c2269811836af69497E5F486A85D7316753cf62",
  },
  [Chain.POLYGON]: {
    chainId: 9,
    endpoint: "0x3c2269811836af69497E5F486A85D7316753cf62",
  },
  [Chain.ARBITRUM]: {
    chainId: 10,
    endpoint: "0x3c2269811836af69497E5F486A85D7316753cf62",
  },
  [Chain.OPTIMISM]: {
    chainId: 11,
    endpoint: "0x3c2269811836af69497E5F486A85D7316753cf62",
  },
  [Chain.FANTOM]: {
    chainId: 12,
    endpoint: "0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7",
  },
};

export const TestnetConfig: {
  [key in Chain]: ILayerZeroConfig;
} = {
  [Chain.ETHEREUM]: {
    chainId: 10001,
    endpoint: "0x79a63d6d8BBD5c6dfc774dA79bCcD948EAcb53FA",
  },
  [Chain.BNB_CHAIN]: {
    chainId: 10002,
    endpoint: "0x6Fcb97553D41516Cb228ac03FdC8B9a0a9df04A1",
  },
  [Chain.AVALANCHE]: {
    chainId: 10006,
    endpoint: "0x93f54D755A063cE7bB9e6Ac47Eccc8e33411d706",
  },
  [Chain.POLYGON]: {
    chainId: 10009,
    endpoint: "0xf69186dfBa60DdB133E91E9A4B5673624293d8F8",
  },
  [Chain.ARBITRUM]: {
    chainId: 10010,
    endpoint: "0x4D747149A57923Beb89f22E6B7B97f7D8c087A00",
  },
  [Chain.OPTIMISM]: {
    chainId: 10011,
    endpoint: "0x72aB53a133b27Fa428ca7Dc263080807AfEc91b5",
  },
  [Chain.FANTOM]: {
    chainId: 10012,
    endpoint: "0x7dcAD72640F835B0FA36EFD3D6d3ec902C7E5acf",
  },
};
