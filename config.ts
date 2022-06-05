import { Network } from "./constant/chain";

export interface IConfig {
  aws: {
    region: string;
    credentials: {
      accessKeyId?: string;
      secretAccessKey?: string;
      sessionToken?: string;
    };
  };
  wallet: {
    secretId: string;
  };
  hardhat: {
    network: Network;
  };
}

export const config: IConfig = {
  aws: {
    region: process.env.AWS_REGION || "ap-southeast-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      sessionToken: process.env.AWS_SESSION_TOKEN,
    },
  },
  wallet: {
    secretId: process.env.WALLET_PRIVAYE_KEY_SECRET_ID || "UNKNOWN_WALLET_PRIVAYE_KEY_SECRET_ID",
  },
  hardhat: {
    network: Network[process.env.NETWORK as keyof typeof Network],
  },
};
