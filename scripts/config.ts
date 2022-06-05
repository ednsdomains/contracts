import { Chain, Network } from "../constant/chain";

interface IConfig {
  name: string;
  chainId: number;
  url: string;
  chain: Chain;
  network: Network;
}

function getConfig(chain: Chain, network: Network): IConfig {}
