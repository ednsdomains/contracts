import { ethers } from "hardhat";
import NetworkConfig from "../network.config";
import { deployBridge } from "./src/deploy";
import { getContracts } from "./src/lib/get-contracts";

async function main() {
  const [signer] = await ethers.getSigners();
  const chainId = await signer.getChainId();
  const contracts = await getContracts(signer);
  const Chain = NetworkConfig[chainId].chain;
  if (!Chain) throw new Error("InContracts not found");
  await deployBridge(Chain, { chainId, signer, contracts });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
