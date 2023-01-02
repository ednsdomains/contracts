import fs from "fs";
import path from "path";
import { ethers } from "hardhat";
import { Signer } from "ethers";
import { ClassicalRegistrarController, ERC20, PublicResolver, Registrar, Registry, Root, Wrapper } from "../../typechain";
import { ContractName } from "./constants/contract-name";

export interface IGetContractsData {
  chainId: number;
  signer: Signer;
  addresses: {
    Registry: string | null;
    PublicResolver: string | null;
    Registrar: string | null;
    ClassicalRegistrarController: string | null;
    Root: string | null;
    DefaultWrapper: string | null;
    Token: string | null;
    [key: string]: string | null;
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
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), "../../static/contracts.json"), { encoding: "utf8" }));
};

export async function getRegistry(signer: Signer): Promise<Registry | undefined> {
  const chainId = await signer.getChainId();
  const data = await getContractsData(chainId);
  if (data?.addresses.Registry) {
    const RegistryFactory = await ethers.getContractFactory("Registry");
    return RegistryFactory.attach(data?.addresses.Registry);
  }
  return undefined;
}

export async function getDefaultWrapper(signer: Signer): Promise<Wrapper | undefined> {
  const chainId = await signer.getChainId();
  const data = await getContractsData(chainId);
  if (data?.addresses.DefaultWrapper) {
    const WrapperFactory = await ethers.getContractFactory("Wrapper");
    return WrapperFactory.attach(data?.addresses.DefaultWrapper);
  }
  return undefined;
}

export async function getPublicResolver(signer: Signer): Promise<PublicResolver | undefined> {
  const chainId = await signer.getChainId();
  const data = await getContractsData(chainId);
  if (data?.addresses.PublicResolver) {
    const PublicResolverFactory = await ethers.getContractFactory("PublicResolver");
    return PublicResolverFactory.attach(data?.addresses.PublicResolver);
  }
  return undefined;
}

export async function getRegistrar(signer: Signer): Promise<Registrar | undefined> {
  const chainId = await signer.getChainId();
  const data = await getContractsData(chainId);
  if (data?.addresses.Registrar) {
    const RegistrarFactory = await ethers.getContractFactory("Registrar");
    return RegistrarFactory.attach(data?.addresses.Registrar);
  }
  return undefined;
}

export async function getClassicalRegistrarController(signer: Signer): Promise<ClassicalRegistrarController | undefined> {
  const chainId = await signer.getChainId();
  const data = await getContractsData(chainId);
  if (data?.addresses.ClassicalRegistrarController) {
    const ClassicalRegistrarControllerFactory = await ethers.getContractFactory("ClassicalRegistrarController");
    return ClassicalRegistrarControllerFactory.attach(data?.addresses.ClassicalRegistrarController);
  }
  return undefined;
}

export async function getRoot(signer: Signer): Promise<Root | undefined> {
  const chainId = await signer.getChainId();
  const data = await getContractsData(chainId);
  if (data?.addresses.Root) {
    const RootFactory = await ethers.getContractFactory("Root");
    return RootFactory.attach(data?.addresses.Root);
  }
  return undefined;
}

export async function getToken(signer: Signer): Promise<ERC20 | undefined> {
  const chainId = await signer.getChainId();
  const data = await getContractsData(chainId);
  if (data?.addresses.Token) {
    const TokenFactory = await ethers.getContractFactory("ERC20");
    return TokenFactory.attach(data?.addresses.Token);
  }
  return undefined;
}
