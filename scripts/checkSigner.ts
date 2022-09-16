import {AwsKmsSigner} from "ethers-aws-kms-signer";
import hardhat from "hardhat";


const provider = new hardhat.ethers.providers.InfuraProvider(
    hardhat.network.name,
    process.env.INFURA_API_KEY
);
let signer = new AwsKmsSigner({
    region: "ap-southeast-1",
    keyId: process.env.KMS_SIGNER_KEY_ARN!,
});
signer = signer.connect(provider);

async function main() {
    console.log(await signer.getAddress())
    console.log(await signer.getBalance())
}
main().catch((error) => {
    console.error(error);
    process.exit(1);
});
