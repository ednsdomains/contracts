import { BigNumber } from "ethers";
import { AwsKmsSigner } from "ethers-aws-kms-signer";
import hardhat, { ethers, upgrades } from "hardhat";

const labelhash = (label: string) =>
  ethers.utils.keccak256(ethers.utils.toUtf8Bytes(label));

async function main() {
  const provider = new hardhat.ethers.providers.JsonRpcProvider(
    "https://rpc.ankr.com/eth_goerli"
  );

  let signer = new AwsKmsSigner({
    region: "ap-southeast-1",
    keyId: process.env.KMS_SIGNER_KEY_ARN!,
  });
  signer = signer.connect(provider);
  console.log("Signer Address:", await signer.getAddress());
  console.log(
    "Signer Balance:",
    hardhat.ethers.utils.formatEther(await signer.getBalance())
  );

  const BASE_REGISTRAR_IMPLEMENTATION_ADDRESS =
    "0xafFDDAd389bEe8a2AcBa0367dFAE5609B93c7F9b";
  const EDNS_REGISTRAR_CONTROLLER_ADDRESS =
    "0xb977101Fba674a61c2a999CA36438FCB28E69e3b";
  const BaseRegistrarImplementationFactory =
    await hardhat.ethers.getContractFactory(
      "BaseRegistrarImplementation",
      signer
    );
  const EDNSRegistrarControllerFactory =
    await hardhat.ethers.getContractFactory("EDNSRegistrarController", signer);

  const controller = EDNSRegistrarControllerFactory.attach(
    EDNS_REGISTRAR_CONTROLLER_ADDRESS
  );
  const registrar = BaseRegistrarImplementationFactory.attach(
    BASE_REGISTRAR_IMPLEMENTATION_ADDRESS
  );

  const _durations = 10000;
  //   const _baseNode = ethers.utils.namehash(labelhash("test1"));
  //   const _tokenId = await controller.getTokenId("what-am-i", "test1");

  //   const tx1 = await registrar.addController(await signer.getAddress());
  //   await tx1.wait();

  //   const tx2 = await registrar.renew(_tokenId, _baseNode, _durations);
  //   await tx2.wait();
  //   console.log("Tx Hash:", tx2.hash);

  const tx = await controller.renew("what-am-i", "test1", _durations);
  await tx.wait();
  console.log("Tx Hash:", tx.hash);

  //   const _registrarController = await upgrades.upgradeProxy(
  //     EDNS_REGISTRAR_CONTROLLER_ADDRESS,
  //     EDNSRegistrarController
  //   );
  //   await _registrarController.deployed();
  //   console.log("EDNS Registry Controller upgraded");
}

main();
