import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import NetworkConfig, { Mainnets } from "../network.config";
import FundWallets from "../static/fund-wallet.json";
import { getProvider } from "./src/lib/get-provider";

async function main() {
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY!);
  for (const wallet of FundWallets) {
    if (Mainnets.includes(wallet.chainId)) {
      try {
        //   const _provider = new ethers.providers.JsonRpcProvider(NetworkConfig[wallet.chainId].url);
        const _provider = getProvider(wallet.chainId);
        const _signer = signer.connect(_provider);
        const _selfBalance = await _signer.getBalance();
        const _targetBalance = await _provider.getBalance(wallet.address);
        const amount = ethers.utils.parseUnits(wallet.amount, "ether");
        if (_selfBalance.gt(amount) && _targetBalance.lt(amount)) {
          console.log(`Sending ${wallet.amount} from [${_signer.address}] to [${wallet.address}] at [${NetworkConfig[wallet.chainId].name}]...`);
          const tx = await _signer.sendTransaction({
            to: wallet.address,
            value: amount,
            //   gasLimit: BigNumber.from(1000000),
          });
          console.log(`[Pre Hash] ${tx.hash}`);
          await tx.wait();
          console.log(`[Post Hash] ${tx.hash}`);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
