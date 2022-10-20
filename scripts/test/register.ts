// import hre, { ethers } from "hardhat";
// import NetworkConfig, { Network } from "../../network.config";
// import { BigNumber, Wallet } from "ethers";
// import delay from "delay";
// import { NETWORKS, OMNI_TLDS } from "../../test/helpers/init";
// import { networkNameConverter } from "../function/networkNameConverter";
// import Contracts from "../../static/contracts.json";
// import { load } from "../helpers/get-contracts";
// import { expect } from "chai";
// // npx hardhat run scripts/test/register.ts --network fantomTestnet
// // npx hardhat run scripts/test/register.ts --network bnbTestnet
// // npx hardhat run scripts/test/register.ts --network rinkeby
// async function main() {
//   const TLDsingle = "test";
//
//   const networkConfig = NetworkConfig[networkNameConverter(hre.network.name)];
//   const provider = new hre.ethers.providers.JsonRpcProvider(networkConfig.url, {
//     chainId: networkConfig.chainId,
//     name: networkConfig.name,
//   });
//   let walletWithProvider = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
//   const currentContractAddress = await load(networkNameConverter(hre.network.name), walletWithProvider);
//   // let walletMnemonic = Wallet.fromMnemonic(process.env.MNEMONIC!);
//   // walletMnemonic = walletMnemonic.connect(provider);
//
//   // const tldsingle = ethers.utils.toUtf8Bytes(TLDsingle);
//   // const tldSingleRegister = await root.estimateGas.register(tldsingle, currentContractAddress.publicResolver, true, false, { gasLimit: 4000000 });
//   // // await tldSingleRegister.wait();
//   // // console.log(NETWORKS[0], " ", await registry["exists(bytes32)"](ethers.utils.keccak256(tldsingle)));
//   // console.log(tldSingleRegister);
//   //
//
//   for (const TLD of OMNI_TLDS) {
//     console.log("PublicResolver", currentContractAddress.PublicResolver.address);
//     const tld = ethers.utils.toUtf8Bytes("BnbtoRink1111");
//     const payload_ = await currentContractAddress.Root.populateTransaction.register(tld, currentContractAddress.PublicResolver.address, true, true, [10002, 10001]);
//     // console.log(payload_)
//     console.log(payload_.data);
//     const fees = await currentContractAddress.Root.estimateSyncFee([10002, 10012], payload_.data!);
//     console.log(ethers.utils.formatEther(fees));
//     console.log(await currentContractAddress.Registry.callStatic["isExists(bytes32)"](ethers.utils.keccak256(tld)));
//     const rootRegister = await currentContractAddress.Root.register(tld, currentContractAddress.PublicResolver.address, true, true, [10002, 10001], {
//       // 0.000001660703359502
//       // value: fees.mul((BigNumber.from("2"))),
//       value: BigNumber.from("100000000000000000"),
//       // value:fees,
//       gasLimit: 500000,
//     });
//     await rootRegister.wait();
//     console.log(JSON.stringify(rootRegister, null, 2));
//     console.log(`Regisiter: ${TLD}`);
//     console.log(`root_register tx: ${rootRegister}`);
//     await delay(1000);
//     console.log(await currentContractAddress.Registry.callStatic["isExists(bytes32)"](ethers.utils.keccak256(tld)));
//   }
// }
//
// main().catch((error) => {
//   console.error(error);
//   process.exit(1);
// });
