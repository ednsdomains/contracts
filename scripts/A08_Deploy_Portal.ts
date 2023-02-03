import { ethers } from "hardhat";

import { deployRoot } from "./src/deploy";

async function main() {
  const [deployer] = await ethers.getSigners();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
