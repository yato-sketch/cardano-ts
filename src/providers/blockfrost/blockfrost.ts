import { BlockFrostAPI } from "@blockfrost/blockfrost-js";
import { invariant } from "../../utils/invariant";
import {
  Network,
  Provider,
  UTxO,
  TokenHistoryEntry,
  MetadataEntry,
  Asset,
} from "../../types";

/**
 * Blockfrost provider implementation for interacting with the Cardano blockchain
 */
export class Blockfrost implements Provider {
  private readonly api: BlockFrostAPI;
  public readonly network: Network;

  /**
   * Creates a new Blockfrost provider
   * @param projectId - The Blockfrost project ID
   * @param network - The network to connect to (default: preview)
   */
  constructor(projectId: string, network: Network = "preview") {
    // Validate project ID format
    invariant(projectId.length > 0, "Project ID is required");

    // Map our network to Blockfrost's network
    const blockfrostNetwork =
      network === "mainnet"
        ? "mainnet"
        : network === "preprod"
          ? "preprod"
          : "preview";

    this.api = new BlockFrostAPI({
      projectId,
      network: blockfrostNetwork,
    });
    this.network = network;
  }

  /**
   * Formats a pool ID to bech32 format if needed
   * @param poolId - The pool ID to format
   * @returns The formatted pool ID
   */
  private formatPoolId(poolId: string): string {
    return poolId.startsWith('pool1') ? poolId : `pool1${poolId}`;
  }

  /**
   * Gets UTXOs for an address
   * @param address - The address to get UTXOs for
   * @param page - The page number to return
   * @param limit - The number of UTXOs to return per page
   * @returns Promise resolving to an array of UTXOs
   */
  async getUtxos(address: string, page: number = 1, limit: number = 100): Promise<UTxO[]> {
    let hasMore = true;
    const utxos: UTxO[] = [];

    while (hasMore) {
      const pageUtxos = await this.api.addressesUtxos(address, {
        count: limit,
        page,
      });

      utxos.push(...pageUtxos.map((utxo) => ({
        txHash: utxo.tx_hash,
        index: utxo.output_index,
        address: utxo.address,
        amount: BigInt(utxo.amount[0].quantity),
        assets: utxo.amount.slice(1).map((asset) => ({
          assetId: asset.unit,
          amount: BigInt(asset.quantity),
        })),
      })));

      hasMore = pageUtxos.length === limit;
      page++;
    }

    return utxos;
  }

  /**
   * Gets all addresses associated with a stake key
   * @param stakeKey - The stake key to get addresses for
   * @param page - The page number to return
   * @param limit - The number of addresses to return per page
   * @returns Promise resolving to an array of addresses
   */
  async getStakedAddresses(stakeKey: string, page: number = 1, limit: number = 100): Promise<string[]> {
    let hasMore = true;
    const addresses: string[] = [];

    while (hasMore) {
      const pageAddresses = await this.api.accountsAddresses(stakeKey, {
        count: limit,
        page,
      });

      addresses.push(...pageAddresses.map((addr) => addr.address));

      hasMore = pageAddresses.length === limit
      page++;
    }

    return addresses;
  }

  /**
   * Finds the address that owns a token
   * @param token - The token ID to find
   * @returns Promise resolving to the address that owns the token
   */
  async findToken(token: string): Promise<string> {
    const asset = await this.api.assetsById(token);
    invariant(asset, "Token not found");

    const tx = await this.api.txsUtxos(asset.initial_mint_tx_hash);
    
    const output = tx.outputs.find(output => 
      output.amount.some(amount => amount.unit === token)
    );
    
    invariant(output, "Token not found in mint transaction outputs");
    return output.address;
  }

  /**
   * Finds all tokens for a policy
   * @param policy - The policy ID to find tokens for
   * @param page - The page number to return
   * @param limit - The number of tokens to return per page
   * @returns Promise resolving to an array of token IDs
   */
  async findAllTokens(policy: string, page: number = 1, limit: number = 100): Promise<Asset[]> {
    let hasMore = true;
    const assets: Asset[] = [];

    while (hasMore) {
      const pageAssets = await this.api.assetsPolicyById(policy, {
        count: limit,
        page,
      });

      assets.push(...pageAssets.map((asset) => ({
        assetId: asset.asset,
        amount: BigInt(asset.quantity),
      })));

      hasMore = pageAssets.length === limit;
      page++;
    }

    return assets;
  }

  /**
   * Gets UTXOs for a transaction
   * @param txHash - The transaction hash to get UTXOs for
   * @returns Promise resolving to an array of UTXOs
   */
  async getTransactionUtxos(txHash: string): Promise<UTxO[]> {
    const tx = await this.api.txsUtxos(txHash);
    return tx.outputs.map((output) => ({
      txHash,
      index: output.output_index,
      address: output.address,
      amount: BigInt(output.amount[0].quantity),
      assets: output.amount.slice(1).map((asset) => ({
        assetId: asset.unit,
        amount: BigInt(asset.quantity),
      })),
    }));
  }

