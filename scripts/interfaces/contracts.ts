import { Registry, PublicResolver, BaseRegistrar, ClassicalRegistrarController, Root, DomainPriceOracle, TokenPriceOracle, Token } from "../../typechain";

export interface IContracts {
  Registry: Registry;
  PublicResolver: PublicResolver;
  BaseRegistrar: BaseRegistrar;
  ClassicalRegistrarController: ClassicalRegistrarController;
  Root: Root;
  DomainPriceOracle: DomainPriceOracle;
  TokenPriceOracle: TokenPriceOracle;
  Token: Token;
}
