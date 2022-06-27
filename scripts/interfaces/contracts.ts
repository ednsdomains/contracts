import {
  Registry,
  PublicResolver,
  PublicResolverSynchronizer,
  SingletonRegistrar,
  SingletonRegistrarController,
  OmniRegistrar,
  OmniRegistrarController,
  OmniRegistrarSynchronizer,
  Root,
  DomainPriceOracle,
  TokenPriceOracle,
  Token,
} from "../../typechain";

export interface IContracts {
  Registry: Registry;
  PublicResolver: PublicResolver;
  PublicResolverSynchronizer: PublicResolverSynchronizer;
  SingletonRegistrar: SingletonRegistrar;
  SingletonRegistrarController: SingletonRegistrarController;
  OmniRegistrar: OmniRegistrar;
  OmniRegistrarController: OmniRegistrarController;
  OmniRegistrarSynchronizer: OmniRegistrarSynchronizer;
  Root: Root;
  DomainPriceOracle: DomainPriceOracle;
  TokenPriceOracle: TokenPriceOracle;
  Token: Token;
}
