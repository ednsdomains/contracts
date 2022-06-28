import { Testnets as networks } from "../../network.config";
import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Wallet Address:", await signer.getAddress());
}
