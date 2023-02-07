import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import delay from "delay";
import { ethers, upgrades } from "hardhat";
import { ContractName } from "./constants/contract-name";
import { IContracts } from "./interfaces/contracts";
import { getBalance } from "./lib/get-balance";
import NetworkConfig from "../../network.config";
import { verifyContract } from "./lib/verify-contract";
import { Contract } from "ethers";

export interface IUpgradeInput {
  chainId: number;
  signer: SignerWithAddress;
  contracts: IContracts;
}

export async function upgradeRegistry(input: IUpgradeInput): Promise<void> {
  if (!input.contracts.Registry) throw new Error("`Registry` is not available");
  const factory = await ethers.getContractFactory("Registry", input.signer);
  await _beforeUpgrade(input.signer, input.chainId, "Registry");
  await upgrades.upgradeProxy(input.contracts.Registry, factory);
  await _afterUpgrade(input.signer, input.chainId, "Registry", input.contracts.Registry);
}

export async function upgradeWrapper(input: IUpgradeInput): Promise<void> {
  if (!input.contracts.DefaultWrapper) throw new Error("`DefaultWrapper` is not available");
  const factory = await ethers.getContractFactory("Wrapper", input.signer);
  await _beforeUpgrade(input.signer, input.chainId, "DefaultWrapper");
  await upgrades.upgradeProxy(input.contracts.DefaultWrapper, factory);
  await _afterUpgrade(input.signer, input.chainId, "DefaultWrapper", input.contracts.DefaultWrapper);
}

export async function upgradePublicResolver(input: IUpgradeInput): Promise<void> {
  if (!input.contracts.PublicResolver) throw new Error("`PublicResolver` is not available");
  const factory = await ethers.getContractFactory("PublicResolver", input.signer);
  await _beforeUpgrade(input.signer, input.chainId, "PublicResolver");
  await upgrades.upgradeProxy(input.contracts.PublicResolver, factory);
  await _afterUpgrade(input.signer, input.chainId, "PublicResolver", input.contracts.PublicResolver);
}

export async function upgradeRegistrar(input: IUpgradeInput): Promise<void> {
  if (!input.contracts.Registrar) throw new Error("`Registrar` is not available");
  const factory = await ethers.getContractFactory("Registrar", input.signer);
  await _beforeUpgrade(input.signer, input.chainId, "Registrar");
  await upgrades.upgradeProxy(input.contracts.Registrar, factory);
  await _afterUpgrade(input.signer, input.chainId, "Registrar", input.contracts.Registrar);
}

export async function upgradeRoot(input: IUpgradeInput): Promise<void> {
  if (!input.contracts.Root) throw new Error("`Root` is not available");
  const factory = await ethers.getContractFactory("Root", input.signer);
  await _beforeUpgrade(input.signer, input.chainId, "Root");
  await upgrades.upgradeProxy(input.contracts.Root, factory);
  await _afterUpgrade(input.signer, input.chainId, "Root", input.contracts.Root);
}

export async function upgradeClassicalRegistrarController(input: IUpgradeInput): Promise<void> {
  if (!input.contracts.ClassicalRegistrarController) throw new Error("`ClassicalRegistrarController` is not available");
  const factory = await ethers.getContractFactory("ClassicalRegistrarController", input.signer);
  await _beforeUpgrade(input.signer, input.chainId, "ClassicalRegistrarController");
  await upgrades.upgradeProxy(input.contracts.ClassicalRegistrarController, factory);
  await _afterUpgrade(input.signer, input.chainId, "ClassicalRegistrarController", input.contracts.ClassicalRegistrarController);
}

export async function upgradeUniversalRegistrarController(input: IUpgradeInput): Promise<void> {
  if (!input.contracts.UniversalRegistrarController) throw new Error("`UniversalRegistrarController` is not available");
  const factory = await ethers.getContractFactory("UniversalRegistrarController", input.signer);
  await _beforeUpgrade(input.signer, input.chainId, "UniversalRegistrarController");
  await upgrades.upgradeProxy(input.contracts.UniversalRegistrarController, factory);
  await _afterUpgrade(input.signer, input.chainId, "UniversalRegistrarController", input.contracts.UniversalRegistrarController);
}

export async function upgradeBridge(input: IUpgradeInput): Promise<void> {
  if (!input.contracts.Bridge) throw new Error("`Bridge` is not available");
  const factory = await ethers.getContractFactory("Bridge", input.signer);
  await _beforeUpgrade(input.signer, input.chainId, "Bridge");
  await upgrades.upgradeProxy(input.contracts.Bridge, factory);
  await _afterUpgrade(input.signer, input.chainId, "Bridge", input.contracts.Bridge);
}

export async function upgradePortal(input: IUpgradeInput): Promise<void> {
  if (!input.contracts.Portal) throw new Error("`Portal` is not available");
  const factory = await ethers.getContractFactory("Portal", input.signer);
  await _beforeUpgrade(input.signer, input.chainId, "Portal");
  await upgrades.upgradeProxy(input.contracts.Portal, factory);
  await _afterUpgrade(input.signer, input.chainId, "Portal", input.contracts.Portal);
}

export async function upgradeLayerZeroProvider(input: IUpgradeInput): Promise<void> {
  if (!input.contracts.LayerZeroProvider) throw new Error("`LayerZeroProvider` is not available");
  const factory = await ethers.getContractFactory("LayerZeroProvider", input.signer);
  await _beforeUpgrade(input.signer, input.chainId, "LayerZeroProvider");
  await upgrades.upgradeProxy(input.contracts.LayerZeroProvider, factory);
  await _afterUpgrade(input.signer, input.chainId, "LayerZeroProvider", input.contracts.LayerZeroProvider);
}

const _beforeUpgrade = async (signer: SignerWithAddress, chainId: number, name: ContractName) => {
  const balance = await getBalance(signer);
  if (balance.eq(0)) {
    throw new Error(`Signer account ${signer.address} has [0] balance`);
  } else {
    console.log(`Signer account has ${ethers.utils.formatEther(balance)} ${NetworkConfig[chainId].symbol}`);
  }
  console.log(`Upgrade procedure initiated, contract [${name}] will be upgrade on [${NetworkConfig[chainId].name}] in 5 seconds...`);
  await delay(5000);
};

const _afterUpgrade = async (signer: SignerWithAddress, chainId: number, name: ContractName, contract: Contract) => {
  console.log(`Contract [${name}] has been upgrade on [${NetworkConfig[chainId].name}]`);
  const balance = await getBalance(signer);
  console.log(`Signer account remaining balance ${ethers.utils.formatEther(balance)} ${NetworkConfig[chainId].symbol}`);
  // await verifyContract(contract.address);
};
