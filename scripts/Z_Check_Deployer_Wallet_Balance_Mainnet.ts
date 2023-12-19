import { ethers } from "hardhat";
import NetworkConfig, { Network, Mainnets } from "../network.config";

async function main() {
  const _signer = new ethers.Wallet(process.env.PRIVATE_KEY!);
  const getContent = async (network: Network) => {
    const provider = new ethers.providers.JsonRpcProvider(NetworkConfig[network].url);
    const balance = await provider.getBalance(_signer.address);
    return { name: NetworkConfig[network].name, symbol: NetworkConfig[network].symbol, balance: ethers.utils.formatEther(balance) };
  };
  const data = [];
  for (const chainId of Mainnets) {
    data.push(getContent(NetworkConfig[chainId].chainId));
  }
  const result = await Promise.all(data);
  console.log(`Account: ${_signer.address}`);
  console.table(result);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
