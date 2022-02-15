// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre from "hardhat";
import { keccak_256 as sha3 } from "js-sha3";
import uts46 from "idna-uts46-hx";
import { Contract, ethers } from 'ethers';
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

function namehash(inputName: string) {
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
const tld = "edns";
const labelhash = (label: string) => ethers.utils.keccak256(ethers.utils.toUtf8Bytes(label));
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const ZERO_HASH =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const EDNSRegistry = await hre.ethers.getContractFactory("EDNSRegistry");
  const ReverseRegistrar = await hre.ethers.getContractFactory("ReverseRegistrar");
  const PublicResolver = await hre.ethers.getContractFactory("PublicResolver");
  const BaseRegistrarImplementation = await hre.ethers.getContractFactory(
    "BaseRegistrarImplementation"
  );
  const EDNSRegistrarController = await hre.ethers.getContractFactory(
    "EDNSRegistrarController"
  );

  const signers = await hre.ethers.getSigners();

  const registry = await EDNSRegistry.deploy();
  await registry.deployed();
  console.log(`Registry deployed [${registry.address}]`);
  const resolver = await PublicResolver.deploy(registry.address, ZERO_ADDRESS);
  await resolver.deployed();
  console.log(`Resolver deployed [${resolver.address}]`);
  const baseRegistrar = await BaseRegistrarImplementation.deploy(registry.address, namehash(tld));
  await baseRegistrar.deployed();
  console.log(`Base Registrar deployed [${baseRegistrar.address}]`);
  const registrarController = await EDNSRegistrarController.deploy(
    baseRegistrar.address
  );
  await registrarController.deployed();
  const reverseRegistrar = await ReverseRegistrar.deploy(registry.address, resolver.address);
  await reverseRegistrar.deployed();

  await setupRegistrar(registry, baseRegistrar);
  await setupResolver(registry, resolver, signers[0]);
  console.log("Finish setup resolver");
  await setupReverseRegistrar(registry, reverseRegistrar, signers[0]);

}

async function setupResolver(registry: Contract, resolver: Contract, account: SignerWithAddress) {
  const resolverNode = namehash("resolver");
  const resolverLabel = labelhash("resolver");
  await registry.setSubnodeOwner(ZERO_HASH, resolverLabel, account.address);
  await registry.setResolver(resolverNode, resolver.address);
  await resolver['setAddr(bytes32,address)'](resolverNode, resolver.address);
}

async function setupRegistrar(registry: Contract, registrar: Contract) {
  // for (let tld of tlds) {
  await registry.setSubnodeOwner(ZERO_HASH, labelhash(tld), registrar.address);
  // }
}

async function setupReverseRegistrar(registry: Contract, reverseRegistrar: Contract, account: SignerWithAddress) {
  await registry.setSubnodeOwner(ZERO_HASH, labelhash("reverse"), account.address);
  await registry.setSubnodeOwner(namehash("reverse"), labelhash("addr"), reverseRegistrar.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
