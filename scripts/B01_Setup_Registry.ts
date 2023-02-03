import { ethers } from "hardhat";
import { getDefaultWrapper, getPublicResolver, getRegistrar, getRegistry, getRoot } from "./src/lib/get-contracts";
import { setupRegistrar } from "./src/setup";

async function main() {
  const [deployer] = await ethers.getSigners();

  const [Registry, Root, PublicResolver, Registrar, DefaultWrapper] = await Promise.all([
    getRegistry(deployer),
    getRoot(deployer),
    getPublicResolver(deployer),
    getRegistrar(deployer),
    getDefaultWrapper(deployer),
  ]);

  if (!Registry) throw new Error("Registry is not available");
  if (!Root) throw new Error("Root is not available");
  if (!PublicResolver) throw new Error("PublicResolver is not available");
  if (!Registrar) throw new Error("Registrar is not available");
  if (!DefaultWrapper) throw new Error("DefaultWrapper is not available");

  await setupRegistrar({ contracts: { Registry, Root, PublicResolver, Registrar, DefaultWrapper }, chainId: await deployer.getChainId() });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
