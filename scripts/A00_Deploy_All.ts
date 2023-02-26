import { ethers } from "hardhat";

import {
  deployBridge,
  deployClassicalRegistrarController,
  deployLayerZeroProvider,
  deployOmniRegistrarController,
  deployPortal,
  deployPublicResolver,
  deployRegistrar,
  deployRegistry,
  deployRoot,
  deployTokenMock,
  deployUniversalRegistrarController,
  deployWrapper,
} from "./src/deploy";
import { getContracts } from "./src/lib/get-contracts";
import { deploySynchronizer } from "./src/deploy";

async function main() {
  const [signer] = await ethers.getSigners();
  const chainId = await signer.getChainId();
  let contracts = await getContracts(signer);
  await deployRegistry({ signer, chainId, contracts });
  contracts = await getContracts(signer);
  await deployWrapper("EDNS Domains", "EDNS", { signer, chainId, contracts });
  contracts = await getContracts(signer);
  await deployPublicResolver({ signer, chainId, contracts });
  contracts = await getContracts(signer);
  await deployRegistrar({ signer, chainId, contracts });
  contracts = await getContracts(signer);
  await deployRoot({ signer, chainId, contracts });
  contracts = await getContracts(signer);
  await deployTokenMock({ signer, chainId, contracts });
  contracts = await getContracts(signer);
  await deployClassicalRegistrarController({ signer, chainId, contracts });
  contracts = await getContracts(signer);
  await deployUniversalRegistrarController({ signer, chainId, contracts });
  contracts = await getContracts(signer);
  await deployOmniRegistrarController({ signer, chainId, contracts });
  contracts = await getContracts(signer);
  await deployPortal({ signer, chainId, contracts });
  contracts = await getContracts(signer);
  await deployBridge({ signer, chainId, contracts });
  contracts = await getContracts(signer);
  await deploySynchronizer({ signer, chainId, contracts });
  contracts = await getContracts(signer);
  await deployLayerZeroProvider({ signer, chainId, contracts });
  contracts = await getContracts(signer);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
