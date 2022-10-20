// import hre, { ethers } from "hardhat";
// import NetworkConfig, { Network } from "../../network.config";
// import { networkNameConverter } from "../function/networkNameConverter";
// import { fullLoad, load } from "../helpers/get-contracts";
// import { deployedChain } from "../helpers/deploy";
// // npx hardhat run scripts/test/lzSetup.ts --network fantomTestnet
// // npx hardhat run scripts/test/lzSetup.ts --network bnbTestnet
// // npx hardhat run scripts/test/lzSetup.ts --network rinkeby
// async function main() {
//   const TLDsingle = "abcdd";
//   const otherContract = deployedChain.filter((x) => {
//     return x != networkNameConverter(hre.network.name);
//   });
//   const networkConfig = NetworkConfig[networkNameConverter(hre.network.name)];
//   const provider = new hre.ethers.providers.JsonRpcProvider(networkConfig.url, {
//     chainId: networkConfig.chainId,
//     name: networkConfig.name,
//   });
//   let walletWithProvider = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
//
//   const currentContractAddress = await load(networkNameConverter(hre.network.name), walletWithProvider);
//
//   const othersContractAddress = await fullLoad(otherContract, walletWithProvider);
//
//   // let walletMnemonic = Wallet.fromMnemonic(process.env.MNEMONIC!);
//   // walletMnemonic = walletMnemonic.connect(provider);
//   otherContract.map(async (x) => {
//     console.log("Network:", NetworkConfig[x].layerzero.chainId);
//     await currentContractAddress.Token.setTrustedRemote(NetworkConfig[x].layerzero.chainId, othersContractAddress[x].Token.address);
//     console.log("tokenContract.setTrustedRemote Done");
//     await currentContractAddress.PublicResolverSynchronizer.setTrustedRemote(NetworkConfig[x].layerzero.chainId, othersContractAddress[x].PublicResolverSynchronizer.address);
//     console.log("publicResolverSynchronizer.setTrustedRemote Done");
//     console.log("PublicResolver", othersContractAddress[x].PublicResolver.address);
//     await currentContractAddress.OmniRegistrarSynchronizer.setTrustedRemote(NetworkConfig[x].layerzero.chainId, othersContractAddress[x].OmniRegistrarSynchronizer.address);
//     console.log("omniRegistrarSynchronizer.setTrustedRemote Done");
//     await currentContractAddress.Root.setTrustedRemote(NetworkConfig[x].layerzero.chainId, othersContractAddress[x].Root.address);
//     console.log("root.setTrustedRemote Done Chain ID:", NetworkConfig[x].layerzero.chainId, "Root Address:", othersContractAddress[x].Root.address);
//   });
//
//   // // singletonRegistrarController
//   // for (const TLD of OMNI_TLDS) {
//   //   const tld = ethers.utils.toUtf8Bytes(TLD);
//   //   await root.setControllerApproval(tld, currentContractAddress.omniRegistrarController, true);
//   // }
// }
//
// main().catch((error) => {
//   console.error(error);
//   process.exit(1);
// });
