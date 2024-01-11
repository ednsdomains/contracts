import fs from "fs";
import path from "path";
import { Mainnets, Testnets } from "../network.config";
import { getBridge, getContractsData, getPublicResolver, getRegistrar, getRegistry } from "./src/lib/get-contracts";
import { ethers } from "hardhat";
import { Manifest } from "@openzeppelin/upgrades-core";
import { getProvider } from "./src/lib/get-provider";

async function main() {
  if (!process.env.PRIVATE_KEY) throw new Error("PRIVATE_KEY env variable is not set");
  let map: { [network: number]: { [contract_name: string]: { hash: string; block: number } } } = {};
  try {
    map = JSON.parse(fs.readFileSync(path.join(process.cwd(), "static/contracts_metadata.json"), "utf-8"));
  } catch {
    //
  }

  for (const network of [...Testnets, ...Mainnets]) {
    const manifest = new Manifest(network);
    const data = await manifest.read();
    const contracts_data = await getContractsData(network);

    const provider = getProvider(network);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    // PublicResolver
    const resolver = await getPublicResolver(signer);
    if (resolver) {
      if (!map[network]) map[network] = {};
      if (!map[network]["PublicResolver"]) {
        const _data = data.proxies.find((x) => x.address === resolver.address);
        if (_data?.txHash) {
          map[network]["PublicResolver"] = {
            hash: _data.txHash,
            block: (await provider.getTransactionReceipt(_data.txHash))?.blockNumber || 0,
          };
        }
      }
    }
    // Registry
    const bridge = await getBridge(signer);
    if (bridge) {
      if (!map[network]) map[network] = {};
      if (!map[network]["Bridge"]) {
        const _data = data.proxies.find((x) => x.address === bridge.address);
        if (_data?.txHash) {
          map[network]["Bridge"] = {
            hash: _data.txHash,
            block: (await provider.getTransactionReceipt(_data.txHash))?.blockNumber || 0,
          };
        }
      }
    }
    // Registrar
    const registrar = await getRegistrar(signer);
    if (registrar) {
      if (!map[network]) map[network] = {};
      if (!map[network]["Registrar"]) {
        const _data = data.proxies.find((x) => x.address === registrar.address);
        if (_data?.txHash) {
          map[network]["Registrar"] = {
            hash: _data.txHash,
            block: (await provider.getTransactionReceipt(_data.txHash))?.blockNumber || 0,
          };
        }
      }
    }
  }
  fs.writeFileSync(path.join(process.cwd(), "static/contracts_metadata.json"), JSON.stringify(map, null, 2), "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
