import { ethers } from "hardhat";
import NetworkConfig, { Network, Testnets } from "../network.config";

async function main() {
  const _signer = new ethers.Wallet(process.env.PRIVATE_KEY!);
  const getContent = async (network: Network) => {
    const provider = new ethers.providers.JsonRpcProvider(NetworkConfig[network].url);
    const balance = await provider.getBalance(_signer.address);
    return { name: NetworkConfig[network].name, symbol: NetworkConfig[network].symbol, balance: ethers.utils.formatEther(balance) };
  };
  const data = [];
  for (const network in NetworkConfig) {
    if (Testnets.find((t) => t === NetworkConfig[network].chainId) && NetworkConfig[network] && NetworkConfig[network].url) {
      data.push(getContent(NetworkConfig[network].chainId));
    }
  }
  const result = await Promise.all(data);
  console.table(result);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});