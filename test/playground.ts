import { ethers } from "ethers";
import { keccak256 } from "@ethersproject/keccak256";
import { concat, hexlify } from "@ethersproject/bytes";

async function main() {
  const tld = "meta";
  console.log(ethers.utils.namehash(tld));

  console.log(keccak256(new Uint8Array(32)));

  console.log(hexlify(concat([new Uint8Array(32), keccak256(ethers.utils.toUtf8Bytes("meta"))])));

  console.log(keccak256(concat([new Uint8Array(32), keccak256(ethers.utils.toUtf8Bytes("meta"))])));
}

main().catch((error) => console.error(error));
