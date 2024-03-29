import fs from "fs";
import path from "path";
import { ethers } from "hardhat";
import { Signer } from "ethers";
import { ContractName } from "../constants/contract-name";
import { IContracts, IRegistry } from "../interfaces/contracts";
import { UniversalRegistrarController } from "../../../typechain/UniversalRegistrarController";
import { Mortgage, PublicResolver, Root, TokenMock } from "../../../typechain";
import { Bridge } from "../../../typechain/Bridge";
import { ClassicalRegistrarController } from "../../../typechain/ClassicalRegistrarController";
import { ERC20 } from "../../../typechain/ERC20";
import { LayerZeroProvider } from "../../../typechain/LayerZeroProvider";
import { MigrationManager } from "../../../typechain/MigrationManager";
import { OmniRegistrarController } from "../../../typechain/OmniRegistrarController";
import { Portal } from "../../../typechain/Portal";
import { Registrar } from "../../../typechain/Registrar";
import { Synchronizer } from "../../../typechain/Synchronizer";
import { Wrapper } from "../../../typechain/Wrapper";

export interface IGetContractsData {
  chainId: number;
  addresses: {
    "Registry.Diamond": string | null;
    "Registry.Init": string | null;
    "Registry.DiamondCutFacet": string | null;
    "Registry.DiamondLoupeFacet": string | null;
    "Registry.AccessControlFacet": string | null;
    "Registry.TldRecordFacet": string | null;
    "Registry.DomainRecordFacet": string | null;
    "Registry.HostRecordFacet": string | null;
    "Registry.BaseRegistryFacet": string | null;
    PublicResolver: string | null;
    Registrar: string | null;
    ClassicalRegistrarController: string | null;
    UniversalRegistrarController: string | null;
    OmniRegistrarController: string | null;
    Root: string | null;
    DefaultWrapper: string | null;
    Token: string | null;
    Bridge: string | null;
    Synchronizer: string | null;
    Portal: string | null;
    LayerZeroProvider: string | null;
    MigrationManager: string | null;
    Mortgage: string | null;
  };
}

export const isContractDeployed = async (chainId: number, name: ContractName): Promise<boolean> => {
  const data = await getContractsData(chainId);
  return !!data?.addresses[name];
};

export const getContractAddress = async (chainId: number, name: ContractName): Promise<string | undefined> => {
  const data = await getContractsData(chainId);
  return data?.addresses[name] || undefined;
};

export const getContractsData = async (chainId: number): Promise<IGetContractsData | undefined> => {
  const data = await getAllContractsData();
  return data.find((c) => c.chainId === chainId);
};

export const getAllContractsData = async (): Promise<IGetContractsData[]> => {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), "static/contracts.json"), { encoding: "utf8" }));
};

export async function getContracts(signer: Signer): Promise<IContracts> {
  return {
    Registry: await getRegistry(signer),
    DefaultWrapper: await getDefaultWrapper(signer),
    PublicResolver: await getPublicResolver(signer),
    Registrar: await getRegistrar(signer),
    Root: await getRoot(signer),
    Token: await getToken(signer),
    ClassicalRegistrarController: await getClassicalRegistrarController(signer),
    UniversalRegistrarController: await getUniversalRegistrarController(signer),
    OmniRegistrarController: await getOmniRegistrarController(signer),
    Bridge: await getBridge(signer),
    Portal: await getPortal(signer),
    Synchronizer: await getSynchronizer(signer),
    LayerZeroProvider: await getLayerZeroProvider(signer),
    MigrationManager: await getMigrationManager(signer),
    Mortgage: await getMortgage(signer),
  };
}

export async function getRegistry(signer: Signer): Promise<IRegistry | undefined> {
  const chainId = await signer.getChainId();
  const data = await getContractsData(chainId);
  return {
    Diamond: data?.addresses["Registry.Diamond"] ? await ethers.getContractAt("Registry", data?.addresses["Registry.Diamond"], signer) : undefined,
    Init: data?.addresses["Registry.Init"] ? await ethers.getContractAt("RegistryInit", data?.addresses["Registry.Init"], signer) : undefined,
    facets: {
      DiamondCutFacet: data?.addresses["Registry.DiamondCutFacet"] ? await ethers.getContractAt("DiamondCutFacet", data?.addresses["Registry.DiamondCutFacet"], signer) : undefined,
      DiamondLoupeFacet: data?.addresses["Registry.DiamondLoupeFacet"]
        ? await ethers.getContractAt("DiamondLoupeFacet", data?.addresses["Registry.DiamondLoupeFacet"], signer)
        : undefined,
      AccessControlFacet: data?.addresses["Registry.AccessControlFacet"]
        ? await ethers.getContractAt("AccessControlFacet", data?.addresses["Registry.AccessControlFacet"])
        : undefined,
      TldRecordFacet: data?.addresses["Registry.TldRecordFacet"] ? await ethers.getContractAt("TldRecordFacet", data?.addresses["Registry.TldRecordFacet"], signer) : undefined,
      DomainRecordFacet: data?.addresses["Registry.DomainRecordFacet"]
        ? await ethers.getContractAt("DomainRecordFacet", data?.addresses["Registry.DomainRecordFacet"], signer)
        : undefined,
      HostRecordFacet: data?.addresses["Registry.HostRecordFacet"] ? await ethers.getContractAt("HostRecordFacet", data?.addresses["Registry.HostRecordFacet"], signer) : undefined,
      BaseRegistryFacet: data?.addresses["Registry.BaseRegistryFacet"]
        ? await ethers.getContractAt("BaseRegistryFacet", data?.addresses["Registry.BaseRegistryFacet"], signer)
        : undefined,
    },
  };
}

