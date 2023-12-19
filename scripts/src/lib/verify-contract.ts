import delay from "delay";
import hre from "hardhat";

export const verifyContract = async (address: string): Promise<void> => {
  try {
    await hre.run("verify:verify", { address });
    await delay(500);
  } catch (error) {
    console.error(`Cannot verify contract, provided did not set the Explorer API Key in environment variable`);
  }
};
