import { getPrivateKey } from "./helpers";
import hre from "hardhat";

async function main() {
  const privateKey = await getPrivateKey();
  const signer = new hre.ethers.Wallet(privateKey);
  console.log("Wallet Address:", await signer.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
