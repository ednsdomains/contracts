import {ethers, upgrades} from "hardhat";

export const deployTokenMock = async ():Promise<any> => {
    const Token = await ethers.getContractFactory("TokenMock");
    const token = await Token.deploy();
    await token.deployed();
    return token
}
