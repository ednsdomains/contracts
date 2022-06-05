// import hardhat, { ethers } from "hardhat";
// import { AwsKmsSigner } from "ethers-aws-kms-signer";
// import { upgrades } from "hardhat";

// const provider = new hardhat.ethers.providers.InfuraProvider(
//   hardhat.network.name,
//   process.env.INFURA_API_KEY
// );
// provider.getFeeData = async () => {
//   const gasPrice = await provider.getGasPrice();
//   return {
//     maxFeePerGas: ethers.BigNumber.from(40000000000),
//     maxPriorityFeePerGas: ethers.BigNumber.from(40000000000),
//     gasPrice,
//   };
// };

// let signer = new AwsKmsSigner({
//   region: "ap-southeast-1",
//   keyId: process.env.KMS_SIGNER_KEY_ARN!,
// });
// signer = signer.connect(provider);

// async function main() {
//   console.log("Signer Address:", await signer.getAddress());
//   console.log(
//     "Signer Balance:",
//     hardhat.ethers.utils.formatEther(await signer.getBalance())
//   );

//   const EDNS_REGISTRY_ADDRESS = process.env.EDNS_REGISTRY_CONTRACT_ADDRESS!;
//   const PUBLIC_RESOLVER_ADDRESS = process.env.PUBLIC_RESOLVER_CONTRACT_ADDRESS!;
//   const BASE_REGISTRAR_IMPLEMENTATION_ADDRESS =
//     process.env.BASE_REGISTRAR_IMPLEMENTATION_CONTRACT_ADDRESS!;
//   const EDNS_REGISTRAR_CONTROLLER_ADDRESS =
//     process.env.EDNS_REGISTRAR_CONTROLLER_CONTRACT_ADDRESS!;
//   const REVERSE_REGISTRAR_ADDRESS =
//     process.env.REVERSE_RESOLVER_CONTRACT_ADDRESS!;

//   const EDNSRegistry = await hardhat.ethers.getContractFactory(
//     "EDNSRegistry",
//     signer
//   );
//   const PublicResolver = await hardhat.ethers.getContractFactory(
//     "PublicResolver",
//     signer
//   );
//   const BaseRegistrarImplementation = await hardhat.ethers.getContractFactory(
//     "BaseRegistrarImplementation",
//     signer
//   );
//   const EDNSRegistrarController = await hardhat.ethers.getContractFactory(
//     "EDNSRegistrarController",
//     signer
//   );
//   const ReverseRegistrar = await hardhat.ethers.getContractFactory(
//     "ReverseRegistrar",
//     signer
//   );

//   // const _registry = await upgrades.upgradeProxy(EDNS_REGISTRY_ADDRESS, EDNSRegistry);
//   // // await _registry.deployed();
//   // console.log(`EDNS Registry upgraded`);

//   // const _resolver = await upgrades.upgradeProxy(PUBLIC_RESOLVER_ADDRESS, PublicResolver);
//   // console.log("Public Resolver upgraded");

//   const _baseRegistrar = await upgrades.upgradeProxy(
//     BASE_REGISTRAR_IMPLEMENTATION_ADDRESS,
//     BaseRegistrarImplementation
//   );
//   console.log("Base Registrar Implementation upgraded");

//   // const _registrarController = await upgrades.upgradeProxy(EDNS_REGISTRAR_CONTROLLER_ADDRESS, EDNSRegistrarController);
//   // console.log("EDNS Registry Controller upgraded");

//   // const _reverseRegistrar = await upgrades.upgradeProxy(REVERSE_REGISTRAR_ADDRESS, ReverseRegistrar);
//   // console.log("Reverse Registry upgraded");
// }

// main().catch((error) => {
//   console.error(error);
//   process.exit(1);
// });
