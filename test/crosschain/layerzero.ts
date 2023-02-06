import { ethers } from "hardhat";
import { getContracts } from "../../scripts/src/lib/get-contracts";
import * as luxon from "luxon";
import { InContractChain } from "../../scripts/src/constants/in-contract-chain";
import { CrossChainProvider } from "../../scripts/src/constants/cross-chain-provider";
import { Bridge } from "../../typechain/Bridge";
import { Wallet } from "ethers";

async function main() {
  // const [_signer] = await ethers.getSigners();
  const _signer = new Wallet(process.env.PRIVATE_KEY!);

  const name = "abcdefg123456789abcdefg123456789abcdef";
  const tld = "_universal";

  // ===== Polygon ===== //
  const PolygonProvider = new ethers.providers.JsonRpcProvider("https://endpoints.omniatech.io/v1/matic/mumbai/public");
  const PolygonSigner = _signer.connect(PolygonProvider);
  const PolygonContracts = await getContracts(PolygonSigner);
  if (!PolygonContracts.Bridge || !PolygonContracts.UniversalRegistrarController || !PolygonContracts.Registry) throw new Error();

  // ===== Avalanche ===== //
  // const AvalancheProvider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/avalanche_fuji");
  // const AvalancheSigner = _signer.connect(AvalancheProvider);
  // const AvalancheContracts = await getContracts(AvalancheSigner);
  // if (!AvalancheContracts.Bridge || !AvalancheContracts.UniversalRegistrarController) throw new Error();

  // Register Domain in Polygon
  // console.log("Registering domain in Polygon...");
  // const tx1 = await PolygonContracts.UniversalRegistrarController["register(bytes,bytes,address,uint64)"](
  //   ethers.utils.toUtf8Bytes(name),
  //   ethers.utils.toUtf8Bytes(tld),
  //   _signer.address,
  //   luxon.DateTime.now().plus({ day: 1 }).toSeconds().toFixed(0),
  // );
  // await tx1.wait();
  // console.log("tx1+", tx1.hash);

  console.log(`Sending bridge request...`);
  const _name_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(name));
  const _tld_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(tld));

  // console.log("LzProvider");
  // await PolygonContracts.LayerZeroProvider?.estimateFee(10106, ethers.utils.toUtf8Bytes("hello world"), ethers.utils.toUtf8Bytes(""));

  // console.log("Portal");
  // await PolygonContracts.Portal?.estimateFee(CrossChainProvider.LAYERZERO, 10106, ethers.utils.toUtf8Bytes("hello world"));

  // console.log(await PolygonContracts.Bridge.getChainId(InContractChain.AVALANCHE, CrossChainProvider.LAYERZERO));
  const fee = await PolygonContracts.Bridge.estimateFee(InContractChain.AVALANCHE, CrossChainProvider.LAYERZERO, _name_, _tld_);
  console.log({ fee: ethers.utils.formatEther(fee) });
  if ((await PolygonSigner.getBalance()).lt(fee)) throw new Error("Insufficient funds");

  const nonce = await PolygonContracts.Bridge.getNonce();
  console.log({ nonce });

  const ref = await PolygonContracts.Bridge.getRef(
    nonce,
    InContractChain.AVALANCHE,
    CrossChainProvider.LAYERZERO,
    _name_,
    _tld_,
    await PolygonContracts.Registry["getOwner(bytes32,bytes32)"](_name_, _tld_),
    await PolygonContracts.Registry["getExpiry(bytes32,bytes32)"](_name_, _tld_),
  );
  console.log({ ref });

  const tx2 = await PolygonContracts.Bridge.bridge(nonce, ref, InContractChain.AVALANCHE, CrossChainProvider.LAYERZERO, _name_, _tld_, {
    value: fee,
  });
  await tx2.wait();
  console.log("tx2+", tx2.hash);

  // console.log(`Accepting bridge request...`);
  // const tx3 = await AvalancheContracts.Bridge.accept(
  //   nonce,
  //   ref,
  //   InContractChain.AVALANCHE,
  //   CrossChainProvider.LAYERZERO,
  //   ethers.utils.toUtf8Bytes(name),
  //   ethers.utils.toUtf8Bytes(tld),
  //   await PolygonContracts.Registry["getOwner(bytes32,bytes32)"](ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld)),
  //   await PolygonContracts.Registry["getExpiry(bytes32,bytes32)"](ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld)),
  // );
  // await tx3.wait();
}

main();
