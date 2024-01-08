import hre from "hardhat";
import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import NetworkConfig, { Mainnets, Network, Testnets, ZERO_ADDRESS } from "../../network.config";
import {
  PublicResolver,
  Registry,
  Root,
  ClassicalRegistrarController,
  Registrar,
  Wrapper,
  TokenMock,
  Portal,
  UniversalRegistrarController,
  Synchronizer,
  OmniRegistrarController,
  RegistryInit,
  MigrationManager,
  Mortgage,
} from "../../typechain";
import { ContractName } from "./constants/contract-name";
import { Contract, Transaction, Wallet } from "ethers";
import { getAllContractsData, getContractAddress, getContracts, isContractDeployed } from "./lib/get-contracts";
import { getBalance } from "./lib/get-balance";
import _ from "lodash";
import { setAllContractsData } from "./lib/set-contracts";
import delay from "delay";
import { LayerZeroProvider } from "../../typechain/LayerZeroProvider";
import { Bridge } from "../../typechain/Bridge";
import { IContracts } from "./interfaces/contracts";
import { InContractChain } from "./constants/in-contract-chain";

export interface IDeployInput {
  chainId: number;
  signer: SignerWithAddress;
  contracts: IContracts;
}

const _deployRegistry = async (input: IDeployInput): Promise<Registry | undefined> => {
  input.contracts = await getContracts(input.signer);
  if (!input.contracts.Registry?.facets?.DiamondCutFacet) throw new Error("`Registry.DiamondCutFacet` is not available");
  try {
    const factory = await ethers.getContractFactory("Registry", input.signer);
    const { canContinue, contractAddress } = await _beforeDeploy(input.signer, await input.signer.getChainId(), "Registry.Diamond");
    if (!canContinue) {
      if (!contractAddress) throw new Error("???");
      return factory.attach(contractAddress);
    }
    const _contract = await factory.deploy(input.signer.address, input.contracts.Registry.facets.DiamondCutFacet.address);
    await _contract.deployed();
    await _afterDeploy(input.signer, input.chainId, "Registry.Diamond", _contract, _contract.deployTransaction);
    return _contract;
  } catch (err) {
    console.error(err);
  }
};

export const _deployRegistryInit = async (input: IDeployInput): Promise<RegistryInit | undefined> => {
  input.contracts = await getContracts(input.signer);
  try {
    const factory = await ethers.getContractFactory("RegistryInit", input.signer);
    const { canContinue, contractAddress } = await _beforeDeploy(input.signer, await input.signer.getChainId(), "Registry.Init");
    if (!canContinue) {
      if (!contractAddress) throw new Error("???");
      return factory.attach(contractAddress);
    }
    const _contract = await factory.deploy();
    await _contract.deployed();
    await _afterDeploy(input.signer, input.chainId, "Registry.Init", _contract, _contract.deployTransaction);
    return _contract;
  } catch (err) {
    console.error(err);
  }
};

export const _deployRegistryDiamondCutFacet = async (input: IDeployInput): Promise<void> => {
  input.contracts = await getContracts(input.signer);
  try {
    const factory = await ethers.getContractFactory("DiamondCutFacet", input.signer);
    const { canContinue } = await _beforeDeploy(input.signer, await input.signer.getChainId(), "Registry.DiamondCutFacet");
    if (!canContinue) return;
    const _contract = await factory.deploy();
    await _contract.deployed();
    await _afterDeploy(input.signer, input.chainId, "Registry.DiamondCutFacet", _contract, _contract.deployTransaction);
  } catch (err) {
    console.error(err);
  }
};

export const _deployRegistryDiamondLoupeFacet = async (input: IDeployInput): Promise<void> => {
  input.contracts = await getContracts(input.signer);
  try {
    const factory = await ethers.getContractFactory("DiamondLoupeFacet", input.signer);
    const { canContinue } = await _beforeDeploy(input.signer, await input.signer.getChainId(), "Registry.DiamondLoupeFacet");
    if (!canContinue) return;
    const _contract = await factory.deploy();
    await _contract.deployed();
    await _afterDeploy(input.signer, input.chainId, "Registry.DiamondLoupeFacet", _contract, _contract.deployTransaction);
  } catch (err) {
    console.error(err);
  }
};

