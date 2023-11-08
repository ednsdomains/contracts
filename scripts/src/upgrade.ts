import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import delay from "delay";
import { ethers, upgrades } from "hardhat";
import { ContractName } from "./constants/contract-name";
import { IContracts } from "./interfaces/contracts";
import { getBalance } from "./lib/get-balance";
import NetworkConfig from "../../network.config";
import { Contract, Wallet } from "ethers";
import { getAllContractsData, getContracts } from "./lib/get-contracts";
import { setAllContractsData } from "./lib/set-contracts";

export interface IUpgradeInput {
  chainId: number;
  signer: SignerWithAddress | Wallet;
  contracts: IContracts;
}

const _upgradeRegistryInit = async (input: IUpgradeInput): Promise<void> => {
  input.contracts = await getContracts(input.signer);
  try {
    await _beforeUpgrade(input.signer, await input.signer.getChainId(), "Registry.Init");
    const factory = await ethers.getContractFactory("RegistryInit", input.signer);
    const _contract = await factory.deploy();
    await _contract.deployed();
    await _afterUpgrade(input.signer, input.chainId, "Registry.Init", _contract, true);
  } catch (err) {
    console.error(err);
  }
};

const _upgradeRegistryDiamondCutFacet = async (input: IUpgradeInput): Promise<void> => {
  input.contracts = await getContracts(input.signer);
  try {
    await _beforeUpgrade(input.signer, await input.signer.getChainId(), "Registry.DiamondCutFacet");
    const factory = await ethers.getContractFactory("DiamondCutFacet", input.signer);
    const _contract = await factory.deploy();
    await _contract.deployed();
    await _afterUpgrade(input.signer, input.chainId, "Registry.DiamondCutFacet", _contract, true);
  } catch (err) {
    console.error(err);
  }
};

const _upgradeRegistryDiamondLoupeFacet = async (input: IUpgradeInput): Promise<void> => {
  input.contracts = await getContracts(input.signer);
  try {
    await _beforeUpgrade(input.signer, await input.signer.getChainId(), "Registry.DiamondLoupeFacet");
    const factory = await ethers.getContractFactory("DiamondLoupeFacet", input.signer);
    const _contract = await factory.deploy();
    await _contract.deployed();
    await _afterUpgrade(input.signer, input.chainId, "Registry.DiamondLoupeFacet", _contract, true);
  } catch (err) {
    console.error(err);
  }
};

const _upgradeRegistryAccessControlFacet = async (input: IUpgradeInput): Promise<void> => {
  input.contracts = await getContracts(input.signer);
  try {
    await _beforeUpgrade(input.signer, await input.signer.getChainId(), "Registry.AccessControlFacet");
    const factory = await ethers.getContractFactory("AccessControlFacet", input.signer);
    const _contract = await factory.deploy();
    await _contract.deployed();
    await _afterUpgrade(input.signer, input.chainId, "Registry.AccessControlFacet", _contract, true);
  } catch (err) {
    console.error(err);
  }
};

const _upgradeRegistryTldRecordFacet = async (input: IUpgradeInput): Promise<void> => {
  input.contracts = await getContracts(input.signer);
  try {
    await _beforeUpgrade(input.signer, await input.signer.getChainId(), "Registry.TldRecordFacet");
    const factory = await ethers.getContractFactory("TldRecordFacet", input.signer);
    const _contract = await factory.deploy();
    await _contract.deployed();
    await _afterUpgrade(input.signer, input.chainId, "Registry.TldRecordFacet", _contract, true);
  } catch (err) {
    console.error(err);
  }
};

const _upgradeRegistryDomainRecordFacet = async (input: IUpgradeInput): Promise<void> => {
  input.contracts = await getContracts(input.signer);
  try {
    await _beforeUpgrade(input.signer, await input.signer.getChainId(), "Registry.DomainRecordFacet");
    const factory = await ethers.getContractFactory("DomainRecordFacet", input.signer);
    const _contract = await factory.deploy();
    await _contract.deployed();
    await _afterUpgrade(input.signer, input.chainId, "Registry.DomainRecordFacet", _contract, true);
  } catch (err) {
    console.error(err);
  }
};

const _upgradeRegistryHostRecordFacet = async (input: IUpgradeInput): Promise<void> => {
  input.contracts = await getContracts(input.signer);
  try {
    await _beforeUpgrade(input.signer, await input.signer.getChainId(), "Registry.HostRecordFacet");
    const factory = await ethers.getContractFactory("HostRecordFacet", input.signer);
    const _contract = await factory.deploy();
    await _contract.deployed();
    await _afterUpgrade(input.signer, input.chainId, "Registry.HostRecordFacet", _contract, true);
  } catch (err) {
    console.error(err);
  }
};

const _upgradeRegistryBaseRegistryFacet = async (input: IUpgradeInput): Promise<void> => {
  input.contracts = await getContracts(input.signer);
  try {
    await _beforeUpgrade(input.signer, await input.signer.getChainId(), "Registry.BaseRegistryFacet");
    const factory = await ethers.getContractFactory("BaseRegistryFacet", input.signer);
    const _contract = await factory.deploy();
    await _contract.deployed();
    await _afterUpgrade(input.signer, input.chainId, "Registry.BaseRegistryFacet", _contract, true);
  } catch (err) {
    console.error(err);
  }
};

