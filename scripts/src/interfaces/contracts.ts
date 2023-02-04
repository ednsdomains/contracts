import { Bridge } from "../../../typechain/Bridge";
import {
  Registry,
  PublicResolver,
  Registrar,
  ClassicalRegistrarController,
  Root,
  IERC20,
  Wrapper,
  UniversalRegistrarController,
  BatchRegistrarController,
  Portal,
  LayerZeroProvider,
} from "../../../typechain";

export interface IContracts {
  Registry?: Registry;
  PublicResolver?: PublicResolver;
  Registrar?: Registrar;
  ClassicalRegistrarController?: ClassicalRegistrarController;
  UniversalRegistrarController?: UniversalRegistrarController;
  Root?: Root;
  DefaultWrapper?: Wrapper;
  Token?: IERC20;
  Portal?: Portal;
  Bridge?: Bridge;
  LayerZeroProvider?: LayerZeroProvider;
}