export const _deployRegistryAccessControlFacet = async (input: IDeployInput): Promise<void> => {
  input.contracts = await getContracts(input.signer);
  try {
    const factory = await ethers.getContractFactory("AccessControlFacet", input.signer);
    const { canContinue } = await _beforeDeploy(input.signer, await input.signer.getChainId(), "Registry.AccessControlFacet");
    if (!canContinue) return;
    const _contract = await factory.deploy();
    await _contract.deployed();
    await _afterDeploy(input.signer, input.chainId, "Registry.AccessControlFacet", _contract, _contract.deployTransaction);
  } catch (err) {
    console.error(err);
  }
};

export const _deployRegistryTldRecordFacet = async (input: IDeployInput): Promise<void> => {
  input.contracts = await getContracts(input.signer);
  try {
    const factory = await ethers.getContractFactory("TldRecordFacet", input.signer);
    const { canContinue } = await _beforeDeploy(input.signer, await input.signer.getChainId(), "Registry.TldRecordFacet");
    if (!canContinue) return;
    const _contract = await factory.deploy();
    await _contract.deployed();
    await _afterDeploy(input.signer, input.chainId, "Registry.TldRecordFacet", _contract, _contract.deployTransaction);
  } catch (err) {
    console.error(err);
  }
};

export const _deployRegistryDomainRecordFacet = async (input: IDeployInput): Promise<void> => {
  input.contracts = await getContracts(input.signer);
  try {
    const factory = await ethers.getContractFactory("DomainRecordFacet", input.signer);
    const { canContinue } = await _beforeDeploy(input.signer, await input.signer.getChainId(), "Registry.DomainRecordFacet");
    if (!canContinue) return;
    const _contract = await factory.deploy();
    await _contract.deployed();
    await _afterDeploy(input.signer, input.chainId, "Registry.DomainRecordFacet", _contract, _contract.deployTransaction);
  } catch (err) {
    console.error(err);
  }
};

export const _deployRegistryHostRecordFacet = async (input: IDeployInput): Promise<void> => {
  input.contracts = await getContracts(input.signer);
  try {
    const factory = await ethers.getContractFactory("HostRecordFacet", input.signer);
    const { canContinue } = await _beforeDeploy(input.signer, await input.signer.getChainId(), "Registry.HostRecordFacet");
    if (!canContinue) return;
    const _contract = await factory.deploy();
    await _contract.deployed();
    await _afterDeploy(input.signer, input.chainId, "Registry.HostRecordFacet", _contract, _contract.deployTransaction);
  } catch (err) {
    console.error(err);
  }
};

export const _deployRegistryBaseRegistryFacet = async (input: IDeployInput): Promise<void> => {
  input.contracts = await getContracts(input.signer);
  try {
    const factory = await ethers.getContractFactory("BaseRegistryFacet", input.signer);
    const { canContinue } = await _beforeDeploy(input.signer, await input.signer.getChainId(), "Registry.BaseRegistryFacet");
    if (!canContinue) return;
    const _contract = await factory.deploy();
    await _contract.deployed();
    await _afterDeploy(input.signer, input.chainId, "Registry.BaseRegistryFacet", _contract, _contract.deployTransaction);
  } catch (err) {
    console.error(err);
  }
};

export const deployRegistry = async (input: IDeployInput): Promise<void> => {
  await _deployRegistryInit(input);
  await _deployRegistryDiamondCutFacet(input);
  await _deployRegistryDiamondLoupeFacet(input);
  await _deployRegistryAccessControlFacet(input);
  await _deployRegistryTldRecordFacet(input);
  await _deployRegistryDomainRecordFacet(input);
  await _deployRegistryHostRecordFacet(input);
  await _deployRegistryBaseRegistryFacet(input);
  await _deployRegistry(input);
};

