import { ethers } from "hardhat";
import NetworkConfig from "../../../network.config";

export function getProvider(chainId: number) {
  const provider = new ethers.providers.JsonRpcProvider(NetworkConfig[chainId].url, {
    chainId: NetworkConfig[chainId].chainId,
    name: NetworkConfig[chainId].name,
  });
  if (chainId === 10200) {
    provider.getFeeData = async () => ({
      lastBaseFeePerGas: ethers.utils.parseUnits("7", "gwei"),
      maxFeePerGas: ethers.utils.parseUnits("7", "gwei"),
      maxPriorityFeePerGas: ethers.utils.parseUnits("7", "gwei"),
      gasPrice: ethers.utils.parseUnits("7", "gwei"),
    });
  }
  return provider;
}
