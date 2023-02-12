import TLDs from "../../../static/tlds.json";

export const getClassicalTlds = async (chainId: number): Promise<string[] | undefined> => {
  return TLDs.classical.find((i) => i.chainId === chainId)?.names;
};

export const getUniversalTlds = async (chainId: number): Promise<string[] | undefined> => {
  return TLDs.universal.find((i) => i.chainIds.includes(chainId))?.names;
};

export const getUniversalTldChainIds = async (tld: string): Promise<number[] | undefined> => {
  return TLDs.universal.find((i) => i.names.includes(tld))?.chainIds;
};
