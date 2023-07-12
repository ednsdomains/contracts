import { ethers } from "hardhat";
import { getProvider } from "./src/lib/get-provider";
import { AwsKmsSigner } from "./src/lib/kms-signer";

const AMOUNT = ethers.utils.parseEther("2000");

async function main() {
  const [current_signer] = await ethers.getSigners();
  const provider = getProvider(await current_signer.getChainId());
  await provider.ready;
  const legacy_signer = new AwsKmsSigner({ region: "ap-southeast-1", keyId: process.env.KMS_SIGNER_KEY_ARN! }, provider);
  const tx = await legacy_signer.sendTransaction({
    to: current_signer.getAddress(),
    value: AMOUNT,
  });
  console.log(`{tx.nonce: ${tx.nonce}, tx.hash: ${tx.hash}}`);
  await tx.wait();
  console.log(`Done`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
