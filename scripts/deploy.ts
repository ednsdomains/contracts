import hardhat from "hardhat";
import { keccak_256 as sha3 } from "js-sha3";
import uts46 from "idna-uts46-hx";
import { BigNumber, ethers, Overrides } from "ethers";
import { AwsKmsSigner } from "ethers-aws-kms-signer";
import {
  BaseRegistrarImplementation__factory as BaseRegistrarImplementation,
  EDNSRegistrarController__factory as EDNSRegistrarController,
  EDNSRegistry__factory as EDNSRegistry,
  ReverseRegistrar__factory as ReverseRegistrar,
  PublicResolver__factory as PublicResolver,
} from "../typechain";
// import {  } from "../typechain";
import { upgrades } from "hardhat";
// import Web3 from "web3";
// import { formatsByName, formatsByCoinType } from "@ensdomains/address-encoder";
// import { AffiliateProgram } from "../../../sdk/packages/lookup/src/typechain/AffiliateProgram";
// import { formatsByName } from "@ensdomains/address-encoder";
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

// const provider = hardhat.ethers.getDefaultProvider({
//   name: "iotexTestnet",
//   chainId: 4690,
//   _defaultProvider: (provider: typeof ethers.providers) =>
//     new provider.JsonRpcProvider("https://babel-api.testnet.iotex.io"),
// });

// const provider = new hardhat.ethers.providers.JsonRpcProvider(
//   { url: "https://exchaintestrpc.okex.org", timeout: 600 },
//   {
//     name: "OKC Test",
//     chainId: 65,
//   }
// );
// provider.getGasPrice = async () => {
//   return hardhat.ethers.BigNumber.from(1000000000000);
// };

// provider.getFeeData = async () => {
//   const gasPrice = await provider.getGasPrice();
//   return {
//     maxFeePerGas: ethers.BigNumber.from(60000000000),
//     maxPriorityFeePerGas: ethers.BigNumber.from(60000000000),
//     gasPrice,
//   };
// };
const signer = new AwsKmsSigner(
  {
    region: "ap-southeast-1",
    keyId: process.env.KMS_SIGNER_KEY_ARN!,
  },
  provider
);

export function namehash(inputName: string) {
  // Reject empty names:
  let node = "";
  for (let i = 0; i < 32; i++) {
    node += "00";
  }
  const name = normalize(inputName);
  if (name) {
    const labels = name.split(".");
    for (let i = labels.length - 1; i >= 0; i--) {
      const labelSha = sha3(labels[i]);
      node = sha3(Buffer.from(node + labelSha, "hex"));
    }
  }

  return "0x" + node;
}

function normalize(name: string) {
  return name
    ? uts46.toAscii(name, {
        useStd3ASCII: true,
        transitional: false,
        verifyDnsLength: false,
      })
    : name;
}

// const tlds: string[] = [
//   "404",
//   "meta",
//   "music",
//   "ass",
// ];
const tlds: string[] = [
  "test1",
  "test2",
  "test3",
  "ass",
  "meta",
  "404",
  "music",
  "sandbox",
];
// const tlds: string[] = [
//   "sandbox",
// ];

// const tlds: string[] = ["edns"];
const labelhash = (label: string) =>
  hardhat.ethers.utils.keccak256(hardhat.ethers.utils.toUtf8Bytes(label));
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const ZERO_HASH =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

const overrides: Overrides = {
  gasPrice: 1000000000000,
};

