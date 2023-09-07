import { Wallet } from "ethers";
import { ethers } from "hardhat";
import _ from "lodash";
import NetworkConfig, { Network, Mainnets, Testnets } from "../network.config";
import { getRegistrar, getContractsData } from "./src/lib/get-contracts";
import { getClassicalTlds, getUniversalTlds } from "./src/lib/get-tlds";
import { v4 as uuidv4 } from "uuid";
import { IRegistry__factory } from "../typechain/factories/IRegistry__factory";
import { Registrar__factory, Wrapper__factory } from "../typechain";

async function getStatus(signer: Wallet, network: Network) {
  const data = await getContractsData(network);
  if (data?.addresses.Registrar && data?.addresses["Registry.Diamond"] && data.addresses["DefaultWrapper"]) {
    const registrar = Registrar__factory.connect(data.addresses.Registrar, signer);
    const registry = IRegistry__factory.connect(data.addresses["Registry.Diamond"], signer);
    const wrapper = Wrapper__factory.connect(data.addresses["DefaultWrapper"], signer);

    const exec = async (type: string, tld: string) => {
      try {
        const [isTldExist, isTldAvailable, isDomainAvailable, nftName, nftSymbol, nftUri] = await Promise.all([
          registrar["isExists(bytes32)"](ethers.utils.keccak256(ethers.utils.toUtf8Bytes(tld))),
          registrar["isAvailable(bytes)"](ethers.utils.toUtf8Bytes(tld)),
          registrar["isAvailable(bytes,bytes)"](ethers.utils.toUtf8Bytes(uuidv4()), ethers.utils.toUtf8Bytes(tld)),
          wrapper["name"](),
          wrapper["symbol"](),
          wrapper["tokenURI"](0),
        ]);
        let _getName = "❌";
        try {
          await registry["getName(bytes32)"](ethers.utils.keccak256(ethers.utils.toUtf8Bytes(tld)));
          _getName = "✅";
        } catch {
          _getName = "⚠️";
        }
        const exist = isTldExist ? "✅" : "❌";
        const available = isTldAvailable ? "✅" : "❌";
        const query = isDomainAvailable ? "✅" : "❌";
        return {
          chain: NetworkConfig[network].name,
          type,
          exist,
          available,
          query,
          getName: _getName,
          tld,
          nftName, nftSymbol, nftUri,
        };
      } catch (err) {
        // console.error(err);
        return {
          chain: NetworkConfig[network].name,
          type,
          exist: "⚠️",
          query: "⚠️",
          available: "⚠️",
          getName: "⚠️",
          tld,
        };
      }
    };

    const classical = await getClassicalTlds(network);
    const universal = await getUniversalTlds(network);
    if (classical?.length && universal?.length && registrar) {
      classical.push("___c_fake___");
      universal.push("___u_fake___");
      const q = await Promise.all([...classical.map(async (tld) => await exec("Classical", tld)), ...universal.map(async (tld) => await exec("Universal", tld))]);
      return q;
    }
  }

  return [];
}

async function main() {
  const _signer = new ethers.Wallet(process.env.PRIVATE_KEY!);
  const testnets = await Promise.all([
    ...Testnets.map((network) => {
      const provider = new ethers.providers.JsonRpcProvider(NetworkConfig[network].url);
      const signer = _signer.connect(provider);
      return getStatus(signer, network);
    }),
  ]);
  console.table(_.flatten(testnets));

  const mainnets = await Promise.all([
    ...Mainnets.map((network) => {
      const provider = new ethers.providers.JsonRpcProvider(NetworkConfig[network].url);
      const signer = _signer.connect(provider);
      return getStatus(signer, network);
    }),
  ]);
  console.table(_.flatten(mainnets));
}

main();
