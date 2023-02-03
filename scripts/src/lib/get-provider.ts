import { ethers } from "hardhat";
import NetworkConfig from "../../../network.config";

export function getProvider(chainId: number) {
  const provider = new ethers.providers.JsonRpcProvider(NetworkConfig[chainId].url, {
    chainId: NetworkConfig[chainId].chainId,
    name: NetworkConfig[chainId].name,
  });
  return provider;
}
