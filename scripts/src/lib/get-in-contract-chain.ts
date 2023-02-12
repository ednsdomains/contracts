import { Network } from "../../../network.config";
import { InContractChain } from "../constants/in-contract-chain";

export const getInContractChain = async (chainId: number): Promise<InContractChain> => {
  if (chainId === Network.ETHEREUM || chainId === Network.GOERLI) return InContractChain.ETHEREUM;
  if (chainId === Network.BNB_CHAIN || chainId === Network.BNB_CHAIN_TESTNET) return InContractChain.BNB;
  if (chainId === Network.POLYGON || chainId === Network.POLYGON_MUMBAI) return InContractChain.POLYGON;
  if (chainId === Network.AVALANCHE || chainId === Network.AVALANCHE_FUJI) return InContractChain.AVALANCHE;
  if (chainId === Network.FANTOM || chainId === Network.FANTOM_TESTNET) return InContractChain.FANTOM;
  if (chainId === Network.OPTIMISM || chainId === Network.OPTIMISM_GOERLI) return InContractChain.FANTOM;
  if (chainId === Network.ARBITRUM || chainId === Network.ARBITRUM_GOERLI) return InContractChain.FANTOM;
  if (chainId === Network.IOTEX || chainId === Network.IOTEX_TESTNET) return InContractChain.FANTOM;
  if (chainId === Network.OKC || chainId === Network.OKC_TESTNET) return InContractChain.FANTOM;
  if (chainId === Network.GNOSIS || chainId === Network.GNOSIS_CHIADO) return InContractChain.FANTOM;
  if (chainId === Network.CELO || chainId === Network.CELO) return InContractChain.FANTOM;

  throw new Error(`Unsupported chain: ${chainId}`);
};