export async function upgradeRegistry(input: IUpgradeInput): Promise<void> {
  // await _upgradeRegistryInit(input);
  // await _upgradeRegistryDiamondCutFacet(input);
  // await _upgradeRegistryDiamondLoupeFacet(input);
  // await _upgradeRegistryAccessControlFacet(input);
  await _upgradeRegistryTldRecordFacet(input);
  await _upgradeRegistryDomainRecordFacet(input);
  await _upgradeRegistryHostRecordFacet(input);
  await _upgradeRegistryBaseRegistryFacet(input);
}

export async function upgradeWrapper(input: IUpgradeInput): Promise<void> {
  if (!input.contracts.DefaultWrapper) throw new Error("`DefaultWrapper` is not available");
  const factory = await ethers.getContractFactory("Wrapper", input.signer);
  await _beforeUpgrade(input.signer, input.chainId, "DefaultWrapper");
  // await upgrades.forceImport(input.contracts.DefaultWrapper.address, factory);
  await upgrades.upgradeProxy(input.contracts.DefaultWrapper, factory);
  await _afterUpgrade(input.signer, input.chainId, "DefaultWrapper", input.contracts.DefaultWrapper);
}

export async function upgradePublicResolver(input: IUpgradeInput): Promise<void> {
  if (!input.contracts.PublicResolver) throw new Error("`PublicResolver` is not available");
  const factory = await ethers.getContractFactory("PublicResolver", input.signer);
  await _beforeUpgrade(input.signer, input.chainId, "PublicResolver");
  // await upgrades.forceImport(input.contracts.PublicResolver.address, factory);
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

export async function upgradeOmniRegistrarController(input: IUpgradeInput): Promise<void> {
  if (!input.contracts.OmniRegistrarController) throw new Error("`OmniRegistrarController` is not available");
  const factory = await ethers.getContractFactory("OmniRegistrarController", input.signer);
  await _beforeUpgrade(input.signer, input.chainId, "OmniRegistrarController");
  await upgrades.upgradeProxy(input.contracts.OmniRegistrarController, factory);
  await _afterUpgrade(input.signer, input.chainId, "OmniRegistrarController", input.contracts.OmniRegistrarController);
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

export async function upgradeSynchronizer(input: IUpgradeInput): Promise<void> {
  if (!input.contracts.Synchronizer) throw new Error("`Synchronizer` is not available");
  const factory = await ethers.getContractFactory("Synchronizer", input.signer);
  await _beforeUpgrade(input.signer, input.chainId, "Synchronizer");
  await upgrades.upgradeProxy(input.contracts.Synchronizer, factory);
  await _afterUpgrade(input.signer, input.chainId, "Synchronizer", input.contracts.Synchronizer);
}

export async function upgradeLayerZeroProvider(input: IUpgradeInput): Promise<void> {
  if (!input.contracts.LayerZeroProvider) throw new Error("`LayerZeroProvider` is not available");
  const factory = await ethers.getContractFactory("LayerZeroProvider", input.signer);
  await _beforeUpgrade(input.signer, input.chainId, "LayerZeroProvider");
  await upgrades.upgradeProxy(input.contracts.LayerZeroProvider, factory);
  await _afterUpgrade(input.signer, input.chainId, "LayerZeroProvider", input.contracts.LayerZeroProvider);
}

export async function upgradeMigrationManager(input: IUpgradeInput): Promise<void> {
  if (!input.contracts.MigrationManager) throw new Error("`MigrationManager` is not available");
  const factory = await ethers.getContractFactory("MigrationManager", input.signer);
  await _beforeUpgrade(input.signer, input.chainId, "MigrationManager");
  await upgrades.upgradeProxy(input.contracts.MigrationManager, factory);
  await _afterUpgrade(input.signer, input.chainId, "MigrationManager", input.contracts.MigrationManager);
}

const _beforeUpgrade = async (signer: SignerWithAddress | Wallet, chainId: number, name: ContractName) => {
  console.log("\n⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️");
  const balance = await getBalance(signer);
  if (balance.eq(0)) {
    throw new Error(`Signer account ${signer.address} has [0] balance`);
  } else {
    console.log(`Signer account has ${ethers.utils.formatEther(balance)} ${NetworkConfig[chainId].symbol}`);
  }
  console.log(`Upgrade procedure initiated, contract [${name}] will be upgrade on [${NetworkConfig[chainId].name}] in 3 seconds...`);
  console.log("⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️\n");
  await delay(3000);
};

const _afterUpgrade = async (signer: SignerWithAddress | Wallet, chainId: number, name: ContractName, contract: Contract, update?: boolean) => {
  console.log(`✅ Contract [${name}] has been upgrade on [${NetworkConfig[chainId].name}]`);
  const balance = await getBalance(signer);
  console.log(`Signer account remaining balance ${ethers.utils.formatEther(balance)} ${NetworkConfig[chainId].symbol}`);
  if (update) {
    const ALL_CONTRACTS_DATA = await getAllContractsData();
    const index = ALL_CONTRACTS_DATA.findIndex((c) => c.chainId === chainId);
    if (index !== -1) {
      ALL_CONTRACTS_DATA[index].addresses[name] = contract.address;
      if (chainId !== 0) await setAllContractsData(ALL_CONTRACTS_DATA);
    }
  }
};
