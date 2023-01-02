import { ethers } from "hardhat";
import { getClassicalTlds, getUniversalTlds } from "./get-tlds";
import { IContracts } from "./interfaces/contracts";

export interface ISetupInput {
  chainId: number;
  contracts: IContracts;
}

export const setupRegistry = async (input: ISetupInput) => {
  if (!input.contracts.Registry) throw new Error("`Registry` is not available");
  if (!input.contracts.Root) throw new Error("`Root` is not available");
  if (!input.contracts.PublicResolver) throw new Error("`PublicResolver` is not available");
  if (!input.contracts.Registrar) throw new Error("`Registrar` is not available");
  if (!input.contracts.DefaultWrapper) throw new Error("`DefaultWrapper` is not available");

  //=== Grant different Roles to different deployed contracts ==//
  const tx1 = await input.contracts.Registry.grantRole(await input.contracts.Registry.ROOT_ROLE(), input.contracts.Root.address);
  await tx1.wait();
  const tx2 = await input.contracts.Registry.grantRole(await input.contracts.Registry.PUBLIC_RESOLVER_ROLE(), input.contracts.PublicResolver.address);
  await tx2.wait();
  const tx3 = await input.contracts.Registry.grantRole(await input.contracts.Registry.REGISTRAR_ROLE(), input.contracts.Registrar.address);
  await tx3.wait();
  const tx4 = await input.contracts.Registry.grantRole(await input.contracts.Registry.WRAPPER_ROLE(), input.contracts.DefaultWrapper.address);
  await tx4.wait();
};

export const setupDefaultWrapper = async (input: ISetupInput) => {
  //=== NOTHING NEED TO SETUP IN WRAPPER CONTRACT ==//
};

export const setupRegistrar = async (input: ISetupInput) => {
  if (!input.contracts.Root) throw new Error("`Root` is not available");
  if (!input.contracts.Registrar) throw new Error("`Registrar` is not available");

  const tx = await input.contracts.Registrar.grantRole(await input.contracts.Registrar.ROOT_ROLE(), input.contracts.Root.address);
  await tx.wait();
};

export const setupPublicResolver = async (input: ISetupInput) => {
  //=== NOTHING NEED TO SETUP IN WRAPPER CONTRACT ==//
};

export const setupRoot = async (input: ISetupInput) => {
  if (!input.contracts.Root) throw new Error("`Root` is not available");
  if (!input.contracts.PublicResolver) throw new Error("`PublicResolver` is not available");

  //====================//
  //== Classical TLDs ==//
  //====================//
  const classical = await getClassicalTlds(input.chainId);
  if (classical) {
    for (const tld_ of classical) {
      const _tld_ = ethers.utils.toUtf8Bytes(tld_);
      const tx = await input.contracts.Root.register(_tld_, input.contracts.PublicResolver.address, 2147483647, true, 0); // 2147483647 => Year 2038 problem && 0 === TldClass.CLASSICAL
      await tx.wait();
    }
  }

  //====================//
  //== Universal TLDs ==//
  //====================//
  const universal = await getUniversalTlds(input.chainId);
  if (universal) {
    for (const tld_ of universal) {
      const _tld_ = ethers.utils.toUtf8Bytes(tld_);
      const tx = await input.contracts.Root.register(_tld_, input.contracts.PublicResolver.address, 2147483647, true, 0); // 2147483647 => Year 2038 problem && 0 === TldClass.CLASSICAL
      await tx.wait();
    }
  }
};

export const setupClassicalRegistrarController = async (input: ISetupInput) => {
  if (!input.contracts.Root) throw new Error("`Root` is not available");
  if (!input.contracts.ClassicalRegistrarController) throw new Error("`ClassicalRegistrarController` is not available");

  const classical = await getClassicalTlds(input.chainId);
  if (classical) {
    for (const tld_ of classical) {
      const _tld_ = ethers.utils.toUtf8Bytes(tld_);
      const tx = await input.contracts.Root.setControllerApproval(_tld_, input.contracts.ClassicalRegistrarController.address, true);
      await tx.wait();
    }
  }
};

// export const setupClassicalRegistrarController = async (input: ISetupInput) => {
//   const tx = await input.contracts.ClassicalRegistrarController.grantRole(
//     await input.contracts.ClassicalRegistrarController.OPERATOR_ROLE(),
//     input.contracts.BatchRegistrarController.address,
//   );
//   await tx.wait();

//   const tlds_ = Tlds.class_ical[input.network];
//   for (const tld_ of tlds_) {
//     const _tld_ = ethers.utils.toUtf8Bytes(tld_);

//     const tx1 = await input.contracts.Root.register(_tld_, input.contracts.PublicResolver.address, true, 0);
//     await tx1.wait();

//     const tx2 = await input.contracts.Root.setControllerApproval(_tld_, input.contracts.ClassicalRegistrarController.address, true);
//     await tx2.wait();
//   }
// };

