import { Registry, PublicResolver, Registrar, ClassicalRegistrarController, Root, IERC20, Wrapper, UniversalRegistrarController, BatchRegistrarController } from "../../typechain";

export interface IContracts {
  Registry: Registry;
  PublicResolver: PublicResolver;
  Registrar: Registrar;
  ClassicalRegistrarController: ClassicalRegistrarController;
  Root: Root;
  DefaultWrapper: Wrapper;
  Token: IERC20;
}
