import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "ethers";
import hre from "hardhat";

export async function getSigner(provider: ethers.providers.JsonRpcProvider): Promise<SignerWithAddress> {
  const [signer_] = await hre.ethers.getSigners();
  return signer_.connect(provider);
}
