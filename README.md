# EDNS - Omni

![Architecture](./static/images/architecture.png)

## Naming Convention

- `constant` or `immutable` state must be upper snack case
- Private function or state name must be start with `_`
- Getter function name must be start with `get`
- Getter function name with `bool` return type must be start with `is`
- Setter function name must be start with `set`
- `modifier` name must be start with `only`
- `event` name must be used with `{Action/Event}{Entity}` pattern

## Data type

### Strut

> 🚧 Under Construction

### Enum

> 🚧 Under Construction

## Test

```bash
npx hardhat test
```

## Compile

```bash
npx hardhat compile
```

## Deploy

```bash
export NETWORK_NAME = ""
npx hardhat run ./scripts/A01_Deploy_Registry.ts --network $NETWORK_NAME
npx hardhat run ./scripts/A02_Deploy_DefaultWrapper.ts --network $NETWORK_NAME
npx hardhat run ./scripts/A03_Deploy_PublicResolver.ts --network $NETWORK_NAME
npx hardhat run ./scripts/A04_Deploy_Registrar.ts --network $NETWORK_NAME
npx hardhat run ./scripts/A05_Deploy_Root.ts --network $NETWORK_NAME
npx hardhat run ./scripts/A06_Deploy_TokenMock.ts --network $NETWORK_NAME
npx hardhat run ./scripts/A07_Deploy_ClassicalRegistrarController.ts --network $NETWORK_NAME
npx hardhat run ./scripts/A08_Deploy_Portal.ts --network $NETWORK_NAME
```
