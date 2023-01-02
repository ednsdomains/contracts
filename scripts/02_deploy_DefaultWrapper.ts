import { ethers } from "hardhat";

import { deployWrapper } from "./src/deploy";
import { getRegistry } from "./src/get-contracts";

async function main() {
  const [deployer] = await ethers.getSigners();
  const Registry = await getRegistry(deployer);
  if (!Registry) throw new Error("Registry is not available");
  await deployWrapper({ Registry, NFT_NAME: "Test Name Service", NFT_SYMBOL: "TNS" }, { deployer });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
