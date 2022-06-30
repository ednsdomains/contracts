import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { createProvider } from "./provider";

export async function createSigner(chainId: number): Promise<SignerWithAddress> {
  const [signer_] = await ethers.getSigners();
  const provider = createProvider(chainId);
  return signer_.connect(provider);
}
