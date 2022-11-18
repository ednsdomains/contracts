import hardhat from "hardhat";
import { keccak_256 as sha3 } from "js-sha3";
import uts46 from "idna-uts46-hx";
import { BigNumber, ethers, Overrides } from "ethers";
import { AwsKmsSigner } from "ethers-aws-kms-signer";
import {
  BaseRegistrarImplementation,
  EDNSRegistrarController,
  EDNSRegistry,
  ReverseRegistrar,
  PublicResolver,
  BaseRegistrarImplementation__factory as BaseRegistrarImplementation_Factory,
  EDNSRegistrarController__factory as EDNSRegistrarController_Factory,
  EDNSRegistry__factory as EDNSRegistry_Factory,
  ReverseRegistrar__factory as ReverseRegistrar_Factory,
  PublicResolver__factory as PublicResolver_Factory,
} from "../typechain";
// import {  } from "../typechain";
import { upgrades } from "hardhat";
// import Web3 from "web3";
// import { formatsByName, formatsByCoinType } from "@ensdomains/address-encoder";
// import { AffiliateProgram } from "../../../sdk/packages/lookup/src/typechain/AffiliateProgram";
// import { formatsByName } from "@ensdomains/address-encoder";
import axios from "axios";
import { EDNS } from "../typechain/EDNS";

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

// const provider = new hardhat.ethers.providers.JsonRpcProvider(
//   { url: "https://babel-api.mainnet.iotex.io" },
//   {
//     name: "IoTeX Mainnet",
//     chainId: 4689,
//   }
// );

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

const tlds: string[] = [
  "404",
  "meta",
  "music",
  "ass",
  "sandbox",
  "web3",
  "gamefi",
];
// const tlds: string[] = [
//   "test1",
//   "test2",
//   "test3",
//   "ass",
//   "meta",
//   "404",
//   "music",
//   "sandbox",
// ];
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
  // gasPrice: 1000000000000,
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

  const registry = EDNSRegistry_Factory.connect(
    "0x7c5DbFE487D01BC0C75704dBfD334198E6AB2D12",
    signer
  );
  const resolver = PublicResolver_Factory.connect(
    "0x3c2DAab0AF88B0c5505ccB585e04FB33d7C80144",
    signer
  );
  const baseRegistrar = BaseRegistrarImplementation_Factory.connect(
    "0x53a0018f919bde9C254bda697966C5f448ffDDcB",
    signer
  );
  const registrarController = EDNSRegistrarController_Factory.connect(
    "0x8C856f71d71e8CF4AD9A44cDC426b09e315c6A6a",
    signer
  );
  const reverseRegistrar = ReverseRegistrar_Factory.connect(
    "0xD986F9083F006D0E2d08c9F22247b4a0a213146D",
    signer
  );

  // const tx = await baseRegistrar.transferOwnership(
  //   "0x5D6FdbffD6dc6E8a0b69A52dbF010EfD905fB7Ad"
  // );
  // await tx.wait();

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

  await setupRegistrar(registrarController, registry, baseRegistrar);
  console.log("Finished setup registrar");
  // await setupResolver(registry, resolver);
  // console.log("Finish setup resolver");
  // await setupReverseRegistrar(registry, reverseRegistrar);
  // console.log("Finished setup reverse registrar");
  // await baseRegistrar.setBaseURI("https://api.edns.domains/metadata");

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

async function setupResolver(registry: EDNSRegistry, resolver: PublicResolver) {
  const resolverNode = namehash("resolver");
  const resolverLabel = labelhash("resolver");
  const tx1 = await registry.setSubnodeOwner(
    ZERO_HASH,
    resolverLabel,
    await signer.getAddress()
  );
  await tx1.wait();
  console.log("tx1 done");
  const tx2 = await registry.setResolver(resolverNode, resolver.address);
  await tx2.wait();
  console.log("tx2 done");
  // const tx111 = await resolver.setEDNSRegistry(registry.address);
  // await tx111.wait();
  console.log("done");
  console.log(await resolver.isAuthorised(resolverNode));
  const tx3 = await resolver["setAddr(bytes32,uint256,bytes)"](
    resolverNode,
    137,
    resolver.address
  );
  await tx3.wait();
  console.log("tx3 done");
}

async function setupRegistrar(
  registrarController: EDNSRegistrarController,
  registry: EDNSRegistry,
  registrar: BaseRegistrarImplementation
) {
  console.log(await registrar.owner());
  const tx1 = await registrar.addController(registrarController.address);
  await tx1.wait();
  console.log("tx1");
  const tx2 = await registrarController.setNameLengthLimit(5, 128);
  await tx2.wait();
  console.log("tx2");
  for (let tld of tlds) {
    const _tx1 = await registrarController.setTld(
      tld,
      namehash(tld),
      overrides
    );
    await _tx1.wait();
    const _tx2 = await registrar.setBaseNode(namehash(tld), true, overrides);
    await _tx2.wait();
    const _tx3 = await registry.setSubnodeOwner(
      ZERO_HASH,
      labelhash(tld),
      registrar.address,
      overrides
    );
    await _tx3.wait();
    console.log(
      tld,
      " | ",
      await registrarController.callStatic.tldAvailable(tld)
    );
  }
}

async function setupReverseRegistrar(
  registry: ethers.Contract,
  reverseRegistrar: ethers.Contract
) {
  const tx1 = await registry.setSubnodeOwner(
    ZERO_HASH,
    labelhash("reverse"),
    await signer.getAddress(),
    overrides
  );
  await tx1.wait();
  const tx2 = await registry.setSubnodeOwner(
    namehash("reverse"),
    labelhash("addr"),
    reverseRegistrar.address,
    overrides
  );
  await tx2.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
