import { ethers } from "hardhat";

import { deployTokenMock } from "./src/deploy";

async function main() {
  const [deployer] = await ethers.getSigners();
  await deployTokenMock({ deployer });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
