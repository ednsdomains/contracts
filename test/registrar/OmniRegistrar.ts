import NetworkConfig from "../../network.config";
import {networkNameConverter} from "../../scripts/function/networkNameConverter";
import hre, {ethers} from "hardhat";
import Contracts from "../../static/contracts.json";
import {NETWORKS, OMNI_TLDS} from "../helpers/init";
import delay from "delay";
import {load} from "../../scripts/helpers/load";
import {expect} from "chai";

// describe("Omni Registrar: ", async function () {
//     it("Singleton Registrar init", async function () {
//         const networkConfig = NetworkConfig[networkNameConverter(hre.network.name)]
//         const provider = new hre.ethers.providers.JsonRpcProvider(networkConfig.url, {
//             chainId: networkConfig.chainId,
//             name: networkConfig.name,
//         });
//         let walletWithProvider = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
//         const currentContractAddress = await load(networkNameConverter(hre.network.name), walletWithProvider);
//
//         for (const TLD of OMNI_TLDS) {
//             const tld = ethers.utils.toUtf8Bytes("TLD228");
//             const payload_ = await currentContractAddress.Root.populateTransaction.register_SYNC(tld, currentContractAddress.PublicResolver.address, true, true);
//             const fees = await currentContractAddress.Root.estimateSyncFee(payload_.data!);
//             console.log(ethers.utils.formatEther(fees));
//             expect(await currentContractAddress.Registry.callStatic["exists(bytes32)"](ethers.utils.keccak256(tld))).to.equal(false)
//             const rootRegister = await currentContractAddress.Root.register(tld, currentContractAddress.PublicResolver.address, true, true, {
//                 // 0.000001660703359502
//                 value: fees,
//                 gasLimit: 400000,
//             });
//             await rootRegister.wait();
//             console.log(JSON.stringify(rootRegister, null, 2));
//             // const root_register = await root.register(tld, currentContractAddress.publicResolver, true, true, {gasLimit: 40000});
//             console.log(`Regisiter: ${TLD}`);
//             console.log(`root_register tx: ${rootRegister}`);
//             await delay(1000);
//             expect(await currentContractAddress.Registry.callStatic["exists(bytes32)"](ethers.utils.keccak256(tld))).to.equal(true)
//         }
//     })
// })
