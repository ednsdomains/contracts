import { ethers } from "hardhat";

const NONCE = 208;

async function main() {
  const [signer] = await ethers.getSigners();
  const tx = await signer.sendTransaction({
    from: await signer.getAddress(),
    to: await signer.getAddress(),
    nonce: NONCE,
  });
  console.log(`{tx.nonce: ${tx.nonce}, tx.hash: ${tx.hash}}`);
  await tx.wait();
  console.log(`Done`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
