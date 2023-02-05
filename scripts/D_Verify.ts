import delay from "delay";
import hre, { ethers } from "hardhat";
import { getContractsData } from "./src/lib/get-contracts";

async function main() {
  const [signer] = await ethers.getSigners();
  const chainId = await signer.getChainId();
  const data = await getContractsData(chainId);
  if (data) {
    for (const contract in data.addresses) {
      if (data.addresses[contract]) {
        await hre.run("verify:verify", {
          address: data.addresses[contract],
        });
        await delay(1000);
      }
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
