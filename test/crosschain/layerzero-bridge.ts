import { ethers } from "hardhat";
import { getContracts } from "../../scripts/src/lib/get-contracts";
import * as luxon from "luxon";
import * as LayerZeroScan from "@layerzerolabs/scan-client";
import { CrossChainProvider } from "../../scripts/src/constants/cross-chain-provider";
import * as dotenv from "dotenv";
dotenv.config();

import NetworkConfig, { Network } from "../../network.config";
import delay from "delay";

async function main() {
  if (!process.env.PRIVATE_KEY) throw new Error("Private key is missing");

  const name = `hello-world-${luxon.DateTime.now().toSeconds().toFixed(0)}`;
  const tld = "_universal";
  const expiry = luxon.DateTime.now().plus({ day: 1 }).toSeconds().toFixed(0);

  console.log({ name, tld });

  const FROM = Network.GOERLI;
  const TO = Network.CELO_ALFAJORES;

  const From_Provider = new ethers.providers.JsonRpcProvider(NetworkConfig[FROM].url);
  const To_Provider = new ethers.providers.JsonRpcProvider(NetworkConfig[TO].url);

  const From_Signer = new ethers.Wallet(process.env.PRIVATE_KEY, From_Provider);
  const To_Signer = new ethers.Wallet(process.env.PRIVATE_KEY, To_Provider);

  const From_Contracts = await getContracts(From_Signer);
  const To_Contracts = await getContracts(To_Signer);

  const From_FeeData = await From_Signer.getFeeData();

  if (!From_Contracts.Bridge || !From_Contracts.UniversalRegistrarController || !From_Contracts.Registry?.Diamond || !From_Contracts.PublicResolver) {
    throw new Error();
  }
  const From_Registry = await ethers.getContractAt("IRegistry", From_Contracts.Registry.Diamond.address);

  // Register Domain
  console.log("Registering domain...");
  const tx1 = await From_Contracts.UniversalRegistrarController["register(bytes,bytes,address,uint64)"](
    ethers.utils.toUtf8Bytes(name),
    ethers.utils.toUtf8Bytes(tld),
    From_Signer.address,
    expiry,
    {
      type: 2,
      maxFeePerGas: From_FeeData.maxFeePerGas || undefined,
      maxPriorityFeePerGas: From_FeeData.maxPriorityFeePerGas || undefined,
    },
  );
  await tx1.wait();
  console.log("tx1+", tx1.hash);

  await delay(2000);

  console.log(`Sending bridge request...`);
  const _name_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(name));
  const _tld_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(tld));

  const fee = await From_Contracts.Bridge.estimateFee(NetworkConfig[TO].chain!, CrossChainProvider.LAYERZERO, _name_, _tld_);
  console.log({ fee: ethers.utils.formatEther(fee) });
  if ((await To_Signer.getBalance()).lt(fee)) throw new Error("Insufficient funds");

  const nonce = await From_Contracts.Bridge.getNonce();

  const ref = await From_Contracts.Bridge.getRef(
    nonce,
    NetworkConfig[TO].chain!,
    CrossChainProvider.LAYERZERO,
    _name_,
    _tld_,
    await From_Registry["getOwner(bytes32,bytes32)"](_name_, _tld_),
    await From_Registry["getExpiry(bytes32,bytes32)"](_name_, _tld_),
  );

  const tx2 = await From_Contracts.Bridge.bridge(nonce, ref, NetworkConfig[TO].chain!, CrossChainProvider.LAYERZERO, _name_, _tld_, {
    value: fee,
  });
  await tx2.wait();
  console.log("tx2+", tx2.hash);

  console.log({
    nonce: nonce.toNumber(),
    ref,
    name: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(name)),
    tld: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(tld)),
    owner: From_Signer.address,
    expiry,
  });

  const layerzeroScanClient = LayerZeroScan.createClient("testnet");

  let status: LayerZeroScan.MessageStatus | undefined;

  do {
    const b_tx = await layerzeroScanClient.getMessagesBySrcTxHash(tx2.hash);
    console.log(`Checking tx status from LayerZero...`);
    b_tx.messages.forEach((m) => {
      status = m.status;
    });
    if (status !== LayerZeroScan.MessageStatus.DELIVERED) await delay(10000);
  } while (status !== LayerZeroScan.MessageStatus.DELIVERED);

  await delay(5000);

  if (!To_Contracts.Bridge || !To_Contracts.UniversalRegistrarController || !To_Contracts.Registry?.Diamond || !To_Contracts.PublicResolver) {
    throw new Error();
  }

  console.log(`Accepting bridge request...`);
  const tx3 = await To_Contracts.Bridge.accept(
    nonce.toNumber(),
    ref,
    NetworkConfig[TO].chain!,
    CrossChainProvider.LAYERZERO,
    ethers.utils.hexlify(ethers.utils.toUtf8Bytes(name)),
    ethers.utils.toUtf8Bytes(tld),
    To_Signer.address,
    expiry,
  );
  await tx3.wait();
  console.log("tx3+", tx3.hash);
}
main();
