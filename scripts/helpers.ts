import { Chain, Network } from "../constant/chain";
import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { config } from "../config";

export interface ISchema {
  contracts?: {
    [key in Network]?: {
      [key in Chain]?: { [key in string]?: string };
    };
  };
}

export interface IChainConfig {
  name: string;
  chain: Chain;
  network: Network;
  chainId: number;
  url: string;
  symbol: string;
  layerzero: {
    chainId: number;
  };
}

export async function getPrivateKey(): Promise<string> {
  const client = new SecretsManagerClient({ region: config.aws.region });
  const response = await client.send(
    new GetSecretValueCommand({
      SecretId: config.wallet.secretId,
    }),
  );
  if (!response.SecretString) throw new Error("Database credentials cannot be retrieved front secret manager");
  return response.SecretString;
}
export function getChainConfig(chain: Chain, network: Network): IChainConfig {
  return {
    chain: Chain.ETHEREUM,
    network: Network.TESTNET,
    chainId: 1,
    url: "",
    name: "goerli",
    symbol: "ETH",
    layerzero: {
      chainId: 10001,
    },
  };
}
