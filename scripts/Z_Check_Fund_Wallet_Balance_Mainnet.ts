import { ethers } from "hardhat";
import NetworkConfig, { Mainnets } from "../network.config";
import FundWallets from "../static/fund-wallet.json";

async function main() {
  const getContent = async (chainId: number, address: string) => {
    const provider = new ethers.providers.JsonRpcProvider(NetworkConfig[chainId].url);
    const balance = await provider.getBalance(address);
    return { name: NetworkConfig[chainId].name, address, symbol: NetworkConfig[chainId].symbol, balance: ethers.utils.formatEther(balance) };
  };
  const data = [];
  for (const wallet of FundWallets) {
    if (Mainnets.find((t) => t === NetworkConfig[wallet.chainId].chainId) && NetworkConfig[wallet.chainId] && NetworkConfig[wallet.chainId].url) {
      data.push(getContent(wallet.chainId, wallet.address));
    }
  }
  const result = await Promise.all(data);
  console.table(result);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
