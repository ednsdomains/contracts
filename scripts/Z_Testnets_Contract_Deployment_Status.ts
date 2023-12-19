import { ethers } from "hardhat";
import NetworkConfig, { Network, Testnets } from "../network.config";
import { getAllContractsData, getContractsData } from "./src/lib/get-contracts";
import table from "table";

async function main() {
  const _signer = new ethers.Wallet(process.env.PRIVATE_KEY!);

  const names = [
    "Registry.Diamond",
    "DefaultWrapper",
    "PublicResolver",
    "Registrar",
    "Root",
    "ClassicalRegistrarController",
    "UniversalRegistrarController",
    "OmniRegistrarController",
    "Portal",
    "Bridge",
    "Synchronizer",
    "LayerZeroProvider",
  ];

  const status: { [key: string]: { [key: string]: boolean } } = {};

  const data = await getAllContractsData();

  for (const network in NetworkConfig) {
    if (Testnets.find((t) => t === NetworkConfig[network].chainId) && NetworkConfig[network] && NetworkConfig[network].url) {
      if (!status[NetworkConfig[network].name]) status[NetworkConfig[network].name] = {};
      names.forEach((name) => {
        // @ts-ignore
        status[NetworkConfig[network].name][name] = !!data.find((d) => d.chainId === NetworkConfig[network].chainId)?.addresses[name];
      });
    }
  }
  console.log(`Account: ${_signer.address}`);
  console.table(status);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
