import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers, upgrades } from "hardhat";
import { IContracts } from "./interfaces/contracts";

export interface IUpgradeInput {
  contracts: IContracts;
  signer: SignerWithAddress;
}

export async function upgradeToken(input: IUpgradeInput): Promise<void> {
  const TokenFactory = await ethers.getContractFactory("Token", input.signer);
  await upgrades.upgradeProxy(input.contracts.Token, TokenFactory);
}

export async function upgradeDomainPriceOracle(input: IUpgradeInput): Promise<void> {
  const DomainPriceOracleFactory = await ethers.getContractFactory("DomainPriceOracle", input.signer);
  await upgrades.upgradeProxy(input.contracts.DomainPriceOracle, DomainPriceOracleFactory);
}

export async function upgradeRegistry(input: IUpgradeInput): Promise<void> {
  const RegistryFactory = await ethers.getContractFactory("Registry", input.signer);
  await upgrades.upgradeProxy(input.contracts.Registry, RegistryFactory);
}

// export async function upgradePublicResolverSynchronizer(input: IUpgradeInput): Promise<void> {
//   const PublicResolverSynchronizerFactory = await ethers.getContractFactory("PublicResolverSynchronizer", input.signer);
//   await upgrades.upgradeProxy(input.contracts.PublicResolverSynchronizer, PublicResolverSynchronizerFactory);
// }

export async function upgradePublicResolver(input: IUpgradeInput): Promise<void> {
  const PublicResolverFactory = await ethers.getContractFactory("PublicResolver", input.signer);
  await upgrades.upgradeProxy(input.contracts.PublicResolver, PublicResolverFactory);
}

// export async function upgradeSingletonRegistrar(input: IUpgradeInput): Promise<void> {
//   const SingletonRegistrarFactory = await ethers.getContractFactory("SingletonRegistrar", input.signer);
//   await upgrades.upgradeProxy(input.contracts.SingletonRegistrar, SingletonRegistrarFactory);
// }

// export async function upgradeSingletonRegistrarController(input: IUpgradeInput): Promise<void> {
//   const SingletonRegistrarControllerFactory = await ethers.getContractFactory("SingletonRegistrarController", input.signer);
//   await upgrades.upgradeProxy(input.contracts.SingletonRegistrarController, SingletonRegistrarControllerFactory);
// }

// export async function upgradeOmniRegistrarSynchronizer(input: IUpgradeInput): Promise<void> {
//   const OmniRegistrarSynchronizerFactory = await ethers.getContractFactory("OmniRegistrarSynchronizer", input.signer);
//   await upgrades.upgradeProxy(input.contracts.OmniRegistrarSynchronizer, OmniRegistrarSynchronizerFactory);
// }

// export async function upgradeOmniRegistrar(input: IUpgradeInput): Promise<void> {
//   const OmniRegistrarFactory = await ethers.getContractFactory("OmniRegistrar", input.signer);
//   await upgrades.upgradeProxy(input.contracts.OmniRegistrar, OmniRegistrarFactory);
// }
// export async function upgradeOmniRegistrarController(input: IUpgradeInput): Promise<void> {
//   const OmniRegistrarControllerFactory = await ethers.getContractFactory("OmniRegistrarController", input.signer);
//   await upgrades.upgradeProxy(input.contracts.OmniRegistrarController, OmniRegistrarControllerFactory);
// }

export async function upgradeRoot(input: IUpgradeInput): Promise<void> {
  const RootFactory = await ethers.getContractFactory("Root", input.signer);
  await upgrades.upgradeProxy(input.contracts.Root, RootFactory);
}