export const deployWrapper = async (NFT_NAME: string, NFT_SYMBOL: string, input: IDeployInput): Promise<Wrapper> => {
  if (!input.contracts.Registry?.Diamond) throw new Error("`Registry` is not available");
  const factory = await ethers.getContractFactory("Wrapper", input.signer);
  const { canContinue, contractAddress } = await _beforeDeploy(input.signer, await input.signer.getChainId(), "DefaultWrapper");
  if (!canContinue) {
    if (!contractAddress) throw new Error("???");
    return factory.attach(contractAddress);
  }
  const _contract = await upgrades.deployProxy(factory, [input.contracts.Registry.Diamond.address, NFT_NAME, NFT_SYMBOL], { kind: "uups" });
  await _contract.deployed();
  await _afterDeploy(input.signer, input.chainId, "DefaultWrapper", _contract, _contract.deployTransaction);
  const contract = factory.attach(_contract.address);
  return contract;
};

export const deployPublicResolver = async (input: IDeployInput): Promise<PublicResolver> => {
  if (!input.contracts.Registry?.Diamond) throw new Error("`Registry` is not available");
  const factory = await ethers.getContractFactory("PublicResolver", input.signer);
  const { canContinue, contractAddress } = await _beforeDeploy(input.signer, await input.signer.getChainId(), "PublicResolver");
  if (!canContinue) {
    if (!contractAddress) throw new Error("???");
    return factory.attach(contractAddress);
  }
  const _contract = await upgrades.deployProxy(factory, [input.contracts.Registry.Diamond.address], { kind: "uups", unsafeAllow: ["delegatecall"] });
  await _contract.deployed();
  await _afterDeploy(input.signer, input.chainId, "PublicResolver", _contract, _contract.deployTransaction);
  const contract = factory.attach(_contract.address);
  return contract;
};

export const deployRegistrar = async (input: IDeployInput): Promise<Registrar> => {
  if (!input.contracts.Registry?.Diamond) throw new Error("`Registry` is not available");
  if (!input.contracts.PublicResolver) throw new Error("`PublicResolver` is not available");
  const factory = await ethers.getContractFactory("Registrar", input.signer);
  const { canContinue, contractAddress } = await _beforeDeploy(input.signer, await input.signer.getChainId(), "Registrar");
  if (!canContinue) {
    if (!contractAddress) throw new Error("???");
    return factory.attach(contractAddress);
  }
  const _contract = await upgrades.deployProxy(factory, [input.contracts.Registry.Diamond.address, input.contracts.PublicResolver.address], { kind: "uups" });
  await _contract.deployed();
  await _afterDeploy(input.signer, input.chainId, "Registrar", _contract, _contract.deployTransaction);
  const contract = factory.attach(_contract.address);
  return contract;
};

export const deployRoot = async (input: IDeployInput): Promise<Root> => {
  if (!input.contracts.Registry?.Diamond) throw new Error("`Registry` is not available");
  if (!input.contracts.Registrar) throw new Error("`Registrar` is not available");
  const factory = await ethers.getContractFactory("Root", input.signer);
  const { canContinue, contractAddress } = await _beforeDeploy(input.signer, await input.signer.getChainId(), "Root");
  if (!canContinue) {
    if (!contractAddress) throw new Error("???");
    return factory.attach(contractAddress);
  }
  const _contract = await upgrades.deployProxy(factory, [input.contracts.Registry.Diamond.address, input.contracts.Registrar.address], { kind: "uups" });
  await _contract.deployed();
  await _afterDeploy(input.signer, input.chainId, "Root", _contract, _contract.deployTransaction);
  const contract = factory.attach(_contract.address);
  return contract;
};

export const deployTokenMock = async (input: IDeployInput): Promise<TokenMock> => {
  const factory = await ethers.getContractFactory("TokenMock", input.signer);
  const { canContinue, contractAddress } = await _beforeDeploy(input.signer, await input.signer.getChainId(), "Token");
  if (!canContinue) {
    if (!contractAddress) throw new Error("???");
    return factory.attach(contractAddress);
  }
  const contract = await factory.deploy();
  await _afterDeploy(input.signer, input.chainId, "Token", contract, contract.deployTransaction);
  return contract;
};

