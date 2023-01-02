import { IContracts } from "./contracts";

export interface IDeployedContracts {
  [chainId: number]: IContracts;
}
