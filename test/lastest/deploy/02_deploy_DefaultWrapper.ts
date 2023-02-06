import { SignerWithAddress } from "../../../scripts/node_modules/@nomiclabs/hardhat-ethers/signers";
import { ethers, upgrades } from "hardhat";
import { Registry__factory } from "../../../typechain";

export const deployDefaultWrapper = async (input: { registryAddress: string; nftName: string; nftSymbol: string }): Promise<any> => {
  const DefaultWrapperFactory = await ethers.getContractFactory("Wrapper");
  const _wrapper = await upgrades.deployProxy(DefaultWrapperFactory, [input.registryAddress, input.nftName, input.nftSymbol], { kind: "uups" });
  await _wrapper.deployed();
  // console.log("Deployed DefaultWrapper");
  return DefaultWrapperFactory;
};
