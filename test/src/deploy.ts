// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
// import { IContracts } from "../../scripts/src/interfaces/contracts";
// import { deployDefaultWrapper, deployPublicResolver, deployRegistrar, deployRegistry, deployRoot } from "../../scripts/src/deploy";
//
// export interface IDeployContractsInput {
//   signer?: SignerWithAddress;
// }
//
// export const deployContracts = async (input?: IDeployContractsInput): Promise<IContracts> => {
//   const _args = { signer: input?.signer };
//   const Registry = await deployRegistry({ ..._args });
//   const DefaultWrapper = await deployDefaultWrapper({ Registry, NFT_NAME: "Test Ether Domain Name Service", NFT_SYMBOL: "tEDNS" }, { ..._args });
//   const PublicResolver = await deployPublicResolver({ Registry }, { ..._args });
//   const Registrar = await deployRegistrar({ Registry, PublicResolver }, { ..._args });
//   const Root = await deployRoot({ Registry, Registrar }, { ..._args });
//   const Token = await deploy;
// };
