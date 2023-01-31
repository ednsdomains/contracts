import { ethers, upgrades } from "hardhat";

export const deployRoot = async (input: { registryAddress: string; registrarAddress: string }): Promise<any> => {
  const Root = await ethers.getContractFactory("Root");
  const root = await upgrades.deployProxy(Root, [input.registryAddress, input.registrarAddress], { kind: "uups" });
  await root.deployed();
  return root;
};