  /**
   * Gets addresses that own an asset
   * @param asset - The asset ID to get addresses for
   * @returns Promise resolving to an array of addresses
   */
  async getAssetAddresses(asset: string): Promise<string[]> {
    const addresses = await this.api.assetsAddresses(asset);
    return addresses.map((addr) => addr.address);
  }

  /**
   * Gets the history of a token
   * @param token - The token ID to get history for
   * @param limit - The maximum number of history entries to return
   * @param page - The page number to return
   * @returns Promise resolving to an array of history entries
   */
  async getTokenHistory(token: string, limit: number, page: number = 1): Promise<TokenHistoryEntry[]> {
    const history = await this.api.assetsHistory(token, { count: Math.min(limit, 100), page });
    const entries: TokenHistoryEntry[] = [];

    for (const tx of history) {
      const txDetails = await this.api.txs(tx.tx_hash);

      if (txDetails) {
        entries.push({
          txHash: tx.tx_hash,
          timestamp: txDetails.block_time * 1000,
          amount: BigInt(tx.amount),
        });
      }
    }

    return entries;
  }

  /**
   * Gets the number of confirmations for a transaction
   * @param txHash - The transaction hash to get confirmations for
   * @returns Promise resolving to the number of confirmations
   */
  async getConfirmations(txHash: string): Promise<number> {
    const tx = await this.api.txs(txHash);
    invariant(tx, "Transaction not found");

    const latestBlock = await this.api.blocksLatest();
    invariant(latestBlock, "Latest block not found");
    invariant(latestBlock.height !== null, "Latest block height is null");

    return latestBlock.height - tx.block_height + 1;
  }

  /**
   * Gets metadata for a transaction
   * @param txHash - The transaction hash to get metadata for
   * @returns Promise resolving to an array of metadata entries
   */
  async getMetadata(txHash: string): Promise<MetadataEntry[]> {
    const metadata = await this.api.txsMetadata(txHash);
    return metadata.map((entry) => ({
      label: entry.label,
      value:
        typeof entry.json_metadata === "string"
          ? JSON.parse(entry.json_metadata)
          : entry.json_metadata,
    }));
  }

  /**
   * Gets block information
   * @param hash - The block hash to get information for
   * @returns Promise resolving to block information
   */
  async getBlock(hash: string) {
    return this.api.blocks(hash);
  }

  /**
   * Gets the latest block
   * @returns Promise resolving to the latest block information
   */
  async getLatestBlock() {
    return this.api.blocksLatest();
  }

  /**
   * Gets block transactions
   * @param hash - The block hash to get transactions for
   * @returns Promise resolving to an array of transaction hashes
   */
  async getBlockTransactions(hash: string): Promise<string[]> {
    const txs = await this.api.blocksTxs(hash);
    return txs.map((tx) => (tx as unknown as { tx_hash: string }).tx_hash);
  }

  /**
   * Gets pool information
   * @param poolId - The pool ID to get information for
   * @returns Promise resolving to pool information
   */
  async getPool(poolId: string) {
    return this.api.poolsById(this.formatPoolId(poolId));
  }

  /**
   * Gets pool metadata
   * @param poolId - The pool ID to get metadata for
   * @returns Promise resolving to pool metadata
   */
  async getPoolMetadata(poolId: string) {
    return this.api.poolMetadata(this.formatPoolId(poolId));
  }

  /**
   * Gets pool history
   * @param poolId - The pool ID to get history for
   * @returns Promise resolving to pool history
   */
  async getPoolHistory(poolId: string) {
    return this.api.poolsByIdHistory(this.formatPoolId(poolId));
  }

  /**
   * Gets pool delegators
   * @param poolId - The pool ID to get delegators for
   * @returns Promise resolving to pool delegators
   */
  async getPoolDelegators(poolId: string) {
    return this.api.poolsByIdDelegators(this.formatPoolId(poolId));
  }

  /**
   * Gets epoch information
   * @param number - The epoch number to get information for
   * @returns Promise resolving to epoch information
   */
  async getEpoch(number: number) {
    return this.api.epochs(number);
  }

  /**
   * Gets the latest epoch
   * @returns Promise resolving to the latest epoch information
   */
  async getLatestEpoch() {
    return this.api.epochsLatest();
  }

  /**
   * Gets epoch parameters
   * @param number - The epoch number to get parameters for
   * @returns Promise resolving to epoch parameters
   */
  async getEpochParameters(number: number) {
    return this.api.epochsParameters(number);
  }

  /**
   * Gets network information
   * @returns Promise resolving to network information
   */
  async getNetworkInfo() {
    return this.api.network();
  }
}
