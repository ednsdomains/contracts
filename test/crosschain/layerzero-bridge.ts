import { ethers } from "hardhat";
import { getContracts } from "../../scripts/src/lib/get-contracts";
import * as luxon from "luxon";
import { InContractChain } from "../../scripts/src/constants/in-contract-chain";
import { CrossChainProvider } from "../../scripts/src/constants/cross-chain-provider";
import delay from "delay";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  if (!process.env.PRIVATE_KEY) throw new Error("Private key is missing");
  const [_signer] = await ethers.getSigners();
  const name = `hello-world-${luxon.DateTime.now().toSeconds().toFixed(0)}`;
  const tld = "_universal";
  const expiry = luxon.DateTime.now().plus({ day: 1 }).toSeconds().toFixed(0);

  console.log({ name, tld });

  const Contracts = await getContracts(_signer);
  const FeeData = await _signer.getFeeData();

  if (!Contracts.Bridge || !Contracts.UniversalRegistrarController || !Contracts.Registry?.Diamond || !Contracts.PublicResolver) {
    throw new Error();
  }
  const _registry = await ethers.getContractAt("IRegistry", Contracts.Registry.Diamond.address);

  // Register Domain
  console.log("Registering domain...");
  const tx1 = await Contracts.UniversalRegistrarController["register(bytes,bytes,address,uint64)"](
    ethers.utils.toUtf8Bytes(name),
    ethers.utils.toUtf8Bytes(tld),
    _signer.address,
    expiry,
    {
      type: 2,
      maxFeePerGas: FeeData.maxFeePerGas || undefined,
      maxPriorityFeePerGas: FeeData.maxPriorityFeePerGas || undefined,
    },
  );
  await tx1.wait();
  console.log("tx1+", tx1.hash);

  await delay(2000);

  console.log(`Sending bridge request...`);
  const _name_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(name));
  const _tld_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(tld));

  const fee = await Contracts.Bridge.estimateFee(InContractChain.AVALANCHE, CrossChainProvider.LAYERZERO, _name_, _tld_);
  console.log({ fee: ethers.utils.formatEther(fee) });
  if ((await _signer.getBalance()).lt(fee)) throw new Error("Insufficient funds");

  const nonce = await Contracts.Bridge.getNonce();

  const ref = await Contracts.Bridge.getRef(
    nonce,
    InContractChain.AVALANCHE,
    CrossChainProvider.LAYERZERO,
    _name_,
    _tld_,
    await _registry["getOwner(bytes32,bytes32)"](_name_, _tld_),
    await _registry["getExpiry(bytes32,bytes32)"](_name_, _tld_),
  );

  const tx2 = await Contracts.Bridge.bridge(nonce, ref, InContractChain.AVALANCHE, CrossChainProvider.LAYERZERO, _name_, _tld_, {
    value: fee,
  });
  await tx2.wait();
  console.log("tx2+", tx2.hash);

  console.log({
    nonce: nonce.toNumber(),
    ref,
    name: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(name)),
    tld: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(tld)),
    owner: _signer.address,
    expiry,
  });

  // console.log(`Accepting bridge request...`);
  // const tx3 = await PolygonContracts.Bridge.accept(
  //   11,
  //   "0x075e1433333d8a3cb6dd90f12451bc6d6cf7ef1755da4cd1990ac758713094dc",
  //   InContractChain.POLYGON,
  //   CrossChainProvider.LAYERZERO,
  //   ethers.utils.arrayify("0x68656c6c6f2d776f726c642d31363930313836383435"),
  //   ethers.utils.toUtf8Bytes(tld),
  //   "0xCD58F85e6Ec23733143599Fe0f982fC1d3f6C12c",
  //   1690273245,
  // );
  // await tx3.wait();
  // console.log("tx3+", tx3.hash);
}
main();
