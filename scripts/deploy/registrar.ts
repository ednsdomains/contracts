import { ethers } from "hardhat";

import { deployRegistry } from "../src/deploy";

async function main() {
  const [deployer] = await ethers.getSigners();
  await deployRegistry({ deployer });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
