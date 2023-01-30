import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {ethers, upgrades} from "hardhat";
import {PublicResolver__factory} from "../../../typechain";

export const deployRegistrar = async (input:{registryAddress:string,resolverAddress:string}):Promise<any> => {
    const Registrar = await ethers.getContractFactory("Registrar");
    const registrar = await upgrades.deployProxy(Registrar,[input.registryAddress,input.resolverAddress], { kind: "uups" });
    await registrar.deployed();

    return registrar
}
