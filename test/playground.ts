import { ethers } from "ethers";

async function main() {
  const tld = "meta";
  console.log(ethers.utils.namehash(tld));
}

main().catch((error) => console.error(error));
