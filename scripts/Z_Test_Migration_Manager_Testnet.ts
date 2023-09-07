import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { getMigrationManager } from "./src/lib/get-contracts";
import { ILegacyBaseRegistrar__factory } from "../typechain";

const BASE_REGISTRAR_IMPLEMENTATION = "0xafFDDAd389bEe8a2AcBa0367dFAE5609B93c7F9b";

async function main() {
  const [signer] = await ethers.getSigners();

  const migrator = await getMigrationManager(signer);
  if (!migrator) throw new Error("Migrator not found");

  const legacy = ILegacyBaseRegistrar__factory.connect(BASE_REGISTRAR_IMPLEMENTATION, signer);
  const e = await legacy.nameExpires(BigNumber.from("0x12bd0c503416854882484b3fcc3adeb3acc198c28a2f96eef967e2af43b941fc"));
  console.log({ e });

  const tx = await migrator.managed_migrate(
    BASE_REGISTRAR_IMPLEMENTATION,
    BigNumber.from("0x12bd0c503416854882484b3fcc3adeb3acc198c28a2f96eef967e2af43b941fc"),
    "newdomain",
    "test2",
    "0x14A1A496fABc43bFAfC358005dE336a7B5222b20",
    1718054332854,
  );
  console.log(`Hash: ${tx.hash}`);
  await tx.wait();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
