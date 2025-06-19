/**
 * Supported Cardano networks
 */
export type Network = "mainnet" | "preprod" | "preview";

/**
 * Represents a Cardano address
 */
export interface Address {
  /** The bech32 encoded address */
  bech32: string;
  /** The network this address belongs to */
  network: Network;
}

/**
 * Represents a Cardano stake address
 */
export interface StakeAddress {
  /** The bech32 encoded stake address */
  bech32: string;
  /** The network this stake address belongs to */
  network: Network;
}

/**
 * Represents a Cardano asset
 */
export interface Asset {
  /** The asset ID */
  assetId: string;
  /** The amount of the asset */
  amount: bigint;
}

/**
 * Represents a Cardano UTXO (Unspent Transaction Output)
 */
export interface UTxO {
  /** The transaction hash */
  txHash: string;
  /** The output index */
  index: number;
  /** The address */
  address: string;
  /** The amount of lovelace */
  amount: bigint;
  /** The assets in this UTXO */
  assets: Asset[];
}

/**
 * Represents a token history entry
 */
export interface TokenHistoryEntry {
  /** The transaction hash */
  txHash: string;
  /** The amount */
  amount: bigint;
  /** The timestamp */
  timestamp: number;
}

/**
 * Represents a transaction metadata entry
 */
export interface MetadataEntry {
  /** The metadata label */
  label: string;
  /** The metadata content */
  value: unknown;
}

/**
 * Represents a transaction output reference
 */
export interface OutRef {
  /** The transaction hash */
  txHash: string;
  /** The output index */
  outputIndex: number;
}

/**
 * Interface for blockchain providers
 */
export interface Provider {
  /** The network this provider is connected to */
  network: Network;

  /** Gets UTXOs for an address */
  getUtxos(address: string): Promise<UTxO[]>;

  /** Gets all addresses associated with a stake key */
  getStakedAddresses(stakeAddress: string): Promise<string[]>;

  /** Finds the address that owns a token */
  findToken(assetId: string): Promise<string>;

  /** Finds all tokens for a policy */
  findAllTokens(policyId: string): Promise<Asset[]>;

  /** Gets UTXOs for a transaction */
  getTransactionUtxos(txHash: string): Promise<UTxO[]>;

  /** Gets addresses that own an asset */
  getAssetAddresses(assetId: string): Promise<string[]>;

  /** Gets the history of a token */
  getTokenHistory(assetId: string, limit: number): Promise<TokenHistoryEntry[]>;

  /** Gets the number of confirmations for a transaction */
  getConfirmations(txHash: string): Promise<number>;

  /** Gets metadata for a transaction */
  getMetadata(txHash: string): Promise<MetadataEntry[]>;

  /** Gets block information */
  getBlock(hash: string): Promise<unknown>;

  /** Gets the latest block */
  getLatestBlock(): Promise<unknown>;

  /** Gets block transactions */
  getBlockTransactions(hash: string): Promise<string[]>;

  /** Gets pool information */
  getPool(poolId: string): Promise<unknown>;

  /** Gets pool metadata */
  getPoolMetadata(poolId: string): Promise<unknown>;

  /** Gets pool history */
  getPoolHistory(poolId: string): Promise<unknown>;

  /** Gets pool delegators */
  getPoolDelegators(poolId: string): Promise<unknown>;

  /** Gets epoch information */
  getEpoch(number: number): Promise<unknown>;

  /** Gets the latest epoch */
  getLatestEpoch(): Promise<unknown>;

  /** Gets epoch parameters */
  getEpochParameters(number: number): Promise<unknown>;

  /** Gets network information */
  getNetworkInfo(): Promise<unknown>;
}
