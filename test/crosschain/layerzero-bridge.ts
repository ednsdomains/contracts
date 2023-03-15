import { ethers } from "hardhat";
import { getContracts } from "../../scripts/src/lib/get-contracts";
import * as luxon from "luxon";
import { InContractChain } from "../../scripts/src/constants/in-contract-chain";
import { CrossChainProvider } from "../../scripts/src/constants/cross-chain-provider";
import delay from "delay";

async function main() {
  if (!process.env.PRIVATE_KEY) throw new Error("Private key is missing");
  const _signer = new ethers.Wallet(process.env.PRIVATE_KEY);

  const name = `hello-world-${luxon.DateTime.now().toSeconds().toFixed(0)}`;
  const tld = "_universal";
  const expiry = luxon.DateTime.now().plus({ day: 1 }).toSeconds().toFixed(0);

  console.log({ name, tld });

  // ===== Avalanche Fuji ===== //
  const AvalancheProvider = new ethers.providers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc");
  const AvalancheFeeData = await AvalancheProvider.getFeeData();
  const AvalancheSigner = _signer.connect(AvalancheProvider);
  const AvalancheContracts = await getContracts(AvalancheSigner);
  if (!AvalancheContracts.Bridge || !AvalancheContracts.UniversalRegistrarController || !AvalancheContracts.Registry?.Diamond || !AvalancheContracts.PublicResolver)
    throw new Error();
  const _registry = await ethers.getContractAt("IRegistry", AvalancheContracts.Registry.Diamond.address);

  // ===== Polygon Mumbai ===== //
  // const PolygonProvider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com/");
  // const PolygonSigner = _signer.connect(PolygonProvider);
  // const PolygonContracts = await getContracts(PolygonSigner);
  // if (!PolygonContracts.Bridge || !PolygonContracts.UniversalRegistrarController) throw new Error();

  // if (!(await _registry.hasRole(await _registry.REGISTRAR_ROLE(), _signer.address))) {
  //   const tx = await _registry.grantRole(await _registry.REGISTRAR_ROLE(), _signer.address);
  //   await tx.wait();
  // }

  // const tx1 = await _registry["setRecord(bytes,bytes,address,address,uint64)"](
  //   ethers.utils.toUtf8Bytes(name),
  //   ethers.utils.toUtf8Bytes(tld),
  //   _signer.address,
  //   AvalancheContracts.PublicResolver.address,
  //   expiry,
  // );
  // await tx1.wait();
  // console.log("tx1+", tx1.hash);

  // Register Domain in Avalanche
  console.log("Registering domain in Avalanche...");
  const tx1 = await AvalancheContracts.UniversalRegistrarController["register(bytes,bytes,address,uint64)"](
    ethers.utils.toUtf8Bytes(name),
    ethers.utils.toUtf8Bytes(tld),
    _signer.address,
    expiry,
    {
      type: 2,
      maxFeePerGas: AvalancheFeeData.maxFeePerGas || undefined,
      maxPriorityFeePerGas: AvalancheFeeData.maxPriorityFeePerGas || undefined,
    },
  );
  await tx1.wait();
  console.log("tx1+", tx1.hash);

  await delay(2000);

  console.log(`Sending bridge request...`);
  const _name_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(name));
  const _tld_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(tld));

  const fee = await AvalancheContracts.Bridge.estimateFee(InContractChain.POLYGON, CrossChainProvider.LAYERZERO, _name_, _tld_);
  console.log({ fee: ethers.utils.formatEther(fee) });
  if ((await AvalancheSigner.getBalance()).lt(fee)) throw new Error("Insufficient funds");

  const nonce = await AvalancheContracts.Bridge.getNonce();

  const ref = await AvalancheContracts.Bridge.getRef(
    nonce,
    InContractChain.POLYGON,
    CrossChainProvider.LAYERZERO,
    _name_,
    _tld_,
    await _registry["getOwner(bytes32,bytes32)"](_name_, _tld_), // await AvalancheContracts.Registry.Diamond["getOwner(bytes32,bytes32)"](_name_, _tld_),
    await _registry["getExpiry(bytes32,bytes32)"](_name_, _tld_), // await AvalancheContracts.Registry.Diamond["getExpiry(bytes32,bytes32)"](_name_, _tld_),
  );

  const tx2 = await AvalancheContracts.Bridge.bridge(nonce, ref, InContractChain.POLYGON, CrossChainProvider.LAYERZERO, _name_, _tld_, {
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
  //   1,
  //   "0x875ee729df9f432d3d826976b5e17d3a7fa51978a4e0602f4bec9f98ad44b660",
  //   InContractChain.POLYGON,
  //   CrossChainProvider.LAYERZERO,
  //   ethers.utils.arrayify("0x68656c6c6f2d776f726c642d31363737333233373837"),
  //   ethers.utils.toUtf8Bytes(tld),
  //   "0xCD58F85e6Ec23733143599Fe0f982fC1d3f6C12c",
  //   1677410187,
  // );
  // await tx3.wait();
  // console.log("tx3+", tx3.hash);
}
main();
