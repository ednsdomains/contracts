import { ethers } from "hardhat";
import { getContracts } from "../../scripts/src/lib/get-contracts";
import * as luxon from "luxon";
import { Wallet } from "ethers";
import { InContractChain } from "../../scripts/src/constants/in-contract-chain";
import { CrossChainProvider } from "../../scripts/src/constants/cross-chain-provider";

async function main() {
  // const [_signer] = await ethers.getSigners();
  const _signer = new Wallet(process.env.PRIVATE_KEY!);

  const name = `hello-world-${luxon.DateTime.now().toSeconds().toFixed(0)}`;
  const tld = "_omni2";
  const expiry = luxon.DateTime.now().plus({ day: 1 }).toSeconds().toFixed(0);

  console.log({ name, tld });

  // ===== Avalanche ===== //
  const AvalancheProvider = new ethers.providers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc");
  const AvalancheFeeData = await AvalancheProvider.getFeeData();
  const AvalancheSigner = _signer.connect(AvalancheProvider);
  const AvalancheContracts = await getContracts(AvalancheSigner);
  if (!AvalancheContracts.Synchronizer || !AvalancheContracts.OmniRegistrarController || !AvalancheContracts.Registrar || !AvalancheContracts.Registry) throw new Error();

  const ews = AvalancheContracts.Registrar.interface.encodeFunctionData("register", [ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld), _signer.address, expiry]);
  const fee = await AvalancheContracts.Synchronizer.estimateSyncFee(
    2,
    CrossChainProvider.LAYERZERO,
    await AvalancheContracts.Registry.getTldChains(ethers.utils.keccak256(ethers.utils.toUtf8Bytes(tld))),
    ews,
  );

  console.log({ fee: ethers.utils.formatEther(fee) });
  if ((await AvalancheSigner.getBalance()).lt(fee)) throw new Error("Insufficient funds");

  console.log("chains", await AvalancheContracts.Registry.getTldChains(ethers.utils.keccak256(ethers.utils.toUtf8Bytes(tld))));

  console.log("Registering domain on Avalanche...");
  const tx1 = await AvalancheContracts.OmniRegistrarController["register(bytes,bytes,address,uint64)"](
    ethers.utils.toUtf8Bytes(name),
    ethers.utils.toUtf8Bytes(tld),
    _signer.address,
    expiry,
    {
      value: fee,
    },
  );
  await tx1.wait();
  console.log("tx1+", tx1.hash);

  // const x = await AvalancheContracts.Synchronizer.queryFilter(AvalancheContracts.Synchronizer.filters.BeforeSendToPortal());
  // console.log(x[0].args);
}
main();
