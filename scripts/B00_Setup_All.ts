import { ethers } from "hardhat";
import { getContracts } from "./src/lib/get-contracts";
import {
  setupBridge,
  setupClassicalRegistrarController,
  setupDefaultWrapper,
  setupLayerZeroProvider,
  setupMigrationManager,
  setupOmniRegistrarController,
  setupPortal,
  setupPublicResolver,
  setupRegistrar,
  setupRegistry,
  setupRoot,
  setupSynchronizer,
  setupUniversalRegistrarController,
} from "./src/setup";

async function main() {
  const [signer] = await ethers.getSigners();
  const chainId = await signer.getChainId();
  const contracts = await getContracts(signer);
  await setupRegistry({ signer, chainId, contracts });
  await setupDefaultWrapper({ signer, chainId, contracts });
  await setupPublicResolver({ signer, chainId, contracts });
  await setupRegistrar({ signer, chainId, contracts });
  await setupRoot({ signer, chainId, contracts });
  await setupClassicalRegistrarController({ signer, chainId, contracts });
  await setupUniversalRegistrarController({ signer, chainId, contracts });
  await setupOmniRegistrarController({ signer, chainId, contracts });
  await setupBridge({ signer, chainId, contracts });
  await setupSynchronizer({ signer, chainId, contracts });
  await setupPortal({ signer, chainId, contracts });
  await setupLayerZeroProvider({ signer, chainId, contracts });
  await setupMigrationManager({ signer, chainId, contracts });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
