import _ from "lodash";
import TLDs from "../../../static/tlds.json";

export const getClassicalTlds = async (chainId: number): Promise<string[] | undefined> => {
  return _.flatten(TLDs.classical.filter((i) => i.chainId === chainId).map((i) => i.names));
};

export const getUniversalTlds = async (chainId: number): Promise<string[] | undefined> => {
  return _.flatten(TLDs.universal.filter((i) => i.chainIds.includes(chainId)).map((i) => i.names));
};

export const getUniversalTldChainIds = async (tld: string): Promise<number[] | undefined> => {
  return TLDs.universal.find((i) => i.names.includes(tld))?.chainIds;
};

export const getOmniTlds = async (chainId: number): Promise<string[] | undefined> => {
  return _.flatten(TLDs.omni.filter((i) => i.chainIds.includes(chainId)).map((i) => i.names));
};

export const getOmniTldChainIds = async (tld: string): Promise<number[] | undefined> => {
  return TLDs.omni.find((i) => i.names.includes(tld))?.chainIds;
};
