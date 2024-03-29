import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { IContracts } from "./interfaces/contracts";
import { getClassicalTlds, getOmniTldChainIds, getOmniTlds, getUniversalTldChainIds, getUniversalTlds } from "./lib/get-tlds";
import { ContractName } from "./constants/contract-name";
import { getBalance } from "./lib/get-balance";
import NetworkConfig, { Testnets, Mainnets, Network } from "../../network.config";
import delay from "delay";
import { ContractTransaction, Transaction, Wallet } from "ethers";
import { CrossChainProvider } from "./constants/cross-chain-provider";
import { getContractsData } from "./lib/get-contracts";
import { ZERO_ADDRESS } from "../../network.config";
import { getInContractChain } from "./lib/get-in-contract-chain";
import { FacetCutAction, getSelectors } from "./lib/diamond";
import { ILayerZeroEndpoint__factory, ILegacyBaseRegistrar__factory } from "../../typechain";
import { getProvider } from "./lib/get-provider";
import { AwsKmsSigner } from "./lib/kms-signer";
import { Mortgage } from "../../typechain/Mortgage";

const GAS_LIMIT = 8000000;

export interface ISetupInput {
  chainId: number;
  signer: SignerWithAddress | Wallet;
  contracts: IContracts;
}
export interface IInsertTld {
  chainId: number;
  signer: SignerWithAddress;
  contracts: IContracts;
  tld: string;
}
const _registryDiamondCut = async (input: ISetupInput): Promise<ContractTransaction | undefined> => {
  if (!input.contracts.Registry?.Diamond) throw new Error("`Registry.Diamond` is not available");
  if (!input.contracts.Registry?.Init) throw new Error("`Registry.Init` is not available");
  if (!input.contracts.Registry?.facets?.DiamondLoupeFacet) throw new Error("`Registry.DiamondLoupeFacet` is not available");
  if (!input.contracts.Registry?.facets?.AccessControlFacet) throw new Error("`Registry.AccessControlFacet` is not available");
  if (!input.contracts.Registry?.facets?.TldRecordFacet) throw new Error("`Registry.TldRecordFacet` is not available");
  if (!input.contracts.Registry?.facets?.DomainRecordFacet) throw new Error("`Registry.DomainRecordFacet` is not available");
  if (!input.contracts.Registry?.facets?.HostRecordFacet) throw new Error("`Registry.HostRecordFacet` is not available");
  if (!input.contracts.Registry?.facets?.BaseRegistryFacet) throw new Error("`Registry.BaseRegistryFacet` is not available");

  const _loupe = await ethers.getContractAt("DiamondLoupeFacet", input.contracts.Registry.Diamond.address, input.signer);
  const _cut = await ethers.getContractAt("DiamondCutFacet", input.contracts.Registry.Diamond.address, input.signer);

  try {
    // await cutFacets(input.signer, input.contracts.Registry.Diamond, FacetCutAction.ADD, [input.contracts.Registry.facets.DiamondLoupeFacet]);
    const tx = await _cut.diamondCut(
      [
        {
          facetAddress: input.contracts.Registry.facets.DiamondLoupeFacet.address,
          action: FacetCutAction.ADD,
          functionSelectors: getSelectors(input.contracts.Registry.facets.DiamondLoupeFacet),
        },
      ],
      ZERO_ADDRESS,
      ethers.utils.formatBytes32String(""),
      { gasLimit: GAS_LIMIT },
    );
    await tx.wait();
  } catch {
    // nothing
  }

  const facets = [
    input.contracts.Registry.facets.AccessControlFacet,
    input.contracts.Registry.facets.TldRecordFacet,
    input.contracts.Registry.facets.DomainRecordFacet,
    input.contracts.Registry.facets.HostRecordFacet,
    input.contracts.Registry.facets.BaseRegistryFacet,
  ];

  // const cut: { facetAddress: string; action: FacetCutAction; functionSelectors: string[] }[] = facets.map((facet) => ({
  //   facetAddress: facet.address,
  //   action: FacetCutAction.ADD,
  //   functionSelectors: getSelectors(facet),
  // }));

  const states: { [address: string]: { add: string[]; replace: string[] } } = {};

  const cut: { facetAddress: string; action: FacetCutAction; functionSelectors: string[] }[] = [];

  const accessControlSelectors = getSelectors(input.contracts.Registry.facets.AccessControlFacet);

  for (const facet of facets) {
    const _selectors = getSelectors(facet);
    for (const _selector of _selectors) {
      if (_selector !== facet.interface.getSighash("supportsInterface(bytes4)")) {
        if (
          (facet.address !== input.contracts.Registry.facets.AccessControlFacet.address && !accessControlSelectors.includes(_selector)) ||
          facet.address === input.contracts.Registry.facets.AccessControlFacet.address
        ) {
          try {
            const _address = await _loupe.facetAddress(_selector);
            if (!states[facet.address]) states[facet.address] = { add: [], replace: [] };
            if (_address === ZERO_ADDRESS) {
              states[facet.address].add.push(_selector);
            } else if (_address !== facet.address) {
              states[facet.address].replace.push(_selector);
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
    }
  }
  for (const _address in states) {
    if (states[_address].add.length > 0) {
      cut.push({
        facetAddress: _address,
        action: FacetCutAction.ADD,
        functionSelectors: states[_address].add,
      });
    }
    if (states[_address].replace.length > 0) {
      cut.push({
        facetAddress: _address,
        action: FacetCutAction.REPLACE,
        functionSelectors: states[_address].replace,
      });
    }
  }

  if (cut.length) {
    const tx = await _cut.diamondCut(cut, input.contracts.Registry.Init.address, input.contracts.Registry.Init.interface.encodeFunctionData("init"), { gasLimit: GAS_LIMIT });
    await tx.wait();
    return tx;
  }
};

export const setupRegistry = async (input: ISetupInput) => {
  if (!input.contracts.Registry?.Diamond) throw new Error("`Registry.Diamond` is not available");
  if (!input.contracts.Registry?.Init) throw new Error("`Registry.Init` is not available");
  if (!input.contracts.PublicResolver) throw new Error("`PublicResolver` is not available");
  if (!input.contracts.Root) throw new Error("`Root` is not available");
  if (!input.contracts.Registrar) throw new Error("`Registrar` is not available");
  if (!input.contracts.DefaultWrapper) throw new Error("`DefaultWrapper` is not available");
  if (!input.contracts.Bridge) throw new Error("`Bridge` is not available");

  await _beforeSetup(input.signer, input.chainId, "Registry.Diamond");

  const txs: Transaction[] = [];

  const _registry = await ethers.getContractAt("IRegistry", input.contracts.Registry.Diamond.address, input.signer);

  try {
    let retried = 0;
    let success = false;
    do {
      try {
        //=== Diamond Cut ===//
        const tx = await _registryDiamondCut(input);
        if (tx) txs.push(tx);
        success = true;
      } catch {
        retried++;
        success = false;
      }
    } while (!success && retried < 3);

    //=== Grant different Roles to different deployed contracts ==//
    if (!(await _registry.hasRole(await _registry.ROOT_ROLE(), input.contracts.Root.address))) {
      const tx = await _registry.grantRole(await _registry.ROOT_ROLE(), input.contracts.Root.address);
      await tx.wait();
      txs.push(tx);
    }

    if (!(await _registry.hasRole(await _registry.REGISTRAR_ROLE(), input.contracts.Registrar.address))) {
      const tx = await _registry.grantRole(await _registry.REGISTRAR_ROLE(), input.contracts.Registrar.address);
      await tx.wait();
      txs.push(tx);
    }

    if (!(await _registry.hasRole(await _registry.WRAPPER_ROLE(), input.contracts.DefaultWrapper.address))) {
      const tx = await _registry.grantRole(await _registry.WRAPPER_ROLE(), input.contracts.DefaultWrapper.address);
      await tx.wait();
      txs.push(tx);
    }

    if (!(await _registry.hasRole(await _registry.BRIDGE_ROLE(), input.contracts.Bridge.address))) {
      const tx = await _registry.grantRole(await _registry.BRIDGE_ROLE(), input.contracts.Bridge.address);
      await tx.wait();
      txs.push(tx);
    }

    if (!(await _registry.hasRole(await _registry.OPERATOR_ROLE(), input.signer.address))) {
      const tx = await _registry.grantRole(await _registry.OPERATOR_ROLE(), input.signer.address);
      await tx.wait();
      txs.push(tx);
    }

    if ((await _registry.getDefaultWrapper()) !== input.contracts.DefaultWrapper.address) {
      const tx = await _registry.setDefaultWrapper(input.contracts.DefaultWrapper.address);
      await tx.wait();
      txs.push(tx);
    }

    if ((await _registry.getPublicResolver()) !== input.contracts.PublicResolver.address) {
      const tx = await _registry.setPublicResolver(input.contracts.PublicResolver.address);
      await tx.wait();
      txs.push(tx);
    }

    if (input.contracts.Mortgage) {
      if ((await _registry.getMortgage()) !== input.contracts.Mortgage.address) {
        const tx = await _registry.setMortgage(input.contracts.Mortgage.address);
        await tx.wait();
        txs.push(tx);
      }
    }

    await _afterSetup(input.signer, input.chainId, "Registry.Diamond", [...txs]);
  } catch (error) {
    await _afterSetup(input.signer, input.chainId, "Registry.Diamond", [...txs]);
    throw error;
  }
};

export const setupDefaultWrapper = async (input: ISetupInput) => {
  if (!input.contracts.DefaultWrapper) {
    throw new Error("`DefaultWrapper` is not available");
  }

  await _beforeSetup(input.signer, input.chainId, "DefaultWrapper");
  const txs: Transaction[] = [];

  if (Mainnets.includes(input.chainId)) {
    if ((await input.contracts.DefaultWrapper.name()) !== "EDNS Domains") {
      const tx = await input.contracts.DefaultWrapper.setName("EDNS Domains");
      await tx.wait();
      txs.push(tx);
    }

    if ((await input.contracts.DefaultWrapper.symbol()) !== "EDNS") {
      const tx = await input.contracts.DefaultWrapper.setSymbol("EDNS");
      await tx.wait();
      txs.push(tx);
    }
  }

  if (Testnets.includes(input.chainId) || input.chainId === 31337) {
    if ((await input.contracts.DefaultWrapper.name()) !== "Test Domains") {
      const tx = await input.contracts.DefaultWrapper.setName("Test Domains");
      await tx.wait();
      txs.push(tx);
    }

    if ((await input.contracts.DefaultWrapper.symbol()) !== "TDNS") {
      const tx = await input.contracts.DefaultWrapper.setSymbol("TDNS");
      await tx.wait();
      txs.push(tx);
    }
  }

  if (Testnets.includes(input.chainId)) {
    if ((await input.contracts.DefaultWrapper.tokenURI(0)) !== "https://static.resolver.gdn/testnet/metadata/0/payload.json") {
      const tx = await input.contracts.DefaultWrapper.setBaseURI("https://static.resolver.gdn/testnet/metadata");
      await tx.wait();
      txs.push(tx);
    }
  }
  if (Mainnets.includes(input.chainId)) {
    if ((await input.contracts.DefaultWrapper.tokenURI(0)) !== "https://static.resolver.gdn/metadata/0/payload.json") {
      const tx = await input.contracts.DefaultWrapper.setBaseURI("https://static.resolver.gdn/metadata");
      await tx.wait();
      txs.push(tx);
    }
  }

  await _afterSetup(input.signer, input.chainId, "DefaultWrapper", [...txs]);
};

export const setupRegistrar = async (input: ISetupInput) => {
  if (!input.contracts.Root) {
    throw new Error("`Root` is not available");
  }
  if (!input.contracts.Registrar) {
    throw new Error("`Registrar` is not available");
  }

  await _beforeSetup(input.signer, input.chainId, "Registrar");
  const txs: Transaction[] = [];

  if (!(await input.contracts.Registrar.hasRole(await input.contracts.Registrar.ROOT_ROLE(), input.contracts.Root.address))) {
    const tx = await input.contracts.Registrar.grantRole(await input.contracts.Registrar.ROOT_ROLE(), input.contracts.Root.address);
    await tx.wait();
    txs.push(tx);
  }

  if (input.contracts.Synchronizer) {
    if ((await input.contracts.Registrar.getSynchronizer()) !== input.contracts.Synchronizer.address) {
      const tx = await input.contracts.Registrar.setSynchronizer(input.contracts.Synchronizer.address);
      await tx.wait();
      txs.push(tx);
    }
  }

  await _afterSetup(input.signer, input.chainId, "Registrar", [...txs]);
};

export const setupPublicResolver = async (input: ISetupInput) => {
  if (!input.contracts.PublicResolver) throw new Error("`PublicResolver` is not available");

  await _beforeSetup(input.signer, input.chainId, "PublicResolver");
  const txs: Transaction[] = [];

  if (input.contracts.Synchronizer) {
    if ((await input.contracts.PublicResolver.getSynchronizer()) !== input.contracts.Synchronizer.address) {
      const tx = await input.contracts.PublicResolver.setSynchronizer(input.contracts.Synchronizer.address);
      await tx.wait();
      txs.push(tx);
    }
  }

  if (input.contracts.Mortgage) {
    if ((await input.contracts.PublicResolver.getMortgage()) !== input.contracts.Mortgage.address) {
      const tx = await input.contracts.PublicResolver.setMortgage(input.contracts.Mortgage.address);
      await tx.wait();
      txs.push(tx);
    }
  }

  await _afterSetup(input.signer, input.chainId, "PublicResolver", [...txs]);
};

export const setupRoot = async (input: ISetupInput) => {
  if (!input.contracts.Root) throw new Error("`Root` is not available");
  if (!input.contracts.PublicResolver) throw new Error("`PublicResolver` is not available");
  if (!input.contracts.Registry?.Diamond) throw new Error("`Registry.Diamond` is not available");
  if (!input.contracts.DefaultWrapper) throw new Error("`DefaultWrapper` is not available");
  await _beforeSetup(input.signer, input.chainId, "Root");
  const txs: Transaction[] = [];
  const _registry = await ethers.getContractAt("IRegistry", input.contracts.Registry.Diamond.address, input.signer);
  //====================//
  //== Classical TLDs ==//
  //====================//
  const classical = await getClassicalTlds(input.chainId);
  if (classical) {
    for (const tld_ of classical) {
      const _tld_ = ethers.utils.toUtf8Bytes(tld_);
      const isExists = await _registry["isExists(bytes32)"](ethers.utils.keccak256(_tld_));
      if (!isExists) {
        const tx = await input.contracts.Root.register([], _tld_, input.contracts.PublicResolver.address, 2147483647, input.contracts.Root.address, true, 0); // 2147483647 => Year 2038 problem && 0 === TldClass.CLASSICAL
        await tx.wait();
        txs.push(tx);
      }
      const isWrapped = await _registry.getWrapper(ethers.utils.keccak256(_tld_));
      if (isWrapped.address_ === ZERO_ADDRESS) {
        const tx = await input.contracts.Root.setWrapper(ethers.utils.keccak256(_tld_), true, input.contracts.DefaultWrapper.address);
        await tx.wait();
        txs.push(tx);
      }
    }
  }

  //====================//
  //== Universal TLDs ==//
  //====================//
  const universal = await getUniversalTlds(input.chainId);
  if (universal) {
    for (const tld_ of universal) {
      const _tld_ = ethers.utils.toUtf8Bytes(tld_);
      const isExists = await _registry["isExists(bytes32)"](ethers.utils.keccak256(_tld_));
      if (!isExists) {
        const chainIds = await getUniversalTldChainIds(tld_);
        if (chainIds) {
          const chains = await Promise.all([...chainIds.map((chainId) => getInContractChain(chainId))]);
          const tx = await input.contracts.Root.register([...chains], _tld_, input.contracts.PublicResolver.address, 2147483647, input.contracts.Root.address, true, 1); // 2147483647 => Year 2038 problem && 1 === TldClass.UNIVERSAL
          await tx.wait();
          txs.push(tx);
        }
      }
      const isWrapped = await _registry.getWrapper(ethers.utils.keccak256(_tld_));
      if (isWrapped.address_ === ZERO_ADDRESS) {
        const tx = await input.contracts.Root.setWrapper(ethers.utils.keccak256(_tld_), true, input.contracts.DefaultWrapper.address);
        await tx.wait();
        txs.push(tx);
      }
    }
  }

  //===============//
  //== Omni TLDs ==//
  //===============//
  const omni = await getOmniTlds(input.chainId);
  if (omni) {
    for (const tld_ of omni) {
      const _tld_ = ethers.utils.toUtf8Bytes(tld_);
      const isExists = await _registry["isExists(bytes32)"](ethers.utils.keccak256(_tld_));
      if (!isExists) {
        const chainIds = await getOmniTldChainIds(tld_);
        if (chainIds) {
          const chains = await Promise.all([...chainIds.map((chainId) => getInContractChain(chainId))]);
          const tx = await input.contracts.Root.register([...chains], _tld_, input.contracts.PublicResolver.address, 2147483647, input.contracts.Root.address, true, 2); // 2147483647 => Year 2038 problem && 2 === TldClass.OMNI
          await tx.wait();
          txs.push(tx);
        }
      }
      const isWrapped = await _registry.getWrapper(ethers.utils.keccak256(_tld_));
      if (isWrapped.address_ === ZERO_ADDRESS) {
        const tx = await input.contracts.Root.setWrapper(ethers.utils.keccak256(_tld_), true, input.contracts.DefaultWrapper.address);
        await tx.wait();
        txs.push(tx);
      }
    }
  }

  await _afterSetup(input.signer, input.chainId, "Root", [...txs]);
};

export const setupClassicalRegistrarController = async (input: ISetupInput) => {
  if (!input.contracts.Root) throw new Error("`Root` is not available");
  if (!input.contracts.ClassicalRegistrarController) throw new Error("`ClassicalRegistrarController` is not available");
  if (!input.contracts.Registry?.Diamond) throw new Error("`Registry.Diamond` is not available");
  if (!input.contracts.Registrar) throw new Error("`Registrar` is not available");
  await _beforeSetup(input.signer, input.chainId, "ClassicalRegistrarController");
  const txs: Transaction[] = [];
  const _registry = await ethers.getContractAt("IRegistry", input.contracts.Registry.Diamond.address, input.signer);
  const tlds = await getClassicalTlds(input.chainId);
  if (tlds && tlds.length) {
    for (const tld_ of tlds) {
      const _tld_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(tld_));
      const isExists = await _registry["isExists(bytes32)"](_tld_);
      if (isExists) {
        const isControllerApproved = await input.contracts.Registrar.isControllerApproved(_tld_, input.contracts.ClassicalRegistrarController.address);
        if (!isControllerApproved) {
          const tx = await input.contracts.Root.setControllerApproval(_tld_, input.contracts.ClassicalRegistrarController.address, true);
          await tx.wait();
          txs.push(tx);
        }
      }
    }
  }
  await _afterSetup(input.signer, input.chainId, "ClassicalRegistrarController", [...txs]);
};

export const setupUniversalRegistrarController = async (input: ISetupInput) => {
  if (!input.contracts.Root) throw new Error("`Root` is not available");
  if (!input.contracts.UniversalRegistrarController) throw new Error("`UniversalRegistrarController` is not available");
  if (!input.contracts.Registry?.Diamond) throw new Error("`Registry.Diamond` is not available");
  if (!input.contracts.Registrar) throw new Error("`Registrar` is not available");
  await _beforeSetup(input.signer, input.chainId, "UniversalRegistrarController");
  const txs: Transaction[] = [];
  const _registry = await ethers.getContractAt("IRegistry", input.contracts.Registry.Diamond.address, input.signer);
  const tlds = await getUniversalTlds(input.chainId);
  if (tlds && tlds.length) {
    for (const tld_ of tlds) {
      const _tld_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(tld_));
      const isExists = await _registry["isExists(bytes32)"](_tld_);
      if (isExists) {
        const isControllerApproved = await input.contracts.Registrar.isControllerApproved(_tld_, input.contracts.UniversalRegistrarController.address);
        if (!isControllerApproved) {
          const tx = await input.contracts.Root.setControllerApproval(_tld_, input.contracts.UniversalRegistrarController.address, true);
          await tx.wait();
          txs.push(tx);
        }
      }
    }
  }
  await _afterSetup(input.signer, input.chainId, "UniversalRegistrarController", [...txs]);
};

export const setupOmniRegistrarController = async (input: ISetupInput) => {
  if (!input.contracts.Root) throw new Error("`Root` is not available");
  if (!input.contracts.Registrar) throw new Error("`Registrar` is not available");
  if (!input.contracts.OmniRegistrarController) throw new Error("`OmniRegistrarController` is not available");
  if (!input.contracts.Registry?.Diamond) throw new Error("`Registry.Diamond` is not available");
  await _beforeSetup(input.signer, input.chainId, "OmniRegistrarController");
  const txs: Transaction[] = [];
  const _registry = await ethers.getContractAt("IRegistry", input.contracts.Registry.Diamond.address, input.signer);
  const tlds = await getOmniTlds(input.chainId);
  if (tlds && tlds.length) {
    for (const tld_ of tlds) {
      const _tld_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(tld_));
      const isExists = await _registry["isExists(bytes32)"](_tld_);
      if (isExists) {
        const isControllerApproved = await input.contracts.Registrar.isControllerApproved(_tld_, input.contracts.OmniRegistrarController.address);
        if (!isControllerApproved) {
          const tx = await input.contracts.Root.setControllerApproval(_tld_, input.contracts.OmniRegistrarController.address, true);
          await tx.wait();
          txs.push(tx);
        }
      }
    }
  }
  await _afterSetup(input.signer, input.chainId, "OmniRegistrarController", [...txs]);
};

export const setupPortal = async (input: ISetupInput) => {
  if (!input.contracts.Portal) throw new Error("`Portal` is not available");
  if (!input.contracts.LayerZeroProvider) throw new Error("`LayerZeroProvider` is not available");
  if (!input.contracts.Bridge) throw new Error("`Bridge` is not available");
  if (!input.contracts.Synchronizer) throw new Error("`Synchronizer` is not available");

  await _beforeSetup(input.signer, input.chainId, "Portal");

  const txs: Transaction[] = [];

  if ((await input.contracts.Portal.getProvider(CrossChainProvider.LAYERZERO)) !== input.contracts.LayerZeroProvider.address) {
    const tx = await input.contracts.Portal.setProvider(CrossChainProvider.LAYERZERO, input.contracts.LayerZeroProvider.address);
    await tx.wait();
    txs.push(tx);
  }

  if (!(await input.contracts.Portal.hasRole(await input.contracts.Portal.PROVIDER_ROLE(), input.contracts.LayerZeroProvider.address))) {
    const tx = await input.contracts.Portal.grantRole(await input.contracts.Portal.PROVIDER_ROLE(), input.contracts.LayerZeroProvider.address);
    await tx.wait();
    txs.push(tx);
  }

  if (!(await input.contracts.Portal.hasRole(await input.contracts.Portal.SENDER_ROLE(), input.contracts.Bridge.address))) {
    const tx = await input.contracts.Portal.grantRole(await input.contracts.Portal.SENDER_ROLE(), input.contracts.Bridge.address);
    await tx.wait();
    txs.push(tx);
  }

  if (!(await input.contracts.Portal.hasRole(await input.contracts.Portal.SENDER_ROLE(), input.contracts.Synchronizer.address))) {
    const tx = await input.contracts.Portal.grantRole(await input.contracts.Portal.SENDER_ROLE(), input.contracts.Synchronizer.address);
    await tx.wait();
    txs.push(tx);
  }

  await _afterSetup(input.signer, input.chainId, "Portal", [...txs]);
};

export const setupBridge = async (input: ISetupInput) => {
  if (!input.contracts.Bridge) throw new Error("`Bridge` is not available");

  const isCurrMainnet = !!Mainnets.find((i) => i === input.chainId);
  const isCurrTestnet = !!Testnets.find((i) => i === input.chainId);

  await _beforeSetup(input.signer, input.chainId, "Bridge");

  const txs: Transaction[] = [];

  for (const network in NetworkConfig) {
    const isTargetMainnet = !!Mainnets.find((i) => i === NetworkConfig[network].chainId);
    const isTargetTestnet = !!Testnets.find((i) => i === NetworkConfig[network].chainId);
    if (NetworkConfig[network].chain !== undefined && NetworkConfig[network].layerzero) {
      if ((isCurrMainnet && isTargetMainnet) || (isCurrTestnet && isTargetTestnet)) {
        const data = await getContractsData(NetworkConfig[network].chainId);
        if (data && data.addresses.Bridge) {
          const _address_ = await input.contracts.Bridge.getRemoteBridge(NetworkConfig[network].chain!);
          if (_address_ === ZERO_ADDRESS) {
            const tx = await input.contracts.Bridge.setRemoteBridge(NetworkConfig[network].chain!, data.addresses.Bridge);
            await tx.wait();
            txs.push(tx);
          }
        }
      }
    }
  }
  await _afterSetup(input.signer, input.chainId, "Bridge", [...txs]);
};

export const setupSynchronizer = async (input: ISetupInput) => {
  if (!input.contracts.Synchronizer) throw new Error("`Synchronizer` is not available");

  const isCurrMainnet = !!Mainnets.find((i) => i === input.chainId);
  const isCurrTestnet = !!Testnets.find((i) => i === input.chainId);

  await _beforeSetup(input.signer, input.chainId, "Synchronizer");

  const txs: Transaction[] = [];

  if (input.contracts.Registrar) {
    if (!(await input.contracts.Synchronizer.hasRole(await input.contracts.Synchronizer.REQUESTOR_ROLE(), input.contracts.Registrar.address))) {
      const tx = await input.contracts.Synchronizer.grantRole(await input.contracts.Synchronizer.REQUESTOR_ROLE(), input.contracts.Registrar.address);
      await tx.wait();
      txs.push(tx);
    }
  }

  if (input.contracts.PublicResolver) {
    if (!(await input.contracts.Synchronizer.hasRole(await input.contracts.Synchronizer.REQUESTOR_ROLE(), input.contracts.PublicResolver.address))) {
      const tx = await input.contracts.Synchronizer.grantRole(await input.contracts.Synchronizer.REQUESTOR_ROLE(), input.contracts.PublicResolver.address);
      await tx.wait();
      txs.push(tx);
    }
  }

  for (const network in NetworkConfig) {
    const isTargetMainnet = !!Mainnets.find((i) => i === NetworkConfig[network].chainId);
    const isTargetTestnet = !!Testnets.find((i) => i === NetworkConfig[network].chainId);
    if (NetworkConfig[network].chain !== undefined && NetworkConfig[network].layerzero) {
      if ((isCurrMainnet && isTargetMainnet) || (isCurrTestnet && isTargetTestnet)) {
        const data = await getContractsData(NetworkConfig[network].chainId);
        if (data && data.addresses.Synchronizer) {
          const _address_ = await input.contracts.Synchronizer.getRemoteSynchronizer(NetworkConfig[network].chain!);
          if (_address_ === ZERO_ADDRESS) {
            const tx = await input.contracts.Synchronizer.setRemoteSynchronizer(NetworkConfig[network].chain!, data.addresses.Synchronizer);
            await tx.wait();
            txs.push(tx);
          }
        }
      }
    }
  }
  await _afterSetup(input.signer, input.chainId, "Synchronizer", [...txs]);
};

export const setupLayerZeroProvider = async (input: ISetupInput) => {
  if (!input.contracts.LayerZeroProvider) throw new Error("`LayerZeroProvider` is not available");

  const isCurrMainnet = !!Mainnets.find((i) => i === input.chainId);
  const isCurrTestnet = !!Testnets.find((i) => i === input.chainId);

  await _beforeSetup(input.signer, input.chainId, "LayerZeroProvider");

  const txs: Transaction[] = [];

  const endpointAddress = await input.contracts.LayerZeroProvider.getEndpoint();

  if (NetworkConfig[input.chainId].layerzero && endpointAddress !== NetworkConfig[input.chainId].layerzero?.endpoint.address) {
    const tx = await input.contracts.LayerZeroProvider.setEndpoint(NetworkConfig[input.chainId].layerzero!.endpoint.address);
    await tx.wait();
    txs.push();
  }

  for (const network in NetworkConfig) {
    const isTargetMainnet = !!Mainnets.find((i) => i === NetworkConfig[network].chainId);
    const isTargetTestnet = !!Testnets.find((i) => i === NetworkConfig[network].chainId);

    if ((isCurrMainnet && isTargetMainnet) || (isCurrTestnet && isTargetTestnet)) {
      const data = await getContractsData(NetworkConfig[network].chainId);
      const _remoteChain = NetworkConfig[network].chain;

      if (_remoteChain !== undefined) {
        const _onchainRemoteChainId = await input.contracts.LayerZeroProvider.getChainId(_remoteChain);
        const _remoteLzChainId = NetworkConfig[network].layerzero?.chainId;

        if (_remoteLzChainId && _onchainRemoteChainId !== _remoteLzChainId) {
          const tx = await input.contracts.LayerZeroProvider.setChainId(_remoteChain, _remoteLzChainId);
          await tx.wait();
          txs.push(tx);
        }

        if (data && data.addresses.LayerZeroProvider && _remoteLzChainId) {
          const _remoteAndLocalAddr = ethers.utils.solidityPack(["address", "address"], [data.addresses.LayerZeroProvider, input.contracts.LayerZeroProvider.address]);

          const isTrustedRemote = await input.contracts.LayerZeroProvider.isTrustedRemote(_remoteLzChainId, _remoteAndLocalAddr);
          if (data && data.addresses.LayerZeroProvider && _remoteLzChainId) {
            const _remoteAndLocalAddr = ethers.utils.solidityPack(["address", "address"], [data.addresses.LayerZeroProvider, input.contracts.LayerZeroProvider.address]);
            if (NetworkConfig[network].layerzero?.endpoint) {
              try {
                const Endpoint = ILayerZeroEndpoint__factory.connect(NetworkConfig[await input.signer.getChainId()].layerzero!.endpoint.address, input.signer);
                const hasStoredPayload_1 = await Endpoint.hasStoredPayload(_remoteLzChainId, _remoteAndLocalAddr);
                if (hasStoredPayload_1) {
                  const tx = await input.contracts.LayerZeroProvider.forceResume(_remoteLzChainId, _remoteAndLocalAddr);
                  await tx.wait();
                  txs.push(tx);
                }
                const hasStoredPayload_2 = await Endpoint.hasStoredPayload(_onchainRemoteChainId, _remoteAndLocalAddr);
                if (hasStoredPayload_2) {
                  const tx = await input.contracts.LayerZeroProvider.forceResume(_onchainRemoteChainId, _remoteAndLocalAddr);
                  await tx.wait();
                  txs.push(tx);
                }
              } catch {
                //
              }
            }
            if (!isTrustedRemote) {
              const tx = await input.contracts.LayerZeroProvider.setTrustedRemote(_remoteLzChainId, _remoteAndLocalAddr);
              await tx.wait();
              txs.push(tx);
            }
          }
        }
      }
    }
  }

  const DST_GAS_LIMIT = 1000000;

  const adaptorParams = ethers.utils.solidityPack(["uint16", "uint256"], [1, DST_GAS_LIMIT]);
  if ((await input.contracts.LayerZeroProvider.v1AdaptorParameters()) !== adaptorParams) {
    const tx = await input.contracts.LayerZeroProvider.setV1AdaptorParameters(DST_GAS_LIMIT);
    await tx.wait();
    txs.push(tx);
  }
  await _afterSetup(input.signer, input.chainId, "LayerZeroProvider", [...txs]);
};

export const setupMigrationManager = async (input: ISetupInput) => {
  if (!input.contracts.MigrationManager) throw new Error("`MigrationManager` is not available");
  if (!input.contracts.Registrar) throw new Error("`Registrar` is not available");
  if (!input.contracts.Root) throw new Error("`Root` is not available");

  await _beforeSetup(input.signer, input.chainId, "MigrationManager");
  const txs: Transaction[] = [];

  const isOperator = await input.contracts.MigrationManager.hasRole(await input.contracts.MigrationManager.OPERATOR_ROLE(), input.signer.address);
  if (!isOperator) {
    const tx = await input.contracts.MigrationManager.grantRole(await input.contracts.MigrationManager.OPERATOR_ROLE(), input.signer.address);
    await tx.wait();
    txs.push(tx);
  }

  const classical = await getClassicalTlds(input.chainId);
  if (classical && classical.length) {
    for (const tld_ of classical) {
      const _tld_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(tld_));
      const isControllerApproved = await input.contracts.Registrar.isControllerApproved(_tld_, input.contracts.MigrationManager.address);
      if (!isControllerApproved) {
        const tx = await input.contracts.Root.setControllerApproval(_tld_, input.contracts.MigrationManager.address, true);
        await tx.wait();
        txs.push(tx);
      }
    }
  }

  const universal = await getUniversalTlds(input.chainId);
  if (universal && universal.length) {
    for (const tld_ of universal) {
      const _tld_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(tld_));
      const isControllerApproved = await input.contracts.Registrar.isControllerApproved(_tld_, input.contracts.MigrationManager.address);
      if (!isControllerApproved) {
        const tx = await input.contracts.Root.setControllerApproval(_tld_, input.contracts.MigrationManager.address, true);
        await tx.wait();
        txs.push(tx);
      }
    }
  }

  if (process.env.KMS_SIGNER_KEY_ARN) {
    let LEGACY_BASE_REGISTRAR: string | undefined;
    if (input.chainId === Network.GOERLI) LEGACY_BASE_REGISTRAR = "0xafFDDAd389bEe8a2AcBa0367dFAE5609B93c7F9b";
    if (input.chainId === Network.POLYGON) LEGACY_BASE_REGISTRAR = "0x53a0018f919bde9C254bda697966C5f448ffDDcB";
    if (input.chainId === Network.IOTEX_TESTNET) LEGACY_BASE_REGISTRAR = "0x0d33ECCcc3629B33a9CeE62108Ef39deD736d4E0";
    if (input.chainId === Network.IOTEX) LEGACY_BASE_REGISTRAR = "0x2A84bF602cD8CF7637d8F247Dd5Dd0ed10525EBA";
    if (LEGACY_BASE_REGISTRAR) {
      const provider = getProvider(input.chainId);
      await provider.ready;
      const legacy_signer = new AwsKmsSigner({ region: "ap-southeast-1", keyId: process.env.KMS_SIGNER_KEY_ARN }, provider);
      const legacy_base_registrar = ILegacyBaseRegistrar__factory.connect(LEGACY_BASE_REGISTRAR, legacy_signer);
      const tx = await legacy_base_registrar.addController(input.contracts.MigrationManager.address);
      await tx.wait();
      txs.push(tx);
    }
  }

  await _afterSetup(input.signer, input.chainId, "MigrationManager", [...txs]);
};

