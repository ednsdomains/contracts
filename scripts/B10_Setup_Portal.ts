import { ethers } from "hardhat";
import { getContracts } from "./src/lib/get-contracts";
import { setupPortal } from "./src/setup";

async function main() {
  const [signer] = await ethers.getSigners();
  const chainId = await signer.getChainId();
  const contracts = await getContracts(signer);
  await setupPortal({ chainId, signer, contracts });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
