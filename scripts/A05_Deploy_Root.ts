import { ethers } from "hardhat";

import { deployRoot } from "./src/deploy";
import { getRegistrar, getRegistry } from "./src/lib/get-contracts";

async function main() {
  const [deployer] = await ethers.getSigners();
  const [Registry, Registrar] = await Promise.all([getRegistry(deployer), getRegistrar(deployer)]);
  if (!Registry) throw new Error("Registry is not available");
  if (!Registrar) throw new Error("Registrar is not available");
  await deployRoot({ Registry, Registrar }, { deployer });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
