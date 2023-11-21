import { ethers } from "hardhat";

import { deployMigrationManager, deployMortgage } from "./src/deploy";
import { getContracts } from "./src/lib/get-contracts";

async function main() {
  const [signer] = await ethers.getSigners();
  const chainId = await signer.getChainId();
  const contracts = await getContracts(signer);
  await deployMortgage({ signer, chainId, contracts });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
