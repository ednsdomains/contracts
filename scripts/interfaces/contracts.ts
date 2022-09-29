import {
  Registry,
  PublicResolver,
  PublicResolverSynchronizer,
  BaseRegistrar,
  ClassicalRegistrarController,
  Root,
  DomainPriceOracle,
  TokenPriceOracle,
  Token,
} from "../../typechain";

export interface IContracts {
  Registry: Registry;
  PublicResolver: PublicResolver;
  // PublicResolverSynchronizer: PublicResolverSynchronizer;
  BaseRegistrar: BaseRegistrar;
  ClassicalRegistrarController: ClassicalRegistrarController;
  Root: Root;
  DomainPriceOracle: DomainPriceOracle;
  TokenPriceOracle: TokenPriceOracle;
  Token: Token;
}
