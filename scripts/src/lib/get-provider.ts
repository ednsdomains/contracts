import axios from "axios";
import { ethers } from "hardhat";
import NetworkConfig from "../../../network.config";

interface GasStationResponse {
  safeLow: {
    maxPriorityFee: number;
    maxFee: number;
  };
  standard: {
    maxPriorityFee: number;
    maxFee: number;
  };
  fast: {
    maxPriorityFee: number;
    maxFee: number;
  };
  estimatedBaseFee: number;
  blockTime: number;
  blockNumber: number;
}

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
  if (chainId === 137) {
    provider.getFeeData = async () => {
      const gasPrice = await provider.getGasPrice();
      const response = await axios.get<GasStationResponse>("https://gasstation.polygon.technology/v2");
      return {
        maxFeePerGas: ethers.utils.parseUnits(Math.ceil(response.data.fast.maxFee) + "", "gwei"),
        maxPriorityFeePerGas: ethers.utils.parseUnits(Math.ceil(response.data.fast.maxPriorityFee) + "", "gwei"),
        gasPrice,
        lastBaseFeePerGas: null,
      };
    };
  }
  return provider;
}
