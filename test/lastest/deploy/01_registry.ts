import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers, upgrades } from "hardhat";
import { Registry, Registry__factory } from "../../../typechain";

export const deployRegistry = async (signer2: SignerWithAddress): Promise<[Registry, Registry]> => {
  const RegistryFactory = await ethers.getContractFactory("Registry");
  const _registry = await upgrades.deployProxy(RegistryFactory, { kind: "uups" });
  await _registry.deployed();
  const use_registry = RegistryFactory.attach(_registry.address);
  const use_registry_ac2 = Registry__factory.connect(_registry.address, signer2);
  // console.log("Deployed Registry");
  return [use_registry, use_registry_ac2];
};
