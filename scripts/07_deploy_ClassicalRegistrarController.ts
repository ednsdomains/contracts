import { ethers } from "hardhat";

import { deployClassicalRegistrarController } from "./src/deploy";
import { getRegistrar, getRoot, getToken } from "./src/get-contracts";
import NetworkConfig from "../network.config";

async function main() {
  const [deployer] = await ethers.getSigners();
  const [Token, Registrar, Root] = await Promise.all([getToken(deployer), getRegistrar(deployer), getRoot(deployer)]);
  const COIN_ID = NetworkConfig[await deployer.getChainId()].slip44?.coinId || 60;
  if (!Token) throw new Error("Token is not available");
  if (!Registrar) throw new Error("Registrar is not available");
  if (!Root) throw new Error("Root is not available");
  await deployClassicalRegistrarController({ TOKEN_ADDRESS: Token.address, COIN_ID, Registrar, Root }, { deployer });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
