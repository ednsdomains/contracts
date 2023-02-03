import { ethers } from "hardhat";

import { deployWrapper } from "./src/deploy";
import { getRegistry } from "./src/lib/get-contracts";

async function main() {
  const [deployer] = await ethers.getSigners();
  const Registry = await getRegistry(deployer);
  if (!Registry) throw new Error("Registry is not available");
  await deployWrapper({ Registry, NFT_NAME: "EDNS Domains", NFT_SYMBOL: "EDNS" }, { deployer });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
