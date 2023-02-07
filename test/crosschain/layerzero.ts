import { ethers } from "hardhat";
import { getContracts } from "../../scripts/src/lib/get-contracts";
import * as luxon from "luxon";
import { InContractChain } from "../../scripts/src/constants/in-contract-chain";
import { CrossChainProvider } from "../../scripts/src/constants/cross-chain-provider";
import { Bridge } from "../../typechain/Bridge";
import { Wallet } from "ethers";
import delay from "delay";

async function main() {
  // const [_signer] = await ethers.getSigners();
  const _signer = new Wallet(process.env.PRIVATE_KEY!);

  const name = `hello-world-${luxon.DateTime.now().toSeconds().toFixed(0)}`;
  const tld = "_universal";

  console.log({ name, tld });

  // ===== Avalanche ===== //
  const AvalancheProvider = new ethers.providers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc	");
  const AvalancheFeeData = await AvalancheProvider.getFeeData();
  const AvalancheSigner = _signer.connect(AvalancheProvider);
  const AvalancheContracts = await getContracts(AvalancheSigner);
  if (!AvalancheContracts.Bridge || !AvalancheContracts.UniversalRegistrarController || !AvalancheContracts.Registry) throw new Error();

  // ===== Polygon ===== //
  const PolygonProvider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com/");
  const PolygonSigner = _signer.connect(PolygonProvider);
  const PolygonContracts = await getContracts(PolygonSigner);
  if (!PolygonContracts.Bridge || !PolygonContracts.UniversalRegistrarController) throw new Error();

  // Register Domain in Avalanche
  console.log("Registering domain in Avalanche...");
  const tx1 = await AvalancheContracts.UniversalRegistrarController["register(bytes,bytes,address,uint64)"](
    ethers.utils.toUtf8Bytes(name),
    ethers.utils.toUtf8Bytes(tld),
    _signer.address,
    luxon.DateTime.now().plus({ day: 1 }).toSeconds().toFixed(0),
    {
      type: 2,
      maxFeePerGas: AvalancheFeeData.maxFeePerGas || undefined,
      maxPriorityFeePerGas: AvalancheFeeData.maxPriorityFeePerGas || undefined,
    },
  );
  await tx1.wait();
  console.log("tx1+", tx1.hash);

  // const lzChainId = await AvalancheContracts.LayerZeroProvider?.getChainId(InContractChain.POLYGON);
  // console.log({ lzChainId });

  await delay(2000);

  console.log(`Sending bridge request...`);
  const _name_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(name));
  const _tld_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(tld));

  const fee = await AvalancheContracts.Bridge.estimateFee(InContractChain.POLYGON, CrossChainProvider.LAYERZERO, _name_, _tld_);
  console.log({ fee: ethers.utils.formatEther(fee) });
  if ((await AvalancheSigner.getBalance()).lt(fee)) throw new Error("Insufficient funds");

  const nonce = await AvalancheContracts.Bridge.getNonce();
  console.log({ nonce });

  const ref = await AvalancheContracts.Bridge.getRef(
    nonce,
    InContractChain.POLYGON,
    CrossChainProvider.LAYERZERO,
    _name_,
    _tld_,
    await AvalancheContracts.Registry["getOwner(bytes32,bytes32)"](_name_, _tld_),
    await AvalancheContracts.Registry["getExpiry(bytes32,bytes32)"](_name_, _tld_),
  );
  console.log({ ref });

  // const tx2 = await AvalancheContracts.Registry.remove(_name_, _tld_);
  // console.log({ tx2: tx2.hash });

  // if (AvalancheContracts.Portal) {
  //   if (!(await AvalancheContracts.Portal.hasRole(await AvalancheContracts.Portal.SENDER_ROLE(), _signer.address))) {
  //     const tx = await AvalancheContracts.Portal.grantRole(await AvalancheContracts.Portal.SENDER_ROLE(), _signer.address);
  //     await tx.wait();
  //   }
  //   const _fee = await AvalancheContracts.Portal.estimateFee(
  //     InContractChain.POLYGON,
  //     CrossChainProvider.LAYERZERO,
  //     ethers.utils.defaultAbiCoder.encode(["address", "bytes32"], [PolygonContracts.Bridge.address, ref]),
  //   );
  //   console.log({ _fee: ethers.utils.formatEther(_fee) });
  //   const tx = await AvalancheContracts.Portal.send(
  //     _signer.address,
  //     InContractChain.POLYGON,
  //     CrossChainProvider.LAYERZERO,
  //     ethers.utils.defaultAbiCoder.encode(["address", "bytes32"], [PolygonContracts.Bridge.address, ref]),
  //     { value: _fee },
  //   );
  //   await tx.wait();
  //   console.log(tx.hash);
  // }

  try {
    const tx2 = await AvalancheContracts.Bridge.bridge(nonce, ref, InContractChain.POLYGON, CrossChainProvider.LAYERZERO, _name_, _tld_, {
      value: fee,
    });
    await tx2.wait();
    console.log("tx2+", tx2.hash);
  } catch (err) {
    console.error(err);
  }

  // console.log(`Accepting bridge request...`);
  // const tx3 = await AvalancheContracts.Bridge.accept(
  //   nonce,
  //   ref,
  //   InContractChain.AVALANCHE,
  //   CrossChainProvider.LAYERZERO,
  //   ethers.utils.toUtf8Bytes(name),
  //   ethers.utils.toUtf8Bytes(tld),
  //   await AvalancheContracts.Registry["getOwner(bytes32,bytes32)"](ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld)),
  //   await AvalancheContracts.Registry["getExpiry(bytes32,bytes32)"](ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld)),
  // );
  // await tx3.wait();
}

main();
