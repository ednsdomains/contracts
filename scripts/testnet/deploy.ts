import { ethers } from "hardhat";
import { deploy } from "../helpers/deploy";
import { Testnets as networks } from "../../network.config";
import { createProvider } from "../helpers/provider";
import { IDeployedContracts } from "../interfaces/deployed-contracts";

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Wallet Address:", await signer.getAddress());

  for (const network of networks) {
    const provider_ = createProvider(network);
    const signer_ = signer.connect(provider_);
    await deploy({ signer: signer_, network, networks });
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
