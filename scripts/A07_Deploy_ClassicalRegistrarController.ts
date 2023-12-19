import { ethers } from "hardhat";

import { deployClassicalRegistrarController } from "./src/deploy";
import { getContracts, getRegistrar, getRoot, getToken } from "./src/lib/get-contracts";

async function main() {
  const [signer] = await ethers.getSigners();
  const chainId = await signer.getChainId();
  const contracts = await getContracts(signer);
  await deployClassicalRegistrarController({ signer, chainId, contracts });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
