import hre, { ethers, upgrades } from "hardhat";
import NetworkConfig, { Network } from "../network.config";
import { Wallet } from "ethers";

interface Icontract {
  registry: string;
  token: string;
  domainPriceOracle: string;
  publicResolverSynchronizer: string;
  publicResolver: string;
  singletonRegistrar: string;
  singletonRegistrarController: string;
  omniRegistrarSynchronizer: string;
  omniRegistrar: string;
  omniRegistrarController: string;
  root: string;
  lzEndpoint: string;
  chainId: number;
}
interface IaddressList {
  [name: string]: Icontract;
}

const addressList: IaddressList = {
  fantomTestnet: {
    registry: "0xECE5D1e5996B46b2aA62D395D2Dc6d0f1DB49215",
    token: "0x0FB40B5A79949D45E82E3da7031041a598CB6901",
    domainPriceOracle: "0xef69f66d298Af668cC5D7fF50a7cC4f657BD0E51",
    publicResolverSynchronizer: "0x8c43530B75f11BffE2AC94A30DF6295968ebc6d9",
    publicResolver: "0xfBCd79E0c1a28415A9EE49984cE13E416427f0Ef",
    singletonRegistrar: "0xD9250870374Db4327A2252DC4309336535f6d249",
    singletonRegistrarController: "0x6E08E2B5A7eaEFe807dbACB57A0B153289276291",
    omniRegistrarSynchronizer: "0xC956f2c72d37D81684Bdd3E4e5AEb4846D6E377f",
    omniRegistrar: "0x51f35eb5197cAB77E6714F81Ec08937F93459804",
    omniRegistrarController: "0xC9457e8396197fC18ED29C019c5d4447aa238318",
    root: "0xd2DAC5FC057657fc3aFF336501241269FF9857f4",
    lzEndpoint: "0x7dcAD72640F835B0FA36EFD3D6d3ec902C7E5acf",
    chainId: 10012,
  },
  bnbTestnet: {
    registry: "0xe22dD2607417f07491b86eBFf47f0A2A65341Ce2",
    token: "0xB04Dbe77179D50F2c9c83070FE3d10fD200cCd9A",
    domainPriceOracle: "0xC956f2c72d37D81684Bdd3E4e5AEb4846D6E377f",
    singletonRegistrar: "0xd2DAC5FC057657fc3aFF336501241269FF9857f4",
    singletonRegistrarController: "0xDcA0e019eE773492390302759d9cb1E901c3B5c8",
    omniRegistrar: "0x472F67fF95c890E31169182d8eE8befF2852Bd6c",
    omniRegistrarSynchronizer: "0xd99408604220437550f5524E2e783646BFC3EEE2",
    omniRegistrarController: "0xe8BEADDB649273C8B79BCf5C300f890AcF6C567f",
    publicResolver: "0xC9457e8396197fC18ED29C019c5d4447aa238318",
    publicResolverSynchronizer: "0x51f35eb5197cAB77E6714F81Ec08937F93459804",
    root: "0x5CD95aaE9c18f2a7Ab959019a13Af5C09FA59a39",
    lzEndpoint: "0x6Fcb97553D41516Cb228ac03FdC8B9a0a9df04A1",
    chainId: 10002,
  },
  // rinkebyTestne:{
  //     registry:"0xe22dD2607417f07491b86eBFf47f0A2A65341Ce2",
  //     token :"0xB04Dbe77179D50F2c9c83070FE3d10fD200cCd9A",
  //     domainPriceOracle: "0xC956f2c72d37D81684Bdd3E4e5AEb4846D6E377f",
  //     singletonRegistrar: "0xd2DAC5FC057657fc3aFF336501241269FF9857f4",
  //     singletonRegistrarController: "0xDcA0e019eE773492390302759d9cb1E901c3B5c8",
  //     omniRegistrar :"0x472F67fF95c890E31169182d8eE8befF2852Bd6c",
  //     omniRegistrarSynchronizer :"0xd99408604220437550f5524E2e783646BFC3EEE2",
  //     omniRegistrarController :"0xe8BEADDB649273C8B79BCf5C300f890AcF6C567f",
  //     publicResolver :"0xC9457e8396197fC18ED29C019c5d4447aa238318",
  //     publicResolverSynchronizer: "0x51f35eb5197cAB77E6714F81Ec08937F93459804",
  //     root :"0x5CD95aaE9c18f2a7Ab959019a13Af5C09FA59a39",
  //     lzEndpoint :"0x6Fcb97553D41516Cb228ac03FdC8B9a0a9df04A1"
  // }
};