export const deployClassicalRegistrarController = async (input: IDeployInput): Promise<ClassicalRegistrarController> => {
  if (Testnets.includes(input.chainId) && !input.contracts.Token) throw new Error("`Token` is not available");
  if (!input.contracts.Registrar) throw new Error("`Registrar` is not available");
  if (!input.contracts.Root) throw new Error("`Root` is not available");
  const factory = await ethers.getContractFactory("ClassicalRegistrarController", input.signer);
  const { canContinue, contractAddress } = await _beforeDeploy(input.signer, await input.signer.getChainId(), "ClassicalRegistrarController");
  if (!canContinue) {
    if (!contractAddress) throw new Error("???");
    return factory.attach(contractAddress);
  }
  const COIN_ID = NetworkConfig[await input.signer.getChainId()]?.slip44?.coinId || 0;
  const _contract = await upgrades.deployProxy(
    factory,
    [Testnets.includes(input.chainId) ? input.contracts.Token!.address : ZERO_ADDRESS, input.contracts.Registrar.address, input.contracts.Root.address, COIN_ID],
    {
      kind: "uups",
    },
  );
  await _contract.deployed();
  await _afterDeploy(input.signer, input.chainId, "ClassicalRegistrarController", _contract, _contract.deployTransaction);
  const contract = factory.attach(_contract.address);
  return contract;
};

export const deployUniversalRegistrarController = async (input: IDeployInput): Promise<UniversalRegistrarController> => {
  if (!input.contracts.Registrar) throw new Error("`Registrar` is not available");
  if (!input.contracts.Root) throw new Error("`Root` is not available");
  if (Testnets.includes(input.chainId) && !input.contracts.Token) throw new Error("`Token` is not available");
  const factory = await ethers.getContractFactory("UniversalRegistrarController", input.signer);
  const { canContinue, contractAddress } = await _beforeDeploy(input.signer, await input.signer.getChainId(), "UniversalRegistrarController");
  if (!canContinue) {
    if (!contractAddress) throw new Error("???");
    return factory.attach(contractAddress);
  }
  const COIN_ID = NetworkConfig[await input.signer.getChainId()]?.slip44?.coinId || 0;
  const _contract = await upgrades.deployProxy(
    factory,
    [Testnets.includes(input.chainId) ? input.contracts.Token!.address : ZERO_ADDRESS, input.contracts.Registrar.address, input.contracts.Root.address, COIN_ID],
    {
      kind: "uups",
    },
  );
  await _contract.deployed();
  await _afterDeploy(input.signer, input.chainId, "UniversalRegistrarController", _contract, _contract.deployTransaction);
  const contract = factory.attach(_contract.address);
  return contract;
};

export const deployOmniRegistrarController = async (input: IDeployInput): Promise<OmniRegistrarController> => {
  if (!input.contracts.Registrar) throw new Error("`Registrar` is not available");
  if (!input.contracts.Root) throw new Error("`Root` is not available");
  if (Testnets.includes(input.chainId) && !input.contracts.Token) throw new Error("`Token` is not available");
  const factory = await ethers.getContractFactory("OmniRegistrarController", input.signer);
  const { canContinue, contractAddress } = await _beforeDeploy(input.signer, await input.signer.getChainId(), "OmniRegistrarController");
  if (!canContinue) {
    if (!contractAddress) throw new Error("???");
    return factory.attach(contractAddress);
  }
  const COIN_ID = NetworkConfig[await input.signer.getChainId()]?.slip44?.coinId || 0;
  const _contract = await upgrades.deployProxy(
    factory,
    [Testnets.includes(input.chainId) ? input.contracts.Token!.address : ZERO_ADDRESS, input.contracts.Registrar.address, input.contracts.Root.address, COIN_ID],
    {
      kind: "uups",
    },
  );
  await _contract.deployed();
  await _afterDeploy(input.signer, input.chainId, "OmniRegistrarController", _contract, _contract.deployTransaction);
  const contract = factory.attach(_contract.address);
  return contract;
};

