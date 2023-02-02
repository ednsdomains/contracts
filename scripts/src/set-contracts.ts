import { IGetContractsData } from "./get-contracts";
import path from "path";
import fs from "fs";
import _ from "lodash";

export const setAllContractsData = async (data: IGetContractsData[]): Promise<void> => {
  fs.writeFileSync(path.join(process.cwd(), "../../static/contracts.json"), JSON.stringify(_.uniqBy(data, "chainId"), null, 2));
};
