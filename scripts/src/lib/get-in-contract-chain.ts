import { Network } from "../../../network.config";
import { InContractChain } from "../constants/in-contract-chain";

export const getInContractChain = async (chainId: number): Promise<InContractChain> => {
  if (chainId === Network.ETHEREUM || chainId === Network.GOERLI) return InContractChain.ETHEREUM;
  if (chainId === Network.BNB_CHAIN || chainId === Network.BNB_CHAIN_TESTNET) return InContractChain.BNB;
  if (chainId === Network.POLYGON || chainId === Network.POLYGON_MUMBAI) return InContractChain.POLYGON;
  if (chainId === Network.AVALANCHE || chainId === Network.AVALANCHE_FUJI) return InContractChain.AVALANCHE;
  if (chainId === Network.FANTOM || chainId === Network.FANTOM_TESTNET) return InContractChain.FANTOM;
  if (chainId === Network.OPTIMISM || chainId === Network.OPTIMISM_GOERLI) return InContractChain.OPTIMISM;
  if (chainId === Network.ARBITRUM || chainId === Network.ARBITRUM_GOERLI) return InContractChain.ARBITRUM;
  if (chainId === Network.IOTEX || chainId === Network.IOTEX_TESTNET) return InContractChain.IOTEX;
  if (chainId === Network.OKC || chainId === Network.OKC_TESTNET) return InContractChain.OKC;
  if (chainId === Network.GNOSIS || chainId === Network.GNOSIS_CHIADO) return InContractChain.GNOSIS;
  if (chainId === Network.CELO || chainId === Network.CELO_ALFAJORES) return InContractChain.CELO;
  if (chainId === Network.HARMONY || chainId === Network.HARMONEY_TESTNET) return InContractChain.HARMONY;
  if (chainId === Network.POLYGON_ZKEVM || chainId === Network.POLYGON_ZKEVM_TESTNET) return InContractChain.POLYGON_ZKEVM;
  if (chainId === Network.MOONBEAM || chainId === Network.MOONBASE_ALPHA) return InContractChain.MOONBEAM;
  if (chainId === Network.MOONRIVER) return InContractChain.MOONRIVER;
  if (chainId === Network.ZKSYNC_ERA || chainId === Network.ZKSYNC_ERA_TESTNET) return InContractChain.ZKSYNC;
  if (chainId === Network.MOONBEAM || chainId === Network.MOONBASE_ALPHA) return InContractChain.MOONBEAM;

  throw new Error(`Unsupported chain: ${chainId}`);
};
