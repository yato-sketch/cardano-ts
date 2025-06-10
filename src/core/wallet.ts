import { Provider, Asset, UTxO, TokenHistoryEntry } from "../types";

/**
 * Represents a Cardano wallet with basic functionality
 */
export class Wallet {
  private provider: Provider;
  private address: string;

  /**
   * Creates a new wallet instance
   * @param provider The provider to use for blockchain interactions
   * @param address The wallet's address
   */
  constructor(provider: Provider, address: string) {
    this.provider = provider;
    this.address = address;
  }

  /**
   * Gets the wallet's address
   */
  getAddress(): string {
    return this.address;
  }

  /**
   * Gets all UTXOs for the wallet
   */
  async getUtxos(): Promise<UTxO[]> {
    return this.provider.getUtxos(this.address);
  }

  /**
   * Gets the total balance of the wallet
   */
  async getBalance(): Promise<bigint> {
    const utxos = await this.getUtxos();
    return utxos.reduce((total, utxo) => total + utxo.amount, 0n);
  }

  /**
   * Gets all assets owned by the wallet
   */
  async getAssets(): Promise<Asset[]> {
    const utxos = await this.getUtxos();
    const assets = new Map<string, bigint>();

    for (const utxo of utxos) {
      for (const asset of utxo.assets) {
        const current = assets.get(asset.assetId) || 0n;
        assets.set(asset.assetId, current + asset.amount);
      }
    }

    return Array.from(assets.entries()).map(([assetId, amount]) => ({
      assetId,
      amount,
    }));
  }

  /**
   * Gets the balance of a specific asset
   * @param assetId The asset ID to check
   */
  async getAssetBalance(assetId: string): Promise<bigint> {
    const assets = await this.getAssets();
    const asset = assets.find((a) => a.assetId === assetId);
    return asset?.amount || 0n;
  }

  /**
   * Checks if the wallet has enough balance for a given amount
   * @param amount The amount to check
   */
  async hasBalance(amount: bigint): Promise<boolean> {
    const balance = await this.getBalance();
    return balance >= amount;
  }

  /**
   * Checks if the wallet has enough of a specific asset
   * @param assetId The asset ID to check
   * @param amount The amount to check
   */
  async hasAsset(assetId: string, amount: bigint): Promise<boolean> {
    const balance = await this.getAssetBalance(assetId);
    return balance >= amount;
  }

  /**
   * Gets the staked addresses associated with this wallet
   */
  async getStakedAddresses(): Promise<string[]> {
    return this.provider.getStakedAddresses(this.address);
  }

  /**
   * Gets the transaction history for a specific asset
   * @param assetId The asset ID to get history for
   * @param limit The maximum number of entries to return
   */
  async getAssetHistory(assetId: string, limit: number = 10): Promise<TokenHistoryEntry[]> {
    return this.provider.getTokenHistory(assetId, limit);
  }
} 