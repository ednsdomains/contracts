import { getContracts } from "../src/lib/get-contracts";
import { getProvider } from "../src/lib/get-provider";
import { ethers } from "hardhat";
import * as luxon from "luxon";
import * as dotenv from "dotenv";
dotenv.config();

const HOST = "web";
const NAME = `testtesttesttesttesttest`;
const TLD = "meta";
const EXPIRY = luxon.DateTime.now().plus({ day: 1 }).toSeconds().toFixed(0);

console.log({ HOST, NAME, TLD });

async function main() {
  if (!process.env.PRIVATE_KEY) throw new Error("Private key is missing");

  const provider = getProvider(5);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contracts = await getContracts(signer);

  const registry = await ethers.getContractAt("IRegistry", contracts.Registry!.Diamond!.address, signer);

  // const isTldEnabled = await registry.isEnable(ethers.utils.solidityKeccak256(["string"], [TLD]));
  // const isTldExists = await contracts.Registrar!["isExists(bytes32)"](ethers.utils.solidityKeccak256(["string"], [TLD]));

  // console.log({ isTldEnabled, isTldExists });

  // const tx1 = await contracts.UniversalRegistrarController!["register(bytes,bytes,address,uint64)"](
  //   ethers.utils.toUtf8Bytes(NAME),
  //   ethers.utils.toUtf8Bytes(TLD),
  //   signer.address,
  //   EXPIRY,
  // );
  // await tx1.wait();
  // console.log("tx1+", tx1.hash);

  // const isDomainExists = await registry["isExists(bytes32,bytes32)"](ethers.utils.solidityKeccak256(["string"], [NAME]), ethers.utils.solidityKeccak256(["string"], [TLD]));

  // const domainExpiry = await registry["getExpiry(bytes32,bytes32)"](ethers.utils.solidityKeccak256(["string"], [NAME]), ethers.utils.solidityKeccak256(["string"], [TLD]));

  // const isDefaultHostExists = await registry["isExists(bytes32,bytes32,bytes32)"](
  //   ethers.utils.solidityKeccak256(["string"], ["@"]),
  //   ethers.utils.solidityKeccak256(["string"], [NAME]),
  //   ethers.utils.solidityKeccak256(["string"], [TLD]),
  // );

  // const isNewHostExists = await registry["isExists(bytes32,bytes32,bytes32)"](
  //   ethers.utils.solidityKeccak256(["string"], [HOST]),
  //   ethers.utils.solidityKeccak256(["string"], [NAME]),
  //   ethers.utils.solidityKeccak256(["string"], [TLD]),
  // );

  // const user = await registry["getUser(bytes32,bytes32,bytes32)"](
  //   ethers.utils.solidityKeccak256(["string"], ["@"]),
  //   ethers.utils.solidityKeccak256(["string"], [NAME]),
  //   ethers.utils.solidityKeccak256(["string"], [TLD]),
  // );

  // const userExpiry = await registry["getUserExpiry(bytes32,bytes32,bytes32)"](
  //   ethers.utils.solidityKeccak256(["string"], ["@"]),
  //   ethers.utils.solidityKeccak256(["string"], [NAME]),
  //   ethers.utils.solidityKeccak256(["string"], [TLD]),
  // );

  // console.log({ isDomainExists, domainExpiry: domainExpiry.toNumber(), isDefaultHostExists, isNewHostExists, user, userExpiry });

  // const tx = await contracts.PublicResolver!.setAddress(ethers.utils.toUtf8Bytes("@"), ethers.utils.toUtf8Bytes(NAME), ethers.utils.toUtf8Bytes(TLD), signer.address);
  // await tx.wait();
  // console.log({ tx });

  // const tx2 = await contracts.PublicResolver!.setAddress(ethers.utils.toUtf8Bytes(HOST), ethers.utils.toUtf8Bytes(NAME), ethers.utils.toUtf8Bytes(TLD), signer.address);
  // await tx2.wait();
  // console.log({ tx2 });

  const tx3 = await contracts.PublicResolver!.setTypedText(
    ethers.utils.toUtf8Bytes(HOST),
    ethers.utils.toUtf8Bytes(NAME),
    ethers.utils.toUtf8Bytes(TLD),
    ethers.utils.toUtf8Bytes("cname"),
    "app.devnet.local",
  );
  await tx3.wait();
  console.log({ tx3 });
}

main();
