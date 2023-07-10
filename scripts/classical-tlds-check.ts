import hre, { ethers } from "hardhat";
import { IRegistry__factory } from "../typechain";
import { getRegistrar, getRegistry } from "./src/lib/get-contracts";
async function main() {
  const [signer] = await ethers.getSigners();
  const registrar = await getRegistrar(signer);
  const cc = await getRegistry(signer);
  const registry = IRegistry__factory.connect(cc?.Diamond!.address!, signer);
  if (registrar && registry) {
    const grace_period = await registry.getGracePeriod();
    console.log({ grace_period });
    const expiry = await registrar.getExpiry(ethers.utils.toUtf8Bytes("hello-world"), ethers.utils.toUtf8Bytes("gnosis"));
    console.log({ expiry });
    const isAvailable = await registrar!["isAvailable(bytes,bytes)"](ethers.utils.toUtf8Bytes("hello-world"), ethers.utils.toUtf8Bytes("gnosis"));
    console.log({ isAvailable });
  }
}

main();