export const setupMortgage = async (input: ISetupInput) => {
  if (!input.contracts.Mortgage) throw new Error("`Mortgage` is not available");
  if (!input.contracts.Registry?.Diamond) throw new Error("`Registry.Diamond` is not available");

  await _beforeSetup(input.signer, input.chainId, "MigrationManager");
  const txs: Transaction[] = [];

  const _registry = await ethers.getContractAt("Mortgage", input.contracts.Registry.Diamond.address, input.signer);

  if ((await input.contracts.Mortgage.getRegistry()) !== _registry.address) {
    const tx = await input.contracts.Mortgage.setRegistry(_registry.address);
    await tx.wait();
    txs.push(tx);
  }

  await _afterSetup(input.signer, input.chainId, "Mortgage", [...txs]);
};

const _beforeSetup = async (signer: SignerWithAddress | Wallet, chainId: number, name: ContractName) => {
  if (chainId !== 31337) {
    console.log("\n⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️");
    const balance = await getBalance(signer);
    if (balance.eq(0)) {
      throw new Error(`Signer account ${signer.address} has [0] balance`);
    } else {
      console.log(`Signer account has ${ethers.utils.formatEther(balance)} ${NetworkConfig[chainId]?.symbol}`);
    }
    console.log(`Setup procedure initiated, contract [${name}] will be setup on [${NetworkConfig[chainId]?.name || "Local"}] in 3 seconds...`);
    console.log("⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️\n");
    await delay(3000);
  }
};

const _afterSetup = async (signer: SignerWithAddress | Wallet, chainId: number, name: ContractName, txs: Transaction[], hasError?: boolean) => {
  if (chainId !== 31337) {
    console.log(`Contract [${name}] has been setup on [${NetworkConfig[chainId]?.name || "Local"}]`);
    if (txs.length) {
      if (hasError) console.log(`⚠️ Error occurred while setting up [${name}] on [${NetworkConfig[chainId]?.name || "Local"}]`);
      console.log(`✅ With the following transaction hash(s): `);
      for (const tx of txs) {
        console.log(`- ${tx.hash}`);
      }
    } else {
      console.log(`❌ No transaction has been send out `);
    }

    const balance = await getBalance(signer);
    console.log(`Signer account remaining balance ${ethers.utils.formatEther(balance)} ${NetworkConfig[chainId]?.symbol}`);
  }
};
