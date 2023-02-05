import { ethers } from "hardhat";

import {
  deployBridge,
  deployClassicalRegistrarController,
  deployLayerZeroProvider,
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

async function main() {
  const [signer] = await ethers.getSigners();
  const chainId = await signer.getChainId();
  let contracts = await getContracts(signer);
  await deployRegistry({ chainId, signer, contracts });
  contracts = await getContracts(signer);
  await deployWrapper("EDNS Domains", "EDNS", { chainId, signer, contracts });
  contracts = await getContracts(signer);
  await deployPublicResolver({ chainId, signer, contracts });
  contracts = await getContracts(signer);
  await deployRegistrar({ chainId, signer, contracts });
  contracts = await getContracts(signer);
  await deployRoot({ chainId, signer, contracts });
  contracts = await getContracts(signer);
  await deployTokenMock({ chainId, signer, contracts });
  contracts = await getContracts(signer);
  await deployClassicalRegistrarController({ chainId, signer, contracts });
  contracts = await getContracts(signer);
  await deployUniversalRegistrarController({ chainId, signer, contracts });
  contracts = await getContracts(signer);
  await deployPortal({ chainId, signer, contracts });
  contracts = await getContracts(signer);
  await deployBridge({ chainId, signer, contracts });
  contracts = await getContracts(signer);
  await deployLayerZeroProvider({ chainId, signer, contracts });
  contracts = await getContracts(signer);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
