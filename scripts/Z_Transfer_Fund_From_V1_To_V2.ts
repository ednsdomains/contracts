import { ethers } from "hardhat";
import { IERC20, IERC20__factory } from "../typechain";
import { getProvider } from "./src/lib/get-provider";
import { AwsKmsSigner } from "./src/lib/kms-signer";

const AMOUNT = ethers.utils.parseEther("2000");

async function main() {
  const [current_signer] = await ethers.getSigners();
  const provider = getProvider(await current_signer.getChainId());
  await provider.ready;
  const legacy_signer = new AwsKmsSigner({ region: "ap-southeast-1", keyId: process.env.KMS_SIGNER_KEY_ARN! }, provider);
  // const tx = await legacy_signer.sendTransaction({
  //   to: current_signer.getAddress(),
  //   value: AMOUNT,
  // });
  const token = IERC20__factory.connect("0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", legacy_signer);

  const balance = await token.balanceOf(await legacy_signer.getAddress());

  const tx = await token.transfer("0x831514082a325902E55aa8828a5c9367a990F6Aa", balance);

  console.log(`{tx.nonce: ${tx.nonce}, tx.hash: ${tx.hash}}`);
  await tx.wait();
  console.log(`Done`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