export async function getDefaultWrapper(signer: Signer): Promise<Wrapper | undefined> {
  const chainId = await signer.getChainId();
  const data = await getContractsData(chainId);
  if (data?.addresses.DefaultWrapper) {
    const WrapperFactory = await ethers.getContractFactory("Wrapper", signer);
    return WrapperFactory.attach(data?.addresses.DefaultWrapper);
  }
  return undefined;
}

export async function getPublicResolver(signer: Signer): Promise<PublicResolver | undefined> {
  const chainId = await signer.getChainId();
  const data = await getContractsData(chainId);
  if (data?.addresses.PublicResolver) {
    const PublicResolverFactory = await ethers.getContractFactory("PublicResolver", signer);
    return PublicResolverFactory.attach(data?.addresses.PublicResolver);
  }
  return undefined;
}

export async function getRegistrar(signer: Signer): Promise<Registrar | undefined> {
  const chainId = await signer.getChainId();
  const data = await getContractsData(chainId);
  if (data?.addresses.Registrar) {
    const RegistrarFactory = await ethers.getContractFactory("Registrar", signer);
    return RegistrarFactory.attach(data?.addresses.Registrar);
  }
  return undefined;
}

export async function getClassicalRegistrarController(signer: Signer): Promise<ClassicalRegistrarController | undefined> {
  const chainId = await signer.getChainId();
  const data = await getContractsData(chainId);
  if (data?.addresses.ClassicalRegistrarController) {
    const ClassicalRegistrarControllerFactory = await ethers.getContractFactory("ClassicalRegistrarController", signer);
    return ClassicalRegistrarControllerFactory.attach(data?.addresses.ClassicalRegistrarController);
  }
  return undefined;
}

export async function getUniversalRegistrarController(signer: Signer): Promise<UniversalRegistrarController | undefined> {
  const chainId = await signer.getChainId();
  const data = await getContractsData(chainId);
  if (data?.addresses.UniversalRegistrarController) {
    const factory = await ethers.getContractFactory("UniversalRegistrarController", signer);
    return factory.attach(data.addresses.UniversalRegistrarController);
  }
  return undefined;
}

export async function getOmniRegistrarController(signer: Signer): Promise<OmniRegistrarController | undefined> {
  const chainId = await signer.getChainId();
  const data = await getContractsData(chainId);
  if (data?.addresses.OmniRegistrarController) {
    const factory = await ethers.getContractFactory("OmniRegistrarController", signer);
    return factory.attach(data.addresses.OmniRegistrarController);
  }
  return undefined;
}

export async function getRoot(signer: Signer): Promise<Root | undefined> {
  const chainId = await signer.getChainId();
  const data = await getContractsData(chainId);
  if (data?.addresses.Root) {
    const RootFactory = await ethers.getContractFactory("Root", signer);
    return RootFactory.attach(data.addresses.Root);
  }
  return undefined;
}

export async function getToken(signer: Signer): Promise<TokenMock | undefined> {
  const chainId = await signer.getChainId();
  const data = await getContractsData(chainId);
  if (data?.addresses.Token) {
    const TokenFactory = await ethers.getContractFactory("TokenMock", signer);
    return TokenFactory.attach(data.addresses.Token);
  }
  return undefined;
}

export async function getPortal(signer: Signer): Promise<Portal | undefined> {
  const chainId = await signer.getChainId();
  const data = await getContractsData(chainId);
  if (data?.addresses.Portal) {
    const PortalFactory = await ethers.getContractFactory("Portal", signer);
    return PortalFactory.attach(data.addresses.Portal);
  }
  return undefined;
}

export async function getBridge(signer: Signer): Promise<Bridge | undefined> {
  const chainId = await signer.getChainId();
  const data = await getContractsData(chainId);
  if (data?.addresses.Bridge) {
    const factory = await ethers.getContractFactory("Bridge", signer);
    return factory.attach(data.addresses.Bridge);
  }
  return undefined;
}

export async function getSynchronizer(signer: Signer): Promise<Synchronizer | undefined> {
  const chainId = await signer.getChainId();
  const data = await getContractsData(chainId);
  if (data?.addresses.Synchronizer) {
    const factory = await ethers.getContractFactory("Synchronizer", signer);
    return factory.attach(data.addresses.Synchronizer);
  }
  return undefined;
}

export async function getLayerZeroProvider(signer: Signer): Promise<LayerZeroProvider | undefined> {
  const chainId = await signer.getChainId();
  const data = await getContractsData(chainId);
  if (data?.addresses.LayerZeroProvider) {
    const factory = await ethers.getContractFactory("LayerZeroProvider", signer);
    return factory.attach(data.addresses.LayerZeroProvider);
  }
  return undefined;
}

export async function getMigrationManager(signer: Signer): Promise<MigrationManager | undefined> {
  const chainId = await signer.getChainId();
  const data = await getContractsData(chainId);
  if (data?.addresses.MigrationManager) {
    const factory = await ethers.getContractFactory("MigrationManager", signer);
    return factory.attach(data.addresses.MigrationManager);
  }
  return undefined;
}

export async function getMortgage(signer: Signer): Promise<Mortgage | undefined> {
  const chainId = await signer.getChainId();
  const data = await getContractsData(chainId);
  if (data?.addresses.Mortgage) {
    const factory = await ethers.getContractFactory("Mortgage", signer);
    return factory.attach(data.addresses.Mortgage);
  }
  return undefined;
}
