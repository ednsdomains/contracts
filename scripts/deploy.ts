import { Chain, Network } from "../constant/chain";
import hre from "hardhat";
import { getChainConfig, getPrivateKey } from "./helpers";
import { config } from "../config";

const ChainList = Object.values(Chain);
const NetworkList = Object.values(Network);

if (!config.hardhat.network || !NetworkList.includes(config.hardhat.network)) throw new Error(`Unknown network`);

async function deploy() {}

async function setupRoles() {}

async function verifyEtherscan(address: string) {
  await hre.run("verify:verify", { address });
}

async function main() {
  const privateKey = await getPrivateKey();
  const signer = new hre.ethers.Wallet(privateKey);
  console.log("Wallet Address:", await signer.getAddress());

  for (const chain of ChainList) {
    const _chainConfig = getChainConfig(chain, config.hardhat.network);
    const provider = new hre.ethers.providers.JsonRpcProvider(_chainConfig.url, { chainId: _chainConfig.chainId, name: _chainConfig.name });

    const _signer = signer.connect(provider);
    console.log(`[${_chainConfig.chain}_${_chainConfig.network}] Wallet Balance: ${hre.ethers.utils.formatEther(await _signer.getBalance())} ${_chainConfig.symbol}`);

    const Registry = await hre.ethers.getContractFactory("Registry", _signer);
    const Token = await hre.ethers.getContractFactory("Token", _signer);
    const TokenPriceOracle = await hre.ethers.getContractFactory("TokenPriceOracle", _signer);
    const DomainPriceOracle = await hre.ethers.getContractFactory("DomainPriceOracle", _signer);
    const SingletonRegistrar = await hre.ethers.getContractFactory("SingletonRegistrar", _signer);
    const SingletonRegistrarController = await hre.ethers.getContractFactory("SingletonRegistrarController", _signer);
    const PublicResolver = await hre.ethers.getContractFactory("PublicResolver", _signer);

    const _token = await hre.upgrades.deployProxy(Token, [_chainConfig.layerzero.chainId]);
    await _token.deployed();
    console.log(`[[${_chainConfig.chain}_${_chainConfig.network}]] Token Deployed - ${_token.address}`);
    const token = Token.attach(_token.address);

    const _registry = await hre.upgrades.deployProxy(Registry);
    await _registry.deployed();
    console.log(`[[${_chainConfig.chain}_${_chainConfig.network}]] Registry Deployed - ${_registry.address}`);
    const registry = Registry.attach(_registry.address);

    const _publicResolver = await hre.upgrades.deployProxy(PublicResolver);
    await _publicResolver.deployed();
    console.log(`[[${_chainConfig.chain}_${_chainConfig.network}]] PublicResolver Deployed - ${_publicResolver.address}`);
    const publicResolver = PublicResolver.attach(_publicResolver.address);

    const _singletonRegistrar = await hre.upgrades.deployProxy(SingletonRegistrar, [registry]);
    await _singletonRegistrar.deployed();
    console.log(`[[${_chainConfig.chain}_${_chainConfig.network}]] SingletoneRegistrar Deployed - ${_singletonRegistrar.address}`);
    const singletonRegistrar = SingletonRegistrar.attach(_singletonRegistrar.address);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
