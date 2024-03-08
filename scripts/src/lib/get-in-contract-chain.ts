import { Network } from "../../../network.config";
import { InContractChain } from "../constants/in-contract-chain";

export const getInContractChain = async (chainId: number): Promise<InContractChain> => {
  if (chainId === Network.ETHEREUM || chainId === Network.GOERLI || chainId === Network.SEPOLIA) return InContractChain.ETHEREUM;
  if (chainId === Network.BNB_CHAIN || chainId === Network.BNB_CHAIN_TESTNET) return InContractChain.BNB;
  if (chainId === Network.POLYGON || chainId === Network.POLYGON_MUMBAI) return InContractChain.POLYGON;
  if (chainId === Network.AVALANCHE || chainId === Network.AVALANCHE_FUJI) return InContractChain.AVALANCHE;
  if (chainId === Network.FANTOM || chainId === Network.FANTOM_TESTNET) return InContractChain.FANTOM;
  if (chainId === Network.OPTIMISM || chainId === Network.OPTIMISM_GOERLI || chainId === Network.OPTIMISM_SEPOLIA) return InContractChain.OPTIMISM;
  if (chainId === Network.ARBITRUM || chainId === Network.ARBITRUM_GOERLI || chainId === Network.ARBITRUM_SEPOLIA) return InContractChain.ARBITRUM;
  if (chainId === Network.IOTEX || chainId === Network.IOTEX_TESTNET) return InContractChain.IOTEX;
  if (chainId === Network.OKC || chainId === Network.OKC_TESTNET) return InContractChain.OKC;
  if (chainId === Network.GNOSIS || chainId === Network.GNOSIS_CHIADO) return InContractChain.GNOSIS;
  if (chainId === Network.CELO || chainId === Network.CELO_ALFAJORES) return InContractChain.CELO;
  if (chainId === Network.HARMONY || chainId === Network.HARMONY_TESTNET) return InContractChain.HARMONY;
  if (chainId === Network.POLYGON_ZKEVM || chainId === Network.POLYGON_ZKEVM_TESTNET) return InContractChain.POLYGON_ZKEVM;
  if (chainId === Network.MOONBEAM || chainId === Network.MOONBASE_ALPHA) return InContractChain.MOONBEAM;
  if (chainId === Network.MOONRIVER) return InContractChain.MOONRIVER;
  if (chainId === Network.ZKSYNC_ERA || chainId === Network.ZKSYNC_ERA_TESTNET) return InContractChain.ZKSYNC;
  if (chainId === Network.MOONBEAM || chainId === Network.MOONBASE_ALPHA) return InContractChain.MOONBEAM;
  if (chainId === Network.LINEA || chainId === Network.LINEA_GOERLI) return InContractChain.LINEA;
  if (chainId === Network.BASE || chainId === Network.BASE_GOERLI || chainId === Network.BASE_SEPOLIA) return InContractChain.BASE;
  if (chainId === Network.SCROLL || chainId === Network.SCROLL_SEPOLIA) return InContractChain.SCROLL;
  if (chainId === Network.CORE_DAO || chainId === Network.CORE_DAO_TESTNET) return InContractChain.CORE_DAO;
  if (chainId === Network.FLARE || chainId === Network.FLARE_TESTNET) return InContractChain.FLARE;
  throw new Error(`Unsupported chain: ${chainId}`);
};
