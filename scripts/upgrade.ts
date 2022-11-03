import hardhat, { ethers } from "hardhat";
import { AwsKmsSigner } from "ethers-aws-kms-signer";
import { upgrades } from "hardhat";
import axios from "axios";

interface GasStationResponse {
  safeLow: {
    maxPriorityFee: number;
    maxFee: number;
  };
  standard: {
    maxPriorityFee: number;
    maxFee: number;
  };
  fast: {
    maxPriorityFee: number;
    maxFee: number;
  };
  estimatedBaseFee: number;
  blockTime: number;
  blockNumber: number;
}

const provider = new hardhat.ethers.providers.JsonRpcProvider(
  "https://polygon-rpc.com/",
  { name: "Polygon Mainnet", chainId: 137 }
);
provider.getFeeData = async () => {
  const gasPrice = await provider.getGasPrice();
  const response = await axios.get<GasStationResponse>(
    "https://gasstation-mainnet.matic.network/v2"
  );
  return {
    maxFeePerGas: ethers.utils.parseUnits(
      Math.ceil(response.data.fast.maxFee) + "",
      "gwei"
    ),
    maxPriorityFeePerGas: ethers.utils.parseUnits(
      Math.ceil(response.data.fast.maxPriorityFee) + "",
      "gwei"
    ),
    gasPrice,
    lastBaseFeePerGas: null,
  };
};

let signer = new AwsKmsSigner({
  region: "ap-southeast-1",
  keyId: process.env.KMS_SIGNER_KEY_ARN!,
});
signer = signer.connect(provider);

async function main() {
  console.log("Signer Address:", await signer.getAddress());
  console.log(
    "Signer Balance:",
    hardhat.ethers.utils.formatEther(await signer.getBalance())
  );

  const EDNS_REGISTRY_ADDRESS = "0x7c5DbFE487D01BC0C75704dBfD334198E6AB2D12";
  const PUBLIC_RESOLVER_ADDRESS = "0x3c2DAab0AF88B0c5505ccB585e04FB33d7C80144";
  const BASE_REGISTRAR_IMPLEMENTATION_ADDRESS =
    "0x53a0018f919bde9C254bda697966C5f448ffDDcB";
  const EDNS_REGISTRAR_CONTROLLER_ADDRESS =
    "0x8C856f71d71e8CF4AD9A44cDC426b09e315c6A6a";
  const REVERSE_REGISTRAR_ADDRESS =
    "0xD986F9083F006D0E2d08c9F22247b4a0a213146D";

  const EDNSRegistry = await hardhat.ethers.getContractFactory(
    "EDNSRegistry",
    signer
  );
  const PublicResolver = await hardhat.ethers.getContractFactory(
    "PublicResolver",
    signer
  );
  const BaseRegistrarImplementation = await hardhat.ethers.getContractFactory(
    "BaseRegistrarImplementation",
    signer
  );
  const EDNSRegistrarController = await hardhat.ethers.getContractFactory(
    "EDNSRegistrarController",
    signer
  );
  const ReverseRegistrar = await hardhat.ethers.getContractFactory(
    "ReverseRegistrar",
    signer
  );

  const _registry = await upgrades.upgradeProxy(
    EDNS_REGISTRY_ADDRESS,
    EDNSRegistry
  );
  await _registry.deployed();
  console.log(`EDNS Registry upgraded`);

  const _resolver = await upgrades.upgradeProxy(
    PUBLIC_RESOLVER_ADDRESS,
    PublicResolver
  );
  await _resolver.deployed();
  console.log("Public Resolver upgraded");

  const _baseRegistrar = await upgrades.upgradeProxy(
    BASE_REGISTRAR_IMPLEMENTATION_ADDRESS,
    BaseRegistrarImplementation
  );
  await _baseRegistrar.deployed();
  console.log("Base Registrar upgraded");

  const _registrarController = await upgrades.upgradeProxy(
    EDNS_REGISTRAR_CONTROLLER_ADDRESS,
    EDNSRegistrarController
  );
  await _registrarController.deployed();
  console.log("EDNS Registry Controller upgraded");

  const _reverseRegistrar = await upgrades.upgradeProxy(
    REVERSE_REGISTRAR_ADDRESS,
    ReverseRegistrar
  );
  await _reverseRegistrar.deployed();
  console.log("Reverse Registry upgraded");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
