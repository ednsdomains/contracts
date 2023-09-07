import { ethers } from "hardhat";
import { Testnets } from "../network.config";
import { getContracts } from "./src/lib/get-contracts";
import { getProvider } from "./src/lib/get-provider";
import { upgradeRegistry } from "./src/upgrade";

async function main() {
  if (!process.env.PRIVATE_KEY) throw new Error("PRIVATE_KEY env variable is not set");
  const status: { chainId: number; success: boolean; error?: Error }[] = [];
  for (const chainId of Testnets) {
    let _status: { chainId: number; success: boolean; error?: Error } = { chainId, success: false };
    try {
      const provider = getProvider(chainId);
      const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
      const contracts = await getContracts(signer);
      await upgradeRegistry({ signer, chainId, contracts });
      _status.success = true;
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        _status.error = e;
      }
    }
    status.push(_status);
  }
  console.table(status);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
