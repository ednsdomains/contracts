import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { getMigrationManager } from "./src/lib/get-contracts";

const BASE_REGISTRAR_IMPLEMENTATION = "0xafFDDAd389bEe8a2AcBa0367dFAE5609B93c7F9b";

async function main() {
  const [signer] = await ethers.getSigners();

  const migrator = await getMigrationManager(signer);
  if (!migrator) throw new Error("Migrator not found");

  const tx = await migrator.migrate(
    BASE_REGISTRAR_IMPLEMENTATION,
    BigNumber.from("19023128690273105814840820634130348096983596624170102139128226471169155791403"),
    "fucknewcontarct",
    "meta",
  );
  console.log(`Hash: ${tx.hash}`);
  await tx.wait();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
