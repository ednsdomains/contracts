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
export NETWORK_NAME=""
npx hardhat run ./scripts/A01_Deploy_Registry.ts --network $NETWORK_NAME
npx hardhat run ./scripts/A02_Deploy_DefaultWrapper.ts --network $NETWORK_NAME
npx hardhat run ./scripts/A03_Deploy_PublicResolver.ts --network $NETWORK_NAME
npx hardhat run ./scripts/A04_Deploy_Registrar.ts --network $NETWORK_NAME
npx hardhat run ./scripts/A05_Deploy_Root.ts --network $NETWORK_NAME
npx hardhat run ./scripts/A06_Deploy_TokenMock.ts --network $NETWORK_NAME
npx hardhat run ./scripts/A07_Deploy_ClassicalRegistrarController.ts --network $NETWORK_NAME
npx hardhat run ./scripts/A08_Deploy_UniversalRegistrarController.ts --network $NETWORK_NAME
npx hardhat run ./scripts/A09_Deploy_OmniRegistrarController.ts --network $NETWORK_NAME
npx hardhat run ./scripts/A10_Deploy_Portal.ts --network $NETWORK_NAME
npx hardhat run ./scripts/A11_Deploy_Bridge.ts --network $NETWORK_NAME
npx hardhat run ./scripts/A12_Deploy_Synchronizer.ts --network $NETWORK_NAME
npx hardhat run ./scripts/A13_Deploy_LayerZeroProvider.ts --network $NETWORK_NAME
npx hardhat run ./scripts/A14_Deploy_MigrationManager.ts --network $NETWORK_NAME
```

## Setup

```bash
export NETWORK_NAME=""
npx hardhat run ./scripts/B01_Setup_Registry.ts --network $NETWORK_NAME
npx hardhat run ./scripts/B02_Setup_DefaultWrapper.ts --network $NETWORK_NAME
npx hardhat run ./scripts/B03_Setup_PublicResolver.ts --network $NETWORK_NAME
npx hardhat run ./scripts/B04_Setup_Registrar.ts --network $NETWORK_NAME
npx hardhat run ./scripts/B05_Setup_Root.ts --network $NETWORK_NAME
npx hardhat run ./scripts/B06_Setup_ClassicalRegistrarController.ts --network $NETWORK_NAME
npx hardhat run ./scripts/B07_Setup_UniversalRegistrarController.ts --network $NETWORK_NAME
npx hardhat run ./scripts/B08_Setup_OmniRegistrarController.ts --network $NETWORK_NAME
npx hardhat run ./scripts/B09_Setup_Portal.ts --network $NETWORK_NAME
npx hardhat run ./scripts/B10_Setup_Bridge.ts --network $NETWORK_NAME
npx hardhat run ./scripts/B11_Setup_Synchronizer.ts --network $NETWORK_NAME
npx hardhat run ./scripts/B12_Setup_LayerZeroProvider.ts --network $NETWORK_NAME
npx hardhat run ./scripts/B13_Setup_MigrationManager.ts --network $NETWORK_NAME
```

## Upgrade

```bash
export NETWORK_NAME=""
npx hardhat run ./scripts/C01_Upgrade_Registry.ts --network $NETWORK_NAME
npx hardhat run ./scripts/C02_Upgrade_DefaultWrapper.ts --network $NETWORK_NAME
npx hardhat run ./scripts/C03_Upgrade_PublicResolver.ts --network $NETWORK_NAME
npx hardhat run ./scripts/C04_Upgrade_Registrar.ts --network $NETWORK_NAME
npx hardhat run ./scripts/C05_Upgrade_Root.ts --network $NETWORK_NAME
npx hardhat run ./scripts/C06_Upgrade_ClassicalRegistrarController.ts --network $NETWORK_NAME
npx hardhat run ./scripts/C07_Upgrade_UniversalRegistrarController.ts --network $NETWORK_NAME
npx hardhat run ./scripts/C08_Upgrade_OmniRegistrarController.ts --network $NETWORK_NAME
npx hardhat run ./scripts/C09_Upgrade_Portal.ts --network $NETWORK_NAME
npx hardhat run ./scripts/C10_Upgrade_Bridge.ts --network $NETWORK_NAME
npx hardhat run ./scripts/C11_Upgrade_Synchronizer.ts --network $NETWORK_NAME
npx hardhat run ./scripts/C12_Upgrade_LayerZeroProvider.ts --network $NETWORK_NAME
npx hardhat run ./scripts/C13_Upgrade_MigrationManager.ts --network $NETWORK_NAME
```

## Note

### Updated Tlds

```bash
export NETWORK_NAME=""
npx hardhat run ./scripts/B05_Setup_Root.ts --network $NETWORK_NAME
npx hardhat run ./scripts/B06_Setup_ClassicalRegistrarController.ts --network $NETWORK_NAME
npx hardhat run ./scripts/B07_Setup_UniversalRegistrarController.ts --network $NETWORK_NAME
npx hardhat run ./scripts/B08_Setup_OmniRegistrarController.ts --network $NETWORK_NAME
```

### Added New Chain(s)

```bash
export NETWORK_NAME=""
npx hardhat run ./scripts/B05_Setup_Root.ts --network $NETWORK_NAME
npx hardhat run ./scripts/B06_Setup_ClassicalRegistrarController.ts --network $NETWORK_NAME
npx hardhat run ./scripts/B07_Setup_UniversalRegistrarController.ts --network $NETWORK_NAME
npx hardhat run ./scripts/B08_Setup_OmniRegistrarController.ts --network $NETWORK_NAME
npx hardhat run ./scripts/B10_Setup_Bridge.ts --network $NETWORK_NAME
npx hardhat run ./scripts/B11_Setup_Synchronizer.ts --network $NETWORK_NAME
npx hardhat run ./scripts/B12_Setup_LayerZeroProvider.ts --network $NETWORK_NAME
```
