import {ethers} from "hardhat";
import {LayerZeroEndpointMock} from "../../../typechain";

export const deployLayerZero = async (srcChainID:number):Promise<any> => {
    const LZEndpointMock = await ethers.getContractFactory("LayerZeroEndpointMock");
    const fakeLzEndpointMock = await LZEndpointMock.deploy(srcChainID);
    return fakeLzEndpointMock
}
