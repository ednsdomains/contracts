import { ethers } from "hardhat";
import { setupDefaultWrapper } from "./src/setup";

async function main() {
  const [deployer] = await ethers.getSigners();
  await setupDefaultWrapper({ contracts: {}, chainId: await deployer.getChainId() });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
