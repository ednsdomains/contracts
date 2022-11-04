import { Registry, PublicResolver, BaseRegistrar, ClassicalRegistrarController, Root, UniversalRegistrarController, BatchRegistrarController } from "../../typechain";

export interface IContracts {
  Registry: Registry;
  PublicResolver: PublicResolver;
  BaseRegistrar: BaseRegistrar;
  ClassicalRegistrarController: ClassicalRegistrarController;
  UniversalRegistrarController: UniversalRegistrarController;
  BatchRegistrarController: BatchRegistrarController;
  Root: Root;
}
