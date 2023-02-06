import { ethers, upgrades } from "hardhat";
import { LayerZeroProvider__factory } from "../../typechain";
import { Portal__factory } from "../../typechain/factories/Portal__factory";
import * as dotenv from "dotenv";
dotenv.config();

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const POLYGON_LAYERZERO_PROVIDER_ADDRESS = process.env.POLYGON_LAYERZERO_PROVIDER_ADDRESS || "0x8461A1Dc89fdb33951F40E55E1BE6EFe88b53417";
const POLYGON_PORTAL_ADDRESS = process.env.POLYGON_PORTAL_ADDRESS || "0x5d5bBf33660dA4251EaB1B31Bb3666A966eAAc80";

const AVALANCHE_LAYERZERO_PROVIDER_ADDRESS = process.env.AVALANCHE_LAYERZERO_PROVIDER_ADDRESS || "0x5642b53D127c8cDc97B10047187607a8241d0300";
const AVALANCHE_PORTAL_ADDRESS = process.env.AVALANCHE_PORTAL_ADDRESS || "0x814357bD7C7167119Bb5cdF84470004351084589";

async function main() {
  const _signer = new ethers.Wallet(process.env.PRIVATE_KEY!);

  // ===== Polygon ===== //
  const PolygonProvider = new ethers.providers.JsonRpcProvider("https://endpoints.omniatech.io/v1/matic/mumbai/public");
  const PolygonSigner = _signer.connect(PolygonProvider);

  const PolygonPortalFactory = await ethers.getContractFactory("Portal", PolygonSigner);
  const PolygonPortal = Portal__factory.connect(POLYGON_PORTAL_ADDRESS || (await upgrades.deployProxy(PolygonPortalFactory, { kind: "uups" })).address, PolygonSigner);
  console.log(`Polygon 'Portal' address - ${PolygonPortal.address}`);

  const PolygonLayerZeroProviderFactory = await ethers.getContractFactory("LayerZeroProvider", PolygonSigner);
  const PolygonLayerZeroProvider = LayerZeroProvider__factory.connect(
    POLYGON_LAYERZERO_PROVIDER_ADDRESS ||
      (await upgrades.deployProxy(PolygonLayerZeroProviderFactory, ["0xf69186dfBa60DdB133E91E9A4B5673624293d8F8", PolygonPortal.address], { kind: "uups" })).address,
    PolygonSigner,
  );
  console.log(`Polygon 'LayerZeroProvider' address - ${PolygonLayerZeroProvider.address}`);

  ///// START UPGRADE /////
  // console.log("Polygon Portal Upgrade");
  // await upgrades.upgradeProxy(PolygonPortal.address, PolygonPortalFactory, { kind: "uups" });
  // await upgrades.upgradeProxy(PolygonLayerZeroProvider.address, PolygonLayerZeroProviderFactory, { kind: "uups" });
  ///// END UPGRADE /////

  if (!(await PolygonPortal.hasRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("PROVIDER_ROLE")), PolygonLayerZeroProvider.address))) {
    const tx = await PolygonPortal.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("PROVIDER_ROLE")), PolygonLayerZeroProvider.address);
    await tx.wait();
  }
  if (!(await PolygonPortal.hasRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("SENDER_ROLE")), PolygonSigner.address))) {
    const tx = await PolygonPortal.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("SENDER_ROLE")), PolygonSigner.address);
    await tx.wait();
  }
  if ((await PolygonPortal.getProvider(0)) === ZERO_ADDRESS) {
    await PolygonPortal.setProvider(0, PolygonLayerZeroProvider.address);
  }

  // ===== Avalanche ===== //
  const AvalancheProvider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/avalanche_fuji");
  const AvalancheSigner = _signer.connect(AvalancheProvider);

  const AvalanchePortalFactory = await ethers.getContractFactory("Portal", AvalancheSigner);
  const AvalanchePortal = Portal__factory.connect(AVALANCHE_PORTAL_ADDRESS || (await upgrades.deployProxy(AvalanchePortalFactory, { kind: "uups" })).address, AvalancheSigner);
  console.log(`Avalanche 'Portal' address - ${AvalanchePortal.address}`);

  const AvalancheLayerZeroProviderFactory = await ethers.getContractFactory("LayerZeroProvider", AvalancheSigner);
  const AvalancheLayerZeroProvider = LayerZeroProvider__factory.connect(
    AVALANCHE_LAYERZERO_PROVIDER_ADDRESS ||
      (await upgrades.deployProxy(AvalancheLayerZeroProviderFactory, ["0x93f54D755A063cE7bB9e6Ac47Eccc8e33411d706", AvalanchePortal.address], { kind: "uups" })).address,
    AvalancheSigner,
  );
  console.log(`Avalanche 'LayerZeroProvider' address - ${AvalancheLayerZeroProvider.address}`);

  ///// START UPGRADE /////
  // console.log("Avalanche Portal Upgrade");
  // await upgrades.upgradeProxy(AvalanchePortal.address, AvalanchePortalFactory, { kind: "uups" });
  // await upgrades.upgradeProxy(AvalancheLayerZeroProvider.address, AvalancheLayerZeroProviderFactory, { kind: "uups" });
  ///// END UPGRADE /////

  if (!(await AvalanchePortal.hasRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("PROVIDER_ROLE")), AvalancheLayerZeroProvider.address))) {
    const tx = await AvalanchePortal.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("PROVIDER_ROLE")), AvalancheLayerZeroProvider.address);
    await tx.wait();
  }
  if (!(await AvalanchePortal.hasRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("SENDER_ROLE")), AvalancheSigner.address))) {
    const tx = await AvalanchePortal.grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("SENDER_ROLE")), AvalancheSigner.address);
    await tx.wait();
  }
  if ((await AvalanchePortal.getProvider(0)) === ZERO_ADDRESS) {
    await AvalanchePortal.setProvider(0, AvalancheLayerZeroProvider.address);
  }

  // ===== LayerZero ===== //
  console.log(`Setting LayerZero trust remote...`);
  if (
    !(await PolygonLayerZeroProvider.isTrustedRemote(
      10106,
      ethers.utils.solidityPack(["address", "address"], [AvalancheLayerZeroProvider.address, PolygonLayerZeroProvider.address]),
    ))
  ) {
    const tx = await PolygonLayerZeroProvider.setTrustedRemote(
      10106,
      ethers.utils.solidityPack(["address", "address"], [AvalancheLayerZeroProvider.address, PolygonLayerZeroProvider.address]),
    );
    await tx.wait();
  }
  if (
    !(await AvalancheLayerZeroProvider.isTrustedRemote(
      10109,
      ethers.utils.solidityPack(["address", "address"], [PolygonLayerZeroProvider.address, AvalancheLayerZeroProvider.address]),
    ))
  ) {
    const tx = await AvalancheLayerZeroProvider.setTrustedRemote(
      10109,
      ethers.utils.solidityPack(["address", "address"], [PolygonLayerZeroProvider.address, AvalancheLayerZeroProvider.address]),
    );
    await tx.wait();
  }

  // ===== Start ===== //
  const words = "Hello World!!!!";
  const payload = ethers.utils.defaultAbiCoder.encode(["address", "bytes"], ["0x5D6FdbffD6dc6E8a0b69A52dbF010EfD905fB7Ad", ethers.utils.toUtf8Bytes(words)]);
  const ref = ethers.utils.keccak256(payload);
  console.log({ payload, ref });

  // Avalanche
  console.log("Start Avalanche to Polygon");
  const AvalancheFee = await AvalancheLayerZeroProvider.callStatic.estimateFees(10109, payload, ethers.utils.toUtf8Bytes(""));
  console.log("Avalanche Fee + ", ethers.utils.formatEther(AvalancheFee));
  const tx1 = await AvalanchePortal.send(0, _signer.address, 10109, payload, { value: AvalancheFee });
  console.log(`Tx: ${tx1.hash}`);
  await tx1.wait();
  console.log(`Avalanche sent to Polygon through LayerZero.`);

  // Polygon
  console.log("Start Polygon to Avalanche");
  const PolygonFee = await PolygonLayerZeroProvider.callStatic.estimateFees(10106, payload, ethers.utils.toUtf8Bytes(""));
  console.log("Polygon Fee + ", ethers.utils.formatEther(PolygonFee));
  const tx2 = await PolygonPortal.send(0, _signer.address, 10106, payload, { value: PolygonFee });
  console.log(`Tx: ${tx2.hash}`);
  await tx2.wait();
  console.log(`Polygon sent to Avalanche through LayerZero.`);
}

main();
