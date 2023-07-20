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
    BigNumber.from("109783084056604531771219068466088667082536763616297497846805007741235889629597"),
    "testmigration1",
    "meta",
  );
  console.log(`Hash: ${tx.hash}`);
  await tx.wait();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});