import axios from "axios";
import { ethers } from "hardhat";
import NetworkConfig from "../../../network.config";

export interface IOwlracleResponse {
  timestamp: string;
  lastBlock: number;
  avgTime: number;
  avgTx: number;
  avgGas: number;
  speeds: {
    acceptance: number;
    maxFeePerGas: number;
    maxPriorityFeePerGas: number;
    baseFee: number;
    estimatedFee: number;
  }[];
}

interface IPolygonGasStationResponse {
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
  if (chainId === 250) {
    provider.getFeeData = async () => {
      const gasPrice = await provider.getGasPrice();
      const response = await axios.get<IOwlracleResponse>(`https://api.owlracle.info/v4/fantom/gas?apikey=${process.env.OWLRACLE_API_KEY}`);
      return {
        maxFeePerGas: ethers.utils.parseUnits(Math.ceil(response.data.speeds[1].maxFeePerGas) + "", "gwei"),
        maxPriorityFeePerGas: ethers.utils.parseUnits(Math.ceil(response.data.speeds[1].maxPriorityFeePerGas) + "", "gwei"),
        gasPrice,
        lastBaseFeePerGas: ethers.utils.parseUnits(Math.ceil(response.data.speeds[1].baseFee) + "", "gwei"),
      };
    };
  }
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
      const response = await axios.get<IPolygonGasStationResponse>("https://gasstation.polygon.technology/v2");
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
