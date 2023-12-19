import { ethers } from "hardhat";
import { getContracts } from "./src/lib/get-contracts";
import { upgradeRegistry, upgradeUniversalRegistrarController } from "./src/upgrade";

async function main() {
  const [signer] = await ethers.getSigners();
  const chainId = await signer.getChainId();
  const contracts = await getContracts(signer);
  await upgradeUniversalRegistrarController({ signer, chainId, contracts });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