export const deployPortal = async (input: IDeployInput): Promise<Portal> => {
  const factory = await ethers.getContractFactory("Portal", input.signer);
  const { canContinue, contractAddress } = await _beforeDeploy(input.signer, await input.signer.getChainId(), "Portal");
  if (!canContinue) {
    if (!contractAddress) throw new Error("???");
    return factory.attach(contractAddress);
  }
  const _contract = await upgrades.deployProxy(factory, { kind: "uups" });
  await _contract.deployed();
  await _afterDeploy(input.signer, input.chainId, "Portal", _contract, _contract.deployTransaction);
  const contract = factory.attach(_contract.address);
  return contract;
};

export const deployBridge = async (input: IDeployInput): Promise<Bridge> => {
  if (!input.contracts.Registry?.Diamond) throw new Error("`Registry` is not available");
  if (!input.contracts.Portal) throw new Error("`Portal` is not available");
  const chain = NetworkConfig[input.chainId]?.chain || InContractChain.ETHEREUM;
  const factory = await ethers.getContractFactory("Bridge", input.signer);
  const { canContinue, contractAddress } = await _beforeDeploy(input.signer, await input.signer.getChainId(), "Bridge");
  if (!canContinue) {
    if (!contractAddress) throw new Error("???");
    return factory.attach(contractAddress);
  }
  const _contract = await upgrades.deployProxy(factory, [chain, input.contracts.Registry.Diamond.address, input.contracts.Portal.address], { kind: "uups" });
  await _contract.deployed();
  await _afterDeploy(input.signer, input.chainId, "Bridge", _contract, _contract.deployTransaction);
  const contract = factory.attach(_contract.address);
  return contract;
};

export const deploySynchronizer = async (input: IDeployInput): Promise<Synchronizer> => {
  if (!input.contracts.Registrar) throw new Error("`Registrar` is not available");
  if (!input.contracts.Portal) throw new Error("`Portal` is not available");
  const chain = NetworkConfig[input.chainId]?.chain || InContractChain.ETHEREUM;
  const factory = await ethers.getContractFactory("Synchronizer", input.signer);
  const { canContinue, contractAddress } = await _beforeDeploy(input.signer, await input.signer.getChainId(), "Synchronizer");
  if (!canContinue) {
    if (!contractAddress) throw new Error("???");
    return factory.attach(contractAddress);
  }
  const _contract = await upgrades.deployProxy(factory, [chain, input.contracts.Registrar.address, input.contracts.Portal.address], { kind: "uups" });
  await _contract.deployed();
  await _afterDeploy(input.signer, input.chainId, "Synchronizer", _contract, _contract.deployTransaction);
  const contract = factory.attach(_contract.address);
  return contract;
};

export const deployLayerZeroProvider = async (input: IDeployInput): Promise<LayerZeroProvider> => {
  if (!input.contracts.Portal) throw new Error("`Portal` is not available");
  const factory = await ethers.getContractFactory("LayerZeroProvider", input.signer);
  const { canContinue, contractAddress } = await _beforeDeploy(input.signer, await input.signer.getChainId(), "LayerZeroProvider");
  if (!canContinue) {
    if (!contractAddress) throw new Error("???");
    return factory.attach(contractAddress);
  }
  const lzEndpoint = NetworkConfig[await input.signer.getChainId()].layerzero?.endpoint;
  if (!lzEndpoint) throw new Error("LayerZero endpoint is missing");
  if (!ethers.utils.isAddress(lzEndpoint.address)) throw new Error("LayerZero endpoint is invalid");
  const _contract = await upgrades.deployProxy(factory, [lzEndpoint.address, input.contracts.Portal.address], { kind: "uups" });
  await _contract.deployed();
  await _afterDeploy(input.signer, input.chainId, "LayerZeroProvider", _contract, _contract.deployTransaction);
  const contract = factory.attach(_contract.address);
  return contract;
};

