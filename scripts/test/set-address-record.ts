import { getContracts } from "../src/lib/get-contracts";
import { getProvider } from "../src/lib/get-provider";
import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

const NAME = "crosschaintest";
const TLD = "meta";

async function main() {
  if (!process.env.PRIVATE_KEY) throw new Error("Private key is missing");

  const provider = getProvider(5);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contracts = await getContracts(signer);

  const registry = await ethers.getContractAt("IRegistry", contracts.Registry!.Diamond!.address, signer);

  const isDomainExists = await registry["isExists(bytes32,bytes32)"](ethers.utils.solidityKeccak256(["string"], [NAME]), ethers.utils.solidityKeccak256(["string"], [TLD]));

  const isHostExists = await registry["isExists(bytes32,bytes32,bytes32)"](
    ethers.utils.solidityKeccak256(["string"], ["@"]),
    ethers.utils.solidityKeccak256(["string"], [NAME]),
    ethers.utils.solidityKeccak256(["string"], [TLD]),
  );

  const user = await registry["getUser(bytes32,bytes32,bytes32)"](
    ethers.utils.solidityKeccak256(["string"], ["@"]),
    ethers.utils.solidityKeccak256(["string"], [NAME]),
    ethers.utils.solidityKeccak256(["string"], [TLD]),
  );

  const userExpiry = await registry["getUserExpiry(bytes32,bytes32,bytes32)"](
    ethers.utils.solidityKeccak256(["string"], ["@"]),
    ethers.utils.solidityKeccak256(["string"], [NAME]),
    ethers.utils.solidityKeccak256(["string"], [TLD]),
  );

  console.log({ isDomainExists, isHostExists, user, userExpiry });

  const tx = await contracts.PublicResolver!.setAddress(ethers.utils.toUtf8Bytes("@"), ethers.utils.toUtf8Bytes(NAME), ethers.utils.toUtf8Bytes(TLD), signer.address);
  await tx.wait();
  console.log({ tx });
}

main();
