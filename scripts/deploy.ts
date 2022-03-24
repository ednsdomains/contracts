// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hardhat from "hardhat";
import { keccak_256 as sha3 } from "js-sha3";
import uts46 from "idna-uts46-hx";
import { Contract, Overrides } from 'ethers';
import { AwsKmsSigner } from "ethers-aws-kms-signer";
import { BaseRegistrarImplementation, EDNSRegistrarController, EDNSRegistry, ReverseRegistrar } from "../typechain";
import { PublicResolver } from '../typechain/PublicResolver';
import { ethers, upgrades } from "hardhat";

const provider = new hardhat.ethers.providers.InfuraProvider("goerli", "6ac23cd1c67249949ee6666e42d03278");
// const FEE_DATA = {
//   maxFeePerGas: ethers.utils.parseUnits('1000', 'gwei'),
//   maxPriorityFeePerGas: ethers.utils.parseUnits('1000', 'gwei'),
//   gasPrice: null
// };
// provider.getFeeData = async () => FEE_DATA;
// const provider = new hardhat.ethers.providers.AlchemyProvider("goerli", "ceHz8rgUY-goU0sXPNGVFbS6ML9CZh2W");
let signer = new AwsKmsSigner({
  region: "ap-southeast-1",
  keyId: "arn:aws:kms:ap-southeast-1:608671652196:key/5af5ba9d-7fed-44fd-b621-12e18ce7685d"
});
signer = signer.connect(provider);

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
};

// const tlds: string[] = [
//   "404",
//   "meta",
//   "music",
//   "ass",
//   "shit"
// ];
const tlds: string[] = ["edns"];
const labelhash = (label: string) => hardhat.ethers.utils.keccak256(hardhat.ethers.utils.toUtf8Bytes(label));
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const ZERO_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000";
async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  const EDNSRegistry = await hardhat.ethers.getContractFactory("EDNSRegistry", signer);
  const ReverseRegistrar = await hardhat.ethers.getContractFactory("ReverseRegistrar", signer);
  const PublicResolver = await hardhat.ethers.getContractFactory("PublicResolver", signer);
  const BaseRegistrarImplementation = await hardhat.ethers.getContractFactory("BaseRegistrarImplementation", signer);
  const EDNSRegistrarController = await hardhat.ethers.getContractFactory("EDNSRegistrarController", signer);

  // const _provider = new ethers.providers.EtherscanProvider("maticmum");
  // const history = await _provider.getHistory(await signer.getAddress());
  // console.log(JSON.stringify(history, null, 2));

  // const registry = EDNSRegistry.attach("0xCDEbE246529e6c5f549b08dC8DC9a720A34C3149");
  // const resolver = PublicResolver.attach("0x5716EBAe036AE2c3652902dd89EeD1c73c74384D");
  // const baseRegistrar = BaseRegistrarImplementation.attach("0xb3BF41C4B2A53D34296F7F237C4CcE145631d96D");
  // const registrarController = EDNSRegistrarController.attach("0xe2203A16e6E5a0a3CdC0A55070345D21d06cEB97");
  // const reverseRegistrar = ReverseRegistrar.attach("0xBF962734Abb798807a2875595cefE86FDF6726cc");

  // const registry = await EDNSRegistry.deploy();
  // await registry.deployed();
  // console.log(`Registry deployed [${registry.address}]`);

  // const $registry = await upgrades.deployBeacon(EDNSRegistry);
  // await $registry.deployed();
  // console.log(`Registray Beacon deployed [${$registry.address}]`);

  // const registry = await upgrades.deployBeaconProxy($registry, EDNSRegistry, []);
  // await registry.deployed();
  // console.log(`Registry deployed [${registry.address}]`);

  const registry = await upgrades.deployProxy(EDNSRegistry, [], { timeout: 180000 });
  await registry.deployed();
  console.log(`Registry deployed [${registry.address}]`);

  const resolver = await upgrades.deployProxy(PublicResolver, [registry.address, ZERO_ADDRESS]);
  await resolver.deployed();
  console.log(`Resolver deployed [${resolver.address}]`);

  const baseRegistrar = await upgrades.deployProxy(BaseRegistrarImplementation, [registry.address]);
  await baseRegistrar.deployed();
  console.log(`Base Registrar deployed [${baseRegistrar.address}]`);

  const registrarController = await upgrades.deployProxy(EDNSRegistrarController, [baseRegistrar.address]);
  await registrarController.deployed();
  console.log(`Register Controller deployed [${registrarController.address}]`);

  const reverseRegistrar = await upgrades.deployProxy(ReverseRegistrar, [registry.address, resolver.address]);
  await reverseRegistrar.deployed();
  console.log(`Reverse registrar deployed [${reverseRegistrar.address}]`);

  await setupRegistrar(registrarController, registry, baseRegistrar);
  console.log("Finished setup registrar");
  await setupResolver(registry, resolver);
  console.log("Finish setup resolver");
  await setupReverseRegistrar(registry, reverseRegistrar);
  console.log("Finished setup reverse registrar");
}

const overrides: Overrides = {
  gasLimit: 20000000
}

async function setupResolver(registry: Contract, resolver: Contract) {
  const resolverNode = namehash("resolver");
  const resolverLabel = labelhash("resolver");
  await registry.setSubnodeOwner(ZERO_HASH, resolverLabel, await signer.getAddress(), overrides);
  await registry.setResolver(resolverNode, resolver.address, overrides);
  await resolver['setAddr(bytes32,address)'](resolverNode, resolver.address, overrides);
}

async function setupRegistrar(registrarController: Contract, registry: Contract, registrar: Contract) {
  for (let tld of tlds) {
    await registrarController.setTld(tld, namehash(tld), overrides);
    await registrar.setBaseNode(namehash(tld), true, overrides);
    await registry.setSubnodeOwner(ZERO_HASH, labelhash(tld), registrar.address, overrides);
  }
}

async function setupReverseRegistrar(registry: Contract, reverseRegistrar: Contract) {
  await registry.setSubnodeOwner(ZERO_HASH, labelhash("reverse"), await signer.getAddress(), overrides);
  await registry.setSubnodeOwner(namehash("reverse"), labelhash("addr"), reverseRegistrar.address, overrides);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
