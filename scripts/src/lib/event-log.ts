import { Contract, Transaction } from "ethers";

export enum Event{
    DEPLOY = 'deploy',
    SETUP = 'setup',
    UPGRADE = 'upgrade',
}

export const getEvents = async (event: Event, contract: Contract, tx: Transaction): Promise<void> => {
}