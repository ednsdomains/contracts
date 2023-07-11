import { AwsKmsSigner } from "ethers-aws-kms-signer";
import axios from "axios";
import hardhat, { ethers } from "hardhat";
import { BaseRegistrarImplementation } from "../typechain/BaseRegistrarImplementation";
import { BaseRegistrarImplementation__factory } from "../typechain";

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

async function main() {
  const provider = new hardhat.ethers.providers.JsonRpcProvider(
    "https://rpc.ankr.com/eth_goerli",
    { name: "Goerli", chainId: 5 }
  );
  //   const provider = new hardhat.ethers.providers.JsonRpcProvider(
  //     "https://polygon-rpc.com/",
  //     { name: "Polygon Mainnet", chainId: 137 }
  //   );
  //   provider.getFeeData = async () => {
  //     const gasPrice = await provider.getGasPrice();
  //     const response = await axios.get<GasStationResponse>(
  //       "https://gasstation-mainnet.matic.network/v2"
  //     );
  //     return {
  //       maxFeePerGas: ethers.utils.parseUnits(
  //         Math.ceil(response.data.fast.maxFee) + "",
  //         "gwei"
  //       ),
  //       maxPriorityFeePerGas: ethers.utils.parseUnits(
  //         Math.ceil(response.data.fast.maxPriorityFee) + "",
  //         "gwei"
  //       ),
  //       gasPrice,
  //       lastBaseFeePerGas: null,
  //     };
  //   };
  const signer = new AwsKmsSigner(
    {
      region: "ap-southeast-1",
      keyId: process.env.KMS_SIGNER_KEY_ARN!,
    },
    provider
  );

  const baseRegistrar = BaseRegistrarImplementation__factory.connect(
    "0xafFDDAd389bEe8a2AcBa0367dFAE5609B93c7F9b",
    signer
  );

  const tx = await baseRegistrar.addController(
    `0x3E56F456e27A44140a77Af8545dA57a3A28cB872`
  );
  console.log(`Hash: ${tx.hash}`);
  await tx.wait();
}

main();
