import { BigNumber, Signer, Wallet } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";

export const getBalance = async (wallet: Signer | Wallet, provider?: JsonRpcProvider): Promise<BigNumber> => {
  if (provider) wallet = wallet.connect(provider);
  return wallet.getBalance();
};
