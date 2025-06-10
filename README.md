# Cardano TypeScript SDK

A TypeScript SDK for interacting with the Cardano blockchain, providing a clean and type-safe interface for common operations.

## Features

- Wallet management with seed phrase and address support
- UTXO handling and querying
- Token operations (finding, listing, history)
- Transaction metadata support
- Network-agnostic design (supports mainnet, testnet, preprod, and preview networks)
- Blockfrost provider integration for blockchain data access

## Installation

```bash
npm install @cardano-ts/node
```

## Usage

```typescript
import { Blockfrost } from "@cardano-ts/node";
import { Wallet } from "@cardano-ts/node";

// Initialize provider with preview network
const blockfrost = new Blockfrost("YOUR_BLOCKFROST_API_KEY", "preview");

// Create wallet from seed phrase
const wallet = await Wallet.fromSeed(
  blockfrost,
  "your seed phrase here"
);

// Get wallet UTXOs
console.log(wallet.utxos);

// Get account UTXOs
const utxos = await getAccountUtxos(blockfrost, {
  bech32: "stake_test1...",
  network: "preview"
});

// Find token by asset ID
const tokenAddress = await blockfrost.findToken("asset_id_here");

// Get token history
const history = await blockfrost.getTokenHistory("asset_id_here", 100);

// Get transaction metadata
const metadata = await blockfrost.getMetadata("tx_hash_here");
```

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cardano-ts.git
cd cardano-ts
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your Blockfrost API key
```

4. Run tests:
```bash
npm test
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