async function main() {
  const TLD = "test";
  const othersContractAddress = new Map();

  Object.keys(addressList)
    .filter((name) => name != hre.network.name)
    .map((m) => {
      othersContractAddress.set(m, addressList[m]);
    });
  let currentContractAddress: Icontract = addressList[hre.network.name];

  // console.log(othersContractAddress)
  // console.log(currentContractAddress)

  const getConfig: Record<string, any> = {
    bnbTestnet: NetworkConfig[Network.BNB_CHAIN_TESTNET],
    fantomTestnet: NetworkConfig[Network.FANTOM_TESTNET],
  };
  const provider = new hre.ethers.providers.JsonRpcProvider(getConfig[hre.network.name].url, {
    chainId: getConfig[hre.network.name].chainId,
    name: getConfig[hre.network.name].name,
  });

  let walletMnemonic = Wallet.fromMnemonic(process.env.MNEMONIC!);
  walletMnemonic = walletMnemonic.connect(provider);
  const LzEndpointContract = await ethers.getContractFactory("LayerZeroEndpointMock", walletMnemonic);
  const PublicResolverSynchronizer = await ethers.getContractFactory("PublicResolverSynchronizer", walletMnemonic);
  const OmniRegistrarSynchronizer = await ethers.getContractFactory("OmniRegistrarSynchronizer", walletMnemonic);
  const Root = await ethers.getContractFactory("Root", walletMnemonic);
  const TokenContract = await ethers.getContractFactory("Token", walletMnemonic);

  const publicResolverSynchronizer = PublicResolverSynchronizer.attach(currentContractAddress.publicResolverSynchronizer);
  const lzEndpointContract = LzEndpointContract.attach(currentContractAddress.lzEndpoint);
  const omniRegistrarSynchronizer = OmniRegistrarSynchronizer.attach(currentContractAddress.omniRegistrarSynchronizer);
  const root = Root.attach(currentContractAddress.root);
  const tokenContract = TokenContract.attach(currentContractAddress.token);

  othersContractAddress.forEach(async (x) => {
    await tokenContract.setTrustedRemote(x.chainId, x.token);
    console.log("tokenContract.setTrustedRemote Done");

    await lzEndpointContract.setDestLzEndpoint(x.omniRegistrarSynchronizer, x.lzEndpoint, { gasLimit: 80000000000 });
    console.log("lzEndpointContract.setDestLzEndpoint(x.omniRegistrarSynchronizer,x.lzEndpoint) Done");
    await lzEndpointContract.setDestLzEndpoint(x.publicResolver, x.lzEndpoint);
    console.log("lzEndpointContract.setDestLzEndpoint(x.publicResolver,x.lzEndpoint) Done");
    await lzEndpointContract.setDestLzEndpoint(x.root, x.lzEndpoint);
    console.log("lzEndpointContract.setDestLzEndpoint(x.root,x.lzEndpoint) Done");
    await publicResolverSynchronizer.setTrustedRemote(x.chainId, x.publicResolverSynchronizer);
    console.log("publicResolverSynchronizer.setTrustedRemote Done");
    await omniRegistrarSynchronizer.setTrustedRemote(x.chainId, x.omniRegistrarSynchronizer);
    console.log("omniRegistrarSynchronizer.setTrustedRemote Done");
    await root.setTrustedRemote(x.chainId, x.root);
    console.log("root.setTrustedRemote Done");
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
