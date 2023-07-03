import { ethers } from "hardhat";
import { getContracts } from "./src/lib/get-contracts";
import {
  upgradeBridge,
  upgradeClassicalRegistrarController,
  upgradeLayerZeroProvider,
  upgradeMigrationManager,
  upgradeOmniRegistrarController,
  upgradePortal,
  upgradePublicResolver,
  upgradeRegistrar,
  upgradeRegistry,
  upgradeRoot,
  upgradeSynchronizer,
  upgradeUniversalRegistrarController,
  upgradeWrapper,
} from "./src/upgrade";

async function main() {
  const [signer] = await ethers.getSigners();
  const chainId = await signer.getChainId();
  const contracts = await getContracts(signer);
  await upgradeRegistry({ signer, chainId, contracts });
  await upgradeWrapper({ signer, chainId, contracts });
  await upgradePublicResolver({ signer, chainId, contracts });
  await upgradeRegistrar({ signer, chainId, contracts });
  await upgradeRoot({ signer, chainId, contracts });
  await upgradeClassicalRegistrarController({ signer, chainId, contracts });
  await upgradeUniversalRegistrarController({ signer, chainId, contracts });
  await upgradeOmniRegistrarController({ signer, chainId, contracts });
  await upgradePortal({ signer, chainId, contracts });
  await upgradeBridge({ signer, chainId, contracts });
  await upgradeSynchronizer({ signer, chainId, contracts });
  await upgradeLayerZeroProvider({ signer, chainId, contracts });
  await upgradeMigrationManager({ signer, chainId, contracts });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