// export const setupUniversalRegistrarController = async (input: ISetupInput) => {
//   const tx = await input.contracts.UniversalRegistrarController.grantRole(
//     await input.contracts.UniversalRegistrarController.OPERATOR_ROLE(),
//     input.contracts.BatchRegistrarController.address,
//   );
//   await tx.wait();

//   const tlds_ = Tlds.class_ical[input.network];
//   for (const tld_ of tlds_) {
//     const _tld_ = ethers.utils.toUtf8Bytes(tld_);

//     const tx1 = await input.contracts.Root.register(_tld_, input.contracts.PublicResolver.address, true, 0);
//     await tx1.wait();

//     const tx2 = await input.contracts.Root.setControllerApproval(_tld_, input.contracts.ClassicalRegistrarController.address, true);
//     await tx2.wait();
//   }
// };

// export const setupClassicalRegistrarController = async (input: ISetupInput) => {};

// export const setupSingletonRegistrar = async (input: ISetupInput) => {
//   // Grant `ROOT_ROLE` to `Root` contract
//   await input.contracts[input.network].SingletonRegistrar.grantRole(
//     await input.contracts[input.network].SingletonRegistrar.ROOT_ROLE(),
//     input.contracts[input.network].Root.address,
//   );
//   // Set the `baseUrl` for metadata
//   await input.contracts[input.network].SingletonRegistrar.setBaseURI("https://md.edns.domains"); // No `/` at the end
// };

// export const setupSingletonRegistrarController = async (input: ISetupInput) => {
//   for (const tld_ of SingletonTlds[`${input.network}`]) {
//     const tld = ethers.utils.toUtf8Bytes(tld_);
//     // Allow the `SingletonRegistrarController` to register to the `SingletonRegistrar`
//     await input.contracts[input.network].Root.setControllerApproval(tld, input.contracts[input.network].SingletonRegistrarController.address, true);
//   }
// };

// export const setupOmniRegistrarSynchronizer = async (input: ISetupInput) => {
//   // Set Trust Remote
//   for (const network_ of input.networks) {
//     if (network_ !== input.network) {
//       const isTrustedRemote = await input.contracts[input.network].OmniRegistrarSynchronizer.isTrustedRemote(
//         NetworkConfig[network_].layerzero.chainId,
//         input.contracts[network_].Token.address,
//       );
//       if (!isTrustedRemote) {
//         await input.contracts[input.network].OmniRegistrarSynchronizer.setTrustedRemote(
//           NetworkConfig[network_].layerzero.chainId,
//           input.contracts[network_].OmniRegistrarSynchronizer.address,
//         );
//       }
//     }
//   }
//   // Set the `OmniRegistrar` address for the `Synchronizer`
//   await input.contracts[input.network].OmniRegistrarSynchronizer.setRegistrar(input.contracts[input.network].OmniRegistrar.address);
// };

// export const setupOmniRegistrar = async (input: ISetupInput) => {
//   await input.contracts[input.network].OmniRegistrar.grantRole(await input.contracts[input.network].OmniRegistrar.ROOT_ROLE(), input.contracts[input.network].Root.address);
//   // Set the `baseUrl` for metadata
//   await input.contracts[input.network].OmniRegistrar.setBaseURI("https://md.edns.domains"); // No `/` at the end
// };

// export const setupOmniRegistrarController = async (input: ISetupInput) => {
//   for (const tld_ of OmniTlds) {
//     const tld = ethers.utils.toUtf8Bytes(tld_);
//     // Allow the `OmniRegistrarController` to register to the `OmniRegistrar`
//     await input.contracts[input.network].Root.setControllerApproval(tld, input.contracts[input.network].OmniRegistrarController.address, true);
//   }
// };

// export const setupRoot = async (input: ISetupInput) => {
// Set Trust Remote
// for (const network_ of input.networks) {
//   if (network_ !== input.network) {
//     const isTrustedRemote = await input.contracts[input.network].OmniRegistrarSynchronizer.isTrustedRemote(
//       NetworkConfig[network_].layerzero.chainId,
//       input.contracts[network_].Token.address,
//     );
//     if (!isTrustedRemote) {
//       await input.contracts[input.network].Root.setTrustedRemote(NetworkConfig[network_].layerzero.chainId, input.contracts[network_].Root.address);
//     }
//   }
// }
// };

// export const setupSingletonTlds = async (input: ISetupInput) => {
//   const tlds_ = SingletonTlds[`${input.network}`];
//   for (const tld_ of tlds_) {
//     const tld = ethers.utils.toUtf8Bytes(tld_);
//     await input.contracts[input.network].Root.register(tld, input.contracts[input.network].PublicResolver.address, true, false);
//   }
// };

// export const setupOmniTlds = async (input: ISetupInput) => {
//   for (const tld_ of OmniTlds) {
//     const tld = ethers.utils.toUtf8Bytes(tld_);
//     await input.contracts[input.networks[0]].Root.register(tld, input.contracts[input.networks[0]].PublicResolver.address, true, true);
//   }
// };
