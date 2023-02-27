import ethers, { Contract } from "ethers";

export enum FacetCutAction {
  ADD,
  REPLACE,
  REMOVE,
}

export const getSelectors = (contract: Contract): string[] => {
  const signatures = Object.keys(contract.interface.functions);
  const selectors = signatures.filter((signature) => !signature.startsWith("init")).map((signature) => contract.interface.getSighash(signature));
  return selectors;
};

export const getSelector = (func: string): string => {
  const abiInterface = new ethers.utils.Interface([func]);
  return abiInterface.getSighash(ethers.utils.Fragment.from(func));
};
