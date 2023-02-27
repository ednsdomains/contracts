import { ethers } from "hardhat";
import { getContracts } from "../../scripts/src/lib/get-contracts";
import * as luxon from "luxon";
import { Wallet } from "ethers";
import { InContractChain } from "../../scripts/src/constants/in-contract-chain";
import { CrossChainProvider } from "../../scripts/src/constants/cross-chain-provider";

async function main() {
  // const [_signer] = await ethers.getSigners();
  const _signer = new Wallet(process.env.PRIVATE_KEY!);

  // const name = `hello-world-${luxon.DateTime.now().toSeconds().toFixed(0)}`;
  const name = "hello-world";
  const tld = "_omni4";
  const expiry = luxon.DateTime.now().plus({ day: 1 }).toSeconds().toFixed(0);

  console.log({ name, tld });

  // ===== Avalanche ===== //
  const AvalancheProvider = new ethers.providers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc");
  // const AvalancheFeeData = await AvalancheProvider.getFeeData();
  const AvalancheSigner = _signer.connect(AvalancheProvider);
  const AvalancheContracts = await getContracts(AvalancheSigner);
  if (
    !AvalancheContracts.Synchronizer ||
    !AvalancheContracts.OmniRegistrarController ||
    !AvalancheContracts.Registrar ||
    !AvalancheContracts.Registry ||
    !AvalancheContracts.Portal ||
    !AvalancheContracts.PublicResolver
  ) {
    throw new Error();
  }

  // ===== Polygon Mumbai ===== //
  // const PolygonProvider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com/");
  // const PolygonSigner = _signer.connect(PolygonProvider);
  // const PolygonContracts = await getContracts(PolygonSigner);
  // if (!PolygonContracts.Registrar || !PolygonContracts.UniversalRegistrarController) {
  //   throw new Error();
  // }

  // ===== Fantom Testnet ===== //
  const FantomProvider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/fantom_testnet");
  const FantomSigner = _signer.connect(FantomProvider);
  const FantomContracts = await getContracts(FantomSigner);
  if (!FantomContracts.Synchronizer || !FantomContracts.OmniRegistrarController || !FantomContracts.Registrar || !FantomContracts.Registry || !FantomContracts.Portal) {
    throw new Error();
  }

  // const ews = AvalancheContracts.Registrar.interface.encodeFunctionData("register", [
  //   AvalancheSigner.address,
  //   ethers.utils.toUtf8Bytes(name),
  //   ethers.utils.toUtf8Bytes(tld),
  //   _signer.address,
  //   expiry,
  // ]);
  // console.log({ ews });
  // const fee = await AvalancheContracts.Synchronizer.estimateSyncFee(
  //   2,
  //   CrossChainProvider.LAYERZERO,
  //   await AvalancheContracts.Registry.getChains(ethers.utils.keccak256(ethers.utils.toUtf8Bytes(tld))),
  //   ews,
  // );
  // console.log({ fee: ethers.utils.formatEther(fee) });
  // console.log({ chains: await AvalancheContracts.Registry.getChains(ethers.utils.keccak256(ethers.utils.toUtf8Bytes(tld))) });
  // console.log("Registering domain on Avalanche...");
  // const tx1 = await AvalancheContracts.OmniRegistrarController["register(bytes,bytes,address,uint64)"](
  //   ethers.utils.toUtf8Bytes(name),
  //   ethers.utils.toUtf8Bytes(tld),
  //   _signer.address,
  //   expiry,
  //   {
  //     value: fee,
  //     gasLimit: 1000000,
  //   },
  // );
  // await tx1.wait();
  // console.log("tx1+", tx1.hash);

  const ews = AvalancheContracts.PublicResolver.interface.encodeFunctionData("setAddress", [
    ethers.utils.toUtf8Bytes("hi"),
    ethers.utils.toUtf8Bytes(name),
    ethers.utils.toUtf8Bytes(tld),
    AvalancheSigner.address,
  ]);
  console.log({ ews });
  const fee = await AvalancheContracts.Synchronizer.estimateSyncFee(
    0,
    CrossChainProvider.LAYERZERO,
    await AvalancheContracts.Registry.getChains(ethers.utils.keccak256(ethers.utils.toUtf8Bytes(tld))),
    ews,
  );
  console.log({ fee: ethers.utils.formatEther(fee) });
  // const tx1 = await AvalancheContracts.Registry["setRecord(bytes,bytes,bytes,uint16)"]();
  const tx2 = await AvalancheContracts.PublicResolver.setAddress(
    ethers.utils.toUtf8Bytes("hi"),
    ethers.utils.toUtf8Bytes(name),
    ethers.utils.toUtf8Bytes(tld),
    AvalancheSigner.address,
    { value: fee },
  );
  await tx2.wait();
  console.log("tx2+", tx2.hash);

  // const ews = FantomContracts.Registrar.interface.encodeFunctionData("register", [
  //   FantomSigner.address,
  //   ethers.utils.toUtf8Bytes(name),
  //   ethers.utils.toUtf8Bytes(tld),
  //   _signer.address,
  //   expiry,
  // ]);
  // console.log({ ews });
  // const fee = await FantomContracts.Synchronizer.estimateSyncFee(
  //   2,
  //   CrossChainProvider.LAYERZERO,
  //   await FantomContracts.Registry.getChains(ethers.utils.keccak256(ethers.utils.toUtf8Bytes(tld))),
  //   ews,
  // );
  // console.log({ fee: ethers.utils.formatEther(fee) });
  // console.log({ chains: await FantomContracts.Registry.getChains(ethers.utils.keccak256(ethers.utils.toUtf8Bytes(tld))) });
  // if (!(await FantomContracts.Registrar.hasRole(await FantomContracts.Registrar.BRIDGE_ROLE(), FantomSigner.address))) {
  //   const tx = await FantomContracts.Registrar.grantRole(await FantomContracts.Registrar.BRIDGE_ROLE(), FantomSigner.address);
  //   await tx.wait();
  // }
  // const tx = await FantomSigner.sendTransaction({
  //   to: FantomContracts.Registrar.address,
  //   data: ews,
  //   value: fee,
  //   gasLimit: 1000000,
  // });
  // await tx.wait();
  // console.log({ txHash: tx.hash });

  // if (!(await AvalancheContracts.Portal.hasRole(await AvalancheContracts.Portal.SENDER_ROLE(), AvalancheSigner.address))) {
  //   const tx = await AvalancheContracts.Portal.grantRole(await AvalancheContracts.Portal.SENDER_ROLE(), AvalancheSigner.address);
  //   await tx.wait();
  // }

  // const x = await AvalancheContracts.Portal.queryFilter(AvalancheContracts.Portal.filters.ProviderError());
  // const y = await AvalancheContracts.Portal.queryFilter(AvalancheContracts.Portal.filters.PanicError());
  // const z = await AvalancheContracts.Portal.queryFilter(AvalancheContracts.Portal.filters.LowLevelError());
  // console.log(x, y, z);
}
main();
