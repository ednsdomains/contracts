import {ethers} from "hardhat";
import { getChainConfig } from "../../scripts/helpers";
import {config} from "../../config";
import {Chain} from "../../constant/chain";

describe("Token", function () {
    let Token;
    const ChainList = Object.values(Chain);
    for (const chain of ChainList) {
        const _chainConfig = getChainConfig(chain, config.hardhat.network);
    }
    it("",async function(){
        Token = await ethers.getContractFactory("Token");
    })

})
