import { exec } from "child_process";
import { ethers } from "hardhat";
import { getContractsData } from "./src/lib/get-contracts";
import glob from "glob";
import _ from "lodash";
import NetworkConfig from "../network.config";

async function main() {
  const [signer] = await ethers.getSigners();
  const chainId = await signer.getChainId();
  const data = await getContractsData(chainId);
  if (!data) throw new Error("");

  const names = ["Registry"];

  // const names = [
  //   "Registry",
  //   "PublicResolver",
  //   "Registrar",
  //   "ClassicalRegistrarController",
  //   "UniversalRegistrarController",
  //   "Root",
  //   "Wrapper",
  //   "Portal",
  //   "Bridge",
  //   "LayerZeroProvider",
  // ];

  const files = glob.sync("contracts/**/*.sol");

  const paths = names.map((name) => files.find((file) => file.endsWith(`/${name}.sol`)));
  console.log({ files, paths });

  const rpc = NetworkConfig[chainId].url;

  console.log(`docker run --rm -w /tmp -v $\{PWD\}:/tmp mythril/myth analyze -a ${data.addresses.Token} --rpc ${rpc} --solv 0.8.17 -o text`);

  // if (data) {
  //   for (const path of paths) {
  //     if (path) {
  //       try {
  //         exec(`docker run -w /tmp -v $\{PWD\}:/tmp mythril/myth analyze ${path} --solc-json remapping.json`, { shell: "powershell.exe" }, (error, stdout, stderr) => {
  //           if (error) {
  //             console.log(`error: ${error.message}`);
  //             return;
  //           }
  //           if (stderr) {
  //             console.log(`stderr: ${stderr}`);
  //             return;
  //           }
  //           console.log(`stdout: ${stdout}`);
  //         });
  //       } catch (err) {
  //         console.error(err);
  //       }
  //     }
  //   }
  // }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
