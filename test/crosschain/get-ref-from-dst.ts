import { ethers } from "hardhat";
import { getContracts } from "../../scripts/src/lib/get-contracts";
import * as luxon from "luxon";
import * as LayerZeroScan from "@layerzerolabs/scan-client";
import { CrossChainProvider } from "../../scripts/src/constants/cross-chain-provider";
import * as dotenv from "dotenv";
dotenv.config();

import NetworkConfig, { Network } from "../../network.config";
import delay from "delay";
import { getProvider } from "../../scripts/src/lib/get-provider";

async function main() {
  if (!process.env.PRIVATE_KEY) throw new Error("Private key is missing");

  const name = `testing-${luxon.DateTime.now().toSeconds().toFixed(0)}`;
  const tld = "web3";
  const expiry = luxon.DateTime.now().plus({ day: 1 }).toSeconds().toFixed(0);

  console.log({ name, tld });

  // =================================== //
  // =================================== //
  // =================================== //
  const FROM = Network.GNOSIS;
  const TO = Network.POLYGON;
  // =================================== //
  // =================================== //
  // =================================== //

  console.log(`Bridge test from [${NetworkConfig[FROM].name}] to [${NetworkConfig[TO].name}]`);

  const From_Provider = getProvider(FROM);
  const To_Provider = getProvider(TO);

  const From_Signer = new ethers.Wallet(process.env.PRIVATE_KEY, From_Provider);
  const To_Signer = new ethers.Wallet(process.env.PRIVATE_KEY, To_Provider);

  const From_Contracts = await getContracts(From_Signer);
  const To_Contracts = await getContracts(To_Signer);

  // const From_FeeData = await From_Signer.getFeeData();

  const received = await To_Contracts.Bridge?.isReceived("0xe45f561502ed202a86af63c422b7f4d4a88b7c959e275b531985190d7047bacc");
  console.log({ received });

  console.log(`Accepting bridge request...`);
  const tx3 = await To_Contracts.Bridge!.accept(
    1,
    "0xe45f561502ed202a86af63c422b7f4d4a88b7c959e275b531985190d7047bacc",
    NetworkConfig[TO].chain!,
    CrossChainProvider.LAYERZERO,
    ethers.utils.hexlify(ethers.utils.toUtf8Bytes("testing-1690716207")),
    ethers.utils.toUtf8Bytes("web3"),
    To_Signer.address,
    1690802607,
  );
  await tx3.wait();
  console.log("tx3+", tx3.hash);
}
main();
