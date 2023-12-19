import { ethers } from "hardhat";

import { deployPublicResolver } from "./src/deploy";
import { getContracts, getRegistry } from "./src/lib/get-contracts";

async function main() {
  const [signer] = await ethers.getSigners();
  const chainId = await signer.getChainId();
  const contracts = await getContracts(signer);
  await deployPublicResolver({ signer, chainId, contracts });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
