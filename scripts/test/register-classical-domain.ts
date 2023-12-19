import { getContracts } from "../src/lib/get-contracts";
import { getProvider } from "../src/lib/get-provider";
import { ethers } from "hardhat";
import * as luxon from "luxon";
import * as dotenv from "dotenv";
import { Network } from "../../network.config";
dotenv.config();

const NAME = `test-${luxon.DateTime.now().toSeconds().toFixed(0)}`;
const TLD = "iotex";
const EXPIRY = luxon.DateTime.now().plus({ day: 1 }).toSeconds().toFixed(0);

console.log({ NAME, TLD });

async function main() {
  if (!process.env.PRIVATE_KEY) throw new Error("Private key is missing");

  const provider = getProvider(Network.IOTEX_TESTNET);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contracts = await getContracts(signer);

  const registry = await ethers.getContractAt("IRegistry", contracts.Registry!.Diamond!.address, signer);

  const isTldEnabled = await registry.isEnable(ethers.utils.solidityKeccak256(["string"], [TLD]));
  const isTldExists = await contracts.Registrar!["isExists(bytes32)"](ethers.utils.solidityKeccak256(["string"], [TLD]));

  console.log({ isTldEnabled, isTldExists });

  const tx1 = await contracts.ClassicalRegistrarController!["register(bytes,bytes,address,uint64)"](
    ethers.utils.toUtf8Bytes(NAME),
    ethers.utils.toUtf8Bytes(TLD),
    signer.address,
    EXPIRY,
  );
  await tx1.wait();
  console.log("tx1+", tx1.hash);
}

main();
