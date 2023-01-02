import { ethers } from "hardhat";

import { deployRegistrar } from "./src/deploy";
import { getPublicResolver, getRegistry } from "./src/get-contracts";

async function main() {
  const [deployer] = await ethers.getSigners();
  const [Registry, PublicResolver] = await Promise.all([getRegistry(deployer), getPublicResolver(deployer)]);
  if (!Registry) throw new Error("Registry is not available");
  if (!PublicResolver) throw new Error("PublicResolver is not available");
  await deployRegistrar({ Registry, PublicResolver }, { deployer });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