async function main() {
  console.log("Signer Address:", await signer.getAddress());
  console.log(
    "Signer Balance:",
    hardhat.ethers.utils.formatEther(await signer.getBalance())
  );

  // const EDNSRegistry = await hardhat.ethers.getContractFactory(
  //   "EDNSRegistry",
  //   signer
  // );
  // const ReverseRegistrar = await hardhat.ethers.getContractFactory(
  //   "ReverseRegistrar",
  //   signer
  // );
  // const PublicResolver = await hardhat.ethers.getContractFactory(
  //   "PublicResolver",
  //   signer
  // );
  // const BaseRegistrarImplementation = await hardhat.ethers.getContractFactory(
  //   "BaseRegistrarImplementation",
  //   signer
  // );
  // const EDNSRegistrarController = await hardhat.ethers.getContractFactory(
  //   "EDNSRegistrarController",
  //   signer
  // );

  // const AffiliateProgramFactory = await hardhat.ethers.getContractFactory(
  //   "AffiliateProgram",
  //   signer
  // );

  console.log(
    "Gas price: ",
    ethers.utils.formatUnits(await signer.getGasPrice(), "gwei")
  );

  // const registry = EDNSRegistry.connect(
  //   "0x0d33ECCcc3629B33a9CeE62108Ef39deD736d4E0",
  //   signer
  // );
  // const resolver = PublicResolver.connect(
  //   "0x4ECAafcc6Aa082F14C98e2bC7A37a35Dc30B13C5",
  //   signer
  // );
  const baseRegistrar = BaseRegistrarImplementation.connect(
    "0x53a0018f919bde9C254bda697966C5f448ffDDcB",
    signer
  );
  // const registrarController = EDNSRegistrarController.connect(
  //   "0xb3BF41C4B2A53D34296F7F237C4CcE145631d96D",
  //   signer
  // );
  // const reverseRegistrar = ReverseRegistrar.connect(
  //   "0xBF962734Abb798807a2875595cefE86FDF6726cc",
  //   signer
  // );

  const tx = await baseRegistrar.transferOwnership(
    "0x5D6FdbffD6dc6E8a0b69A52dbF010EfD905fB7Ad"
  );
  await tx.wait();

  // const _registry = await upgrades.deployProxy(EDNSRegistry, []);
  // await _registry.deployed();
  // console.log(`Registry deployed [${_registry.address}]`);
  // const registry = EDNSRegistry.attach(_registry.address);

  // const _resolver = await upgrades.deployProxy(PublicResolver, [
  //   registry.address,
  //   ZERO_ADDRESS,
  // ]);
  // await _resolver.deployed();
  // console.log(`Resolver deployed [${_resolver.address}]`);
  // const resolver = PublicResolver.attach(_resolver.address);

  // const _baseRegistrar = await upgrades.deployProxy(
  //   BaseRegistrarImplementation,
  //   [registry.address]
  // );
  // await _baseRegistrar.deployed();
  // console.log(`Base Registrar deployed [${_baseRegistrar.address}]`);
  // const baseRegistrar = BaseRegistrarImplementation.attach(
  //   _baseRegistrar.address
  // );

  // const _registrarController = await upgrades.deployProxy(
  //   EDNSRegistrarController,
  //   [baseRegistrar.address]
  // );
  // await _registrarController.deployed();
  // console.log(`Register Controller deployed [${_registrarController.address}]`);
  // const registrarController = EDNSRegistrarController.attach(
  //   _registrarController.address
  // );

  // const _reverseRegistrar = await upgrades.deployProxy(ReverseRegistrar, [
  //   registry.address,
  //   resolver.address,
  // ]);
  // await _reverseRegistrar.deployed();
  // console.log(`Reverse registrar deployed [${_reverseRegistrar.address}]`);
  // const reverseRegistrar = ReverseRegistrar.attach(_reverseRegistrar.address);

  // await setupRegistrar(registrarController, registry, baseRegistrar);
  // console.log("Finished setup registrar");
  // await setupResolver(registry, resolver);
  // console.log("Finish setup resolver");
  // await setupReverseRegistrar(registry, reverseRegistrar);
  // console.log("Finished setup reverse registrar");
  // await baseRegistrar.setBaseURI("https://api.devnet.edns.domains/metadata");

  // console.log("Finished setup setBaseURI");
  // const _saddr = await signer.getAddress();
  //
  // await registrarController.registerWithConfig(
  //   "abcdefghijkl",
  //   "test1",
  //   _saddr,
  //   31104000,
  //   resolver.address,
  //   _saddr
  // );
  // console.log("Finished registerWithConfig");
  // const nodehash = namehash("test1");
  // const label = Web3.utils.soliditySha3("abcdefghijkl", nodehash);
  // const hash = Web3.utils.soliditySha3(nodehash, label!);
  //
  // const addr = formatsByName["MATIC"].decoder(await signer.getAddress());
  // await resolver["setAddr(bytes32,uint256,bytes)"](hash!, 966, addr);
  // console.log("Finished setAddr(bytes32,uint256,bytes)");
  // await resolver["setAddr(bytes32,address)"](hash!, await signer.getAddress());
  // console.log("Finished setAddr(bytes32,address)");
}

async function setupResolver(
  registry: ethers.Contract,
  resolver: ethers.Contract
) {
  const resolverNode = namehash("resolver");
  const resolverLabel = labelhash("resolver");
  await registry.setSubnodeOwner(
    ZERO_HASH,
    resolverLabel,
    await signer.getAddress(),
    overrides
  );
  await registry.setResolver(resolverNode, resolver.address, overrides);
  await resolver["setAddr(bytes32,address)"](
    resolverNode,
    resolver.address,
    overrides
  );
}

async function setupRegistrar(
  registrarController: ethers.Contract,
  registry: ethers.Contract,
  registrar: ethers.Contract
) {
  await registrar.addController(registrarController.address);
  await registrarController.setNameLengthLimit(5, 128);
  // for (let tld of tlds) {
  //   // await registrarController.setTld(tld, namehash(tld), overrides);
  //   // await registrar.setBaseNode(namehash(tld), true, overrides);
  //   // await registry.setSubnodeOwner(ZERO_HASH, labelhash(tld), registrar.address, overrides);
  //   // console.log(tld, " | ", await registrarController.callStatic.tldAvailable(tld))
  //   console.log(
  //     "whycant.".concat(tld),
  //     " | ",
  //     await registrarController.callStatic.available("whycant", tld)
  //   );
  // }
}

async function setupReverseRegistrar(
  registry: ethers.Contract,
  reverseRegistrar: ethers.Contract
) {
  await registry.setSubnodeOwner(
    ZERO_HASH,
    labelhash("reverse"),
    await signer.getAddress(),
    overrides
  );
  await registry.setSubnodeOwner(
    namehash("reverse"),
    labelhash("addr"),
    reverseRegistrar.address,
    overrides
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
