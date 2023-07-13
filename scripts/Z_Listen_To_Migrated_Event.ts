import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { getMigrationManager } from "./src/lib/get-contracts";

async function main() {
  const [signer] = await ethers.getSigners();

  const migrator = await getMigrationManager(signer);
  if (!migrator) throw new Error("Migrator not found");

  const filter = migrator.filters["Migrated"]();
  console.log(`Start listening for Migrated events...`);
  migrator.on(filter, (owner, name, tld, oldTokenId) => {
    console.log(owner, name, tld, oldTokenId);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
