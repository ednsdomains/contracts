import hre, { ethers, upgrades } from "hardhat";
import NetworkConfig, { Network } from "../network.config";
import { Wallet } from "ethers";
import { OMNI_TLDS } from "../test/helpers/init";
// npx hardhat run scripts/deploy-Setup.ts --network fantomTestnet
// npx hardhat run scripts/deploy-Setup.ts --network bnbTestnet
export interface Icontract {
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

export const addressList: IaddressList = {
  fantomTestnet: {
    registry: "0x0b325D4764ef55CA3B14F61e11E259CA05dE0d18",
    token: "0x33160fc230A0a9316A96388a36f2B8D0a2A9B287",
    domainPriceOracle: "0x8b61C95a57804447032460DB95cf5eb5FCCa5f61",
    publicResolverSynchronizer: "0x689d12f20b927fD39125854bb046ebBF2717dFAc",
    publicResolver: "0xE5f94e6b7713d405B1F97d8a2759d115e4758Ec6",
    singletonRegistrar: "0xceD648ef6E917fcF140844C7348fEAF0a450288e",
    singletonRegistrarController: "0xf7feC1D6DD28fa00Ac52143522Cc18d5CfBdf431",
    omniRegistrarSynchronizer: "0x6375640ca7aBf0e83AE0AF8E60f06C146Fb78866",
    omniRegistrar: "0xBF91305EF2De3b0E1FBFFec93379C5F86b9161ae",
    omniRegistrarController: "0x1Da2E045245533093AcD3fb616D1C2785E689f77",
    root: "0x82DBf0DA7d25AB1DFA66230C4d7603979640a6C6",
    lzEndpoint: "0x7dcAD72640F835B0FA36EFD3D6d3ec902C7E5acf",
    chainId: 10012,
  },

  // No Payable
  // fantomTestnet:{
  //     registry:"0xECE5D1e5996B46b2aA62D395D2Dc6d0f1DB49215",
  //     token:"0x0FB40B5A79949D45E82E3da7031041a598CB6901",
  //     domainPriceOracle:"0xef69f66d298Af668cC5D7fF50a7cC4f657BD0E51",
  //     publicResolverSynchronizer:"0x8c43530B75f11BffE2AC94A30DF6295968ebc6d9",
  //     publicResolver:"0xfBCd79E0c1a28415A9EE49984cE13E416427f0Ef",
  //     singletonRegistrar:"0xD9250870374Db4327A2252DC4309336535f6d249",
  //     singletonRegistrarController:"0x6E08E2B5A7eaEFe807dbACB57A0B153289276291",
  //     omniRegistrarSynchronizer:"0xC956f2c72d37D81684Bdd3E4e5AEb4846D6E377f",
  //     omniRegistrar:"0x51f35eb5197cAB77E6714F81Ec08937F93459804",
  //     omniRegistrarController:"omniRegistrarController 0xC9457e8396197fC18ED29C019c5d4447aa238318\n",
  //     root:"0xd2DAC5FC057657fc3aFF336501241269FF9857f4",
  //     lzEndpoint:"0x7dcAD72640F835B0FA36EFD3D6d3ec902C7E5acf",
  //     chainId: 10012,
  // },
  bnbTestnet: {
    registry: "0xf68CF35C6A5298E32fD4398b54E71A40b95c40fC",
    token: "0x1bc60aDe964B587Ee2F79FA958BaD74BcEF6746D",
    domainPriceOracle: "0x7522B62ACF8a261E0dc98946a792354423c65e77",
    singletonRegistrar: "0xfeFbf79CC3f44Edf53D1e7c05b346D0482FF5b17",
    singletonRegistrarController: "0xbA1b3a8d5dCE847dA45d256D97247A15637bA3CD",
    omniRegistrar: "0x2Bf12465cb172D910Cdee05eC42859c18aCd2941",
    omniRegistrarSynchronizer: "0xe05E80a708d87020682bA6DB41054bE693CbAfFa",
    omniRegistrarController: "0x35a61466A15e9cF7d0Acd71535d642374BbC3750",
    publicResolver: "0x1716448bA4A69f2c460Cd0Ac2dd59C90B4dDB042",
    publicResolverSynchronizer: "0x7bb3D10b7Ecfd7A882487aD14dE69ad47566897B",
    root: "0xe0a3b4aE028DE91f9FDBE5e844b877130C1657ec",
    lzEndpoint: "0x6Fcb97553D41516Cb228ac03FdC8B9a0a9df04A1",
    chainId: 10002,
  },

  // No Payable
  // bnbTestnet:{
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
  //     lzEndpoint :"0x6Fcb97553D41516Cb228ac03FdC8B9a0a9df04A1",
  //     chainId: 10002,
  // },

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
  const TLDsingle = "abcdd";

  const othersContractAddress = new Map();

  Object.keys(addressList)
    .filter((name) => name !== hre.network.name)
    .map((m) => {
      othersContractAddress.set(m, addressList[m]);
    });
  const currentContractAddress: Icontract = addressList[hre.network.name];

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
  const PublicResolverSynchronizer = await ethers.getContractFactory("PublicResolverSynchronizer", walletMnemonic);
  const OmniRegistrarSynchronizer = await ethers.getContractFactory("OmniRegistrarSynchronizer", walletMnemonic);
  const Root = await ethers.getContractFactory("Root", walletMnemonic);
  const TokenContract = await ethers.getContractFactory("Token", walletMnemonic);

  const publicResolverSynchronizer = PublicResolverSynchronizer.attach(currentContractAddress.publicResolverSynchronizer);
  const omniRegistrarSynchronizer = OmniRegistrarSynchronizer.attach(currentContractAddress.omniRegistrarSynchronizer);
  const root = Root.attach(currentContractAddress.root);
  const tokenContract = TokenContract.attach(currentContractAddress.token);

  othersContractAddress.forEach(async (x) => {
    await tokenContract.setTrustedRemote(x.chainId, x.token);
    console.log("tokenContract.setTrustedRemote Done");
    await publicResolverSynchronizer.setTrustedRemote(x.chainId, x.publicResolverSynchronizer);
    console.log("publicResolverSynchronizer.setTrustedRemote Done");
    await omniRegistrarSynchronizer.setTrustedRemote(x.chainId, x.omniRegistrarSynchronizer);
    console.log("omniRegistrarSynchronizer.setTrustedRemote Done");
    await root.setTrustedRemote(x.chainId, x.root);
    console.log("root.setTrustedRemote Done");
  });


  // // singletonRegistrarController
  // for (const TLD of OMNI_TLDS) {
  //   const tld = ethers.utils.toUtf8Bytes(TLD);
  //   await root.setControllerApproval(tld, currentContractAddress.omniRegistrarController, true);
  // }
}

// main().catch((error) => {
//   console.error(error);
//   process.exit(1);
// });
