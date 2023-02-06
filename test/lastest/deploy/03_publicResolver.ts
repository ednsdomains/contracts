import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "../../../scripts/node_modules/@nomiclabs/hardhat-ethers/signers";
import { PublicResolver__factory, Registry__factory } from "../../../typechain";

export const deployPublicResolver = async (signer2: SignerWithAddress, input: { registryAddress: string }): Promise<any> => {
  const PublicResolver = await ethers.getContractFactory("PublicResolver");
  const publicResolver = await upgrades.deployProxy(PublicResolver, [input.registryAddress], { kind: "uups", unsafeAllow: ["delegatecall"] });
  await publicResolver.deployed();

  const publicResolver_ac2 = await PublicResolver__factory.connect(publicResolver.address, signer2);

  return [publicResolver, publicResolver_ac2];
};
