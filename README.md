# Cardano TypeScript Library

A Node.js library for working with the Cardano blockchain.

## Requirements

- Node.js >= 20.0.0
- npm >= 10.0.0

## Features

- Wallet management with seed phrase and address support
- UTXO handling and querying
- Token operations (finding, listing, history)
- Transaction metadata support
- Network-agnostic design (supports mainnet, testnet, preprod, and preview networks)
- Blockfrost provider integration for blockchain data access

## Installation

```bash
npm install cardano-ts
```

## Usage

```typescript
import { Wallet, Blockfrost } from 'cardano-ts';

// Create a provider
const provider = new Blockfrost('YOUR_PROJECT_ID', 'preview');

// Create a wallet
const wallet = new Wallet(provider, 'YOUR_ADDRESS');

// Get wallet balance
const balance = await wallet.getBalance();
console.log(`Wallet balance: ${balance} lovelace`);

// Get wallet assets
const assets = await wallet.getAssets();
console.log('Wallet assets:', assets);

// Check if wallet has enough balance
const hasEnough = await wallet.hasBalance(1000000n); // 1 ADA
console.log('Has enough balance:', hasEnough);

// Get asset balance
const assetId = 'YOUR_ASSET_ID';
const assetBalance = await wallet.getAssetBalance(assetId);
console.log(`Asset balance: ${assetBalance}`);

// Get asset history
const history = await wallet.getAssetHistory(assetId, 10);
console.log('Asset history:', history);
```

## Development

1. Clone the repository:
```bash
git clone https://github.com/MynthAI/cardano-ts.git
cd cardano-ts
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your Blockfrost API keys
```

4. Run tests:
```bash
npm test
```

5. Build the library:
```bash
npm run build
```

## Testing

The library uses Vitest for testing. Tests are located in the `src/tests` directory.

To run tests:
```bash
npm test
```

To run tests in watch mode:
```bash
npm run test:watch
```

## Recent Changes

### Network Support
- Added support for preview network
- Improved network validation and error handling
- Updated tests to use preview network addresses

### Blockfrost Integration
- Added comprehensive Blockfrost provider implementation
- Support for UTXO queries with pagination
- Token operations (find, list, history)
- Transaction metadata handling
- Stake address support

### Type System Improvements
- Added proper TypeScript types for all entities (Address, StakeAddress, UTxO)
- Improved network type to support all Cardano networks
- Added type-safe interfaces for provider methods

### Code Organization
- Moved types to a dedicated types.ts file
- Improved error handling with network validation
- Added JSDoc comments for better documentation

### Testing
- Updated tests to use new type system
- Added network validation tests
- Improved test organization and readability
- Added comprehensive Blockfrost provider tests

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
