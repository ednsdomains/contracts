import hre, { ethers } from "hardhat";
import NetworkConfig, { Network } from "../../network.config";
import { BigNumber, Wallet } from "ethers";
import delay from "delay";
import { NETWORKS, OMNI_TLDS } from "../../test/helpers/init";
import { networkNameConverter } from "../function/networkNameConverter";
import Contracts from "../../static/contracts.json";
import { load } from "../helpers/get-contracts";
import { expect } from "chai";
// npx hardhat run scripts/test/getChainID.ts --network fantomTestnet
// npx hardhat run scripts/test/getChainID.ts --network bnbTestnet
// npx hardhat run scripts/test/getChainID.ts --network rinkeby
async function main() {
  const networkConfig = NetworkConfig[networkNameConverter(hre.network.name)];
  const provider = new hre.ethers.providers.JsonRpcProvider(networkConfig.url, {
    chainId: networkConfig.chainId,
    name: networkConfig.name,
  });
  let walletWithProvider = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
  const currentContractAddress = await load(networkNameConverter(hre.network.name), walletWithProvider);
  const tld = ethers.utils.toUtf8Bytes("BnbtoRink1050");
  const chainID = await currentContractAddress.Root.callStatic.lzChainId();
  const chainIDFromRegistry: Uint8Array = (await currentContractAddress.Registry.getLzChainIds(tld)) as unknown as Uint8Array;

  console.log({ chainID });
  console.log(chainIDFromRegistry);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