export const deployMigrationManager = async (input: IDeployInput): Promise<MigrationManager> => {
  if (!input.contracts.Registrar) throw new Error("`Registrar` is not available");
  const factory = await ethers.getContractFactory("MigrationManager", input.signer);
  const { canContinue, contractAddress } = await _beforeDeploy(input.signer, await input.signer.getChainId(), "MigrationManager");
  if (!canContinue) {
    if (!contractAddress) throw new Error("???");
    return factory.attach(contractAddress);
  }
  const _contract = await upgrades.deployProxy(factory, [input.contracts.Registrar.address], { kind: "uups" });
  await _contract.deployed();
  await _afterDeploy(input.signer, input.chainId, "MigrationManager", _contract, _contract.deployTransaction);
  const contract = factory.attach(_contract.address);
  return contract;
};

export const deployMortgage = async (input: IDeployInput): Promise<Mortgage> => {
  if (!input.contracts.Token) throw new Error("`Token` is not available");
  if (![Network.GOERLI, Network.SEPOLIA, Network.POLYGON, Network.POLYGON_MUMBAI, Network._HARDHAT_].includes(input.chainId)) {
    throw new Error(
      `Only specific networks are supported: ${[Network.GOERLI, Network.SEPOLIA, Network.POLYGON, Network.POLYGON_MUMBAI].map((cid) => NetworkConfig[cid]?.name).join(", ")}`,
    );
  }
  const factory = await ethers.getContractFactory("Mortgage", input.signer);
  const { canContinue, contractAddress } = await _beforeDeploy(input.signer, await input.signer.getChainId(), "Mortgage");
  if (!canContinue) {
    if (!contractAddress) throw new Error("???");
    return factory.attach(contractAddress);
  }
  const _contract = await upgrades.deployProxy(factory, [input.contracts.Token.address], { kind: "uups" });
  await _contract.deployed();
  await _afterDeploy(input.signer, input.chainId, "Mortgage", _contract, _contract.deployTransaction);
  const contract = factory.attach(_contract.address);
  return contract;
};

const _beforeDeploy = async (signer: SignerWithAddress, chainId: number, name: ContractName): Promise<{ canContinue: boolean; contractAddress?: string }> => {
  let canContinue = true;
  if (chainId !== 31337) {
    // Check is the contract already deployed on to the chain
    const isDeployed = await isContractDeployed(chainId, name);
    if (isDeployed) {
      canContinue = false;
      const contractAddress = await getContractAddress(chainId, name);
      console.warn(`⚠️ ${name} is already deployed - [${await getContractAddress(chainId, name)}]`);
      return { canContinue, contractAddress };
    }
    console.log("\n⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️");
    // Check is the signer account has enough balance
    const balance = await getBalance(signer);
    if (balance.eq(0)) throw new Error(`Signer account ${signer.address} has [0] balance`);
    // Announce ready for the deployment
    console.log(`Deployment initiated, contract [${name}] will be deploy on [${NetworkConfig[chainId]?.name || "Local"}] in 3 seconds...`);
    console.log("⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️\n");
    await delay(3000);
  }
  return { canContinue };
};

const _afterDeploy = async (signer: SignerWithAddress | Wallet, chainId: number, name: ContractName, contract: Contract, tx: Transaction) => {
  if (chainId !== 31337) {
    console.log(`Contract [${name}] has been deployed on [${NetworkConfig[chainId]?.name || "Local"}]`);
    console.log(`Address - [${contract.address}]`);
    console.log(`Transaction Hash - [${tx.hash}]`);
    const balance = await getBalance(signer);
    console.log(`Signer account remaining balance ${ethers.utils.formatEther(balance)} ${NetworkConfig[chainId]?.symbol}`);
  }
  const ALL_CONTRACTS_DATA = await getAllContractsData();
  const index = ALL_CONTRACTS_DATA.findIndex((c) => c.chainId === chainId);
  if (index !== -1) {
    ALL_CONTRACTS_DATA[index].addresses[name] = contract.address;
  } else {
    const _contract = _.clone(ALL_CONTRACTS_DATA.find((c) => c.chainId === 0));
    if (!_contract) throw new Error("");
    _contract.chainId = chainId;
    _contract.addresses[name] = contract.address;
    ALL_CONTRACTS_DATA.push(_contract);
  }
  if (chainId !== 0) await setAllContractsData(ALL_CONTRACTS_DATA);
};
