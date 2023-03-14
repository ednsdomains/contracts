import { Bridge } from "../../../typechain/Bridge";
import { DiamondCutFacet } from "../../../typechain/DiamondCutFacet";
import { DiamondLoupeFacet } from "../../../typechain/DiamondLoupeFacet";
import { TldRecordFacet } from "../../../typechain/TldRecordFacet";
import { DomainRecordFacet } from "../../../typechain/DomainRecordFacet";
import { HostRecordFacet } from "../../../typechain/HostRecordFacet";
import { RegistryInit } from "../../../typechain/RegistryInit";
import {
  Registry,
  PublicResolver,
  Registrar,
  ClassicalRegistrarController,
  Root,
  IERC20,
  Wrapper,
  UniversalRegistrarController,
  Portal,
  LayerZeroProvider,
  Synchronizer,
  OmniRegistrarController,
  AccessControlFacet,
} from "../../../typechain";

export interface IRegistry {
  Diamond?: Registry;
  Init?: RegistryInit;
  facets?: {
    AccessControlFacet?: AccessControlFacet;
    DiamondCutFacet?: DiamondCutFacet;
    DiamondLoupeFacet?: DiamondLoupeFacet;
    TldRecordFacet?: TldRecordFacet;
    DomainRecordFacet?: DomainRecordFacet;
    HostRecordFacet?: HostRecordFacet;
  };
}

export interface IContracts {
  Registry?: IRegistry;
  PublicResolver?: PublicResolver;
  Registrar?: Registrar;
  ClassicalRegistrarController?: ClassicalRegistrarController;
  UniversalRegistrarController?: UniversalRegistrarController;
  OmniRegistrarController?: OmniRegistrarController;
  Root?: Root;
  DefaultWrapper?: Wrapper;
  Token?: IERC20;
  Portal?: Portal;
  Bridge?: Bridge;
  Synchronizer?: Synchronizer;
  LayerZeroProvider?: LayerZeroProvider;
}
