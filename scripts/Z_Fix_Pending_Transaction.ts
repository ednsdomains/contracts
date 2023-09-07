import { ethers } from "hardhat";
import { getProvider } from "./src/lib/get-provider";
import { AwsKmsSigner } from "./src/lib/kms-signer";

const NONCE = 189;

async function main() {
  const [signer] = await ethers.getSigners();
  // const provider = getProvider(await __signer.getChainId());
  // await provider.ready;
  // const signer = new AwsKmsSigner({ region: "ap-southeast-1", keyId: process.env.KMS_SIGNER_KEY_ARN! }, provider);
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
