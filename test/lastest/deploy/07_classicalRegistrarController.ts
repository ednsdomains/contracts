import { ethers, upgrades } from "hardhat";

export const deployClassicalRegistrarController = async (input: { tokenAddress: string; coinId?: string; registrarAddress: string; rootAddress: string }): Promise<any> => {
  const ClassicalRegistrarController = await ethers.getContractFactory("ClassicalRegistrarController");

  const classicalRegistrarController = await upgrades.deployProxy(ClassicalRegistrarController, [input.tokenAddress, input.registrarAddress, input.rootAddress, input.coinId || 0]);

  await classicalRegistrarController.deployed();
  return classicalRegistrarController;
};
