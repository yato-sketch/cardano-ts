import C from "@anastasia-labs/cardano-multiplatform-lib-nodejs";
import { fromHex } from "@harmoniclabs/uint8array-utils";
import { mnemonicToEntropy, validateMnemonic } from "bip39";
import { Network } from "../types";
import { invariant } from "../utils/invariant";

/**
 * Gets the account key from a seed phrase
 * @param seed - The seed phrase
 * @returns The account key
 */
const getAccountKeyFromSeed = (seed: string) =>
  C.Bip32PrivateKey.from_bip39_entropy(
    fromHex(mnemonicToEntropy(seed)),
    new Uint8Array()
  )
    .derive(2147485500)
    .derive(2147485463)
    .derive(2147483648);

/**
 * Gets an address from a seed phrase
 * @param seed - The seed phrase
 * @param network - The network to use (default: mainnet)
 * @param index - The address index (default: 0)
 * @param includeStakeKey - Whether to include a stake key (default: true)
 * @returns The bech32 encoded address
 */
const getAddressFromSeed = (
  seed: string,
  network: Network = "mainnet",
  index: number = 0,
  includeStakeKey: boolean = true
) => {
  const accountKey = getAccountKeyFromSeed(seed);
  const paymentKey = accountKey.derive(0).derive(index).to_raw_key();
  const stakeKey = accountKey.derive(2).derive(index).to_raw_key();
  const paymentKeyHash = paymentKey.to_public().hash();
  const stakeKeyHash = stakeKey.to_public().hash();

  if (includeStakeKey)
    return C.BaseAddress.new(
      network === "mainnet" ? 1 : 0,
      C.Credential.new_pub_key(paymentKeyHash),
      C.Credential.new_pub_key(stakeKeyHash)
    )
      .to_address()
      .to_bech32(undefined);

  return C.EnterpriseAddress.new(
    network === "mainnet" ? 1 : 0,
    C.Credential.new_pub_key(paymentKeyHash)
  )
    .to_address()
    .to_bech32(undefined);
};

/**
 * Gets a private key from a seed phrase
 * @param seed - The seed phrase
 * @param derivative - The derivative path (default: 0)
 * @param index - The key index (default: 0)
 * @returns The bech32 encoded private key
 */
const getPrivateKeyFromSeed = (
  seed: string,
  derivative: number = 0,
  index: number = 0
): string => {
  const accountKey = getAccountKeyFromSeed(seed);
  return accountKey.derive(derivative).derive(index).to_raw_key().to_bech32();
};

/**
 * Represents a Cardano seed with associated functionality
 */
export class Seed {
  constructor(
    private readonly phrase: string,
    private readonly network: "mainnet" | "preview" | "preprod"
  ) {
    invariant(phrase.length > 0, "Seed phrase cannot be empty");
    invariant(validateMnemonic(phrase), "Invalid seed phrase");
  }

  /**
   * Gets the address associated with this seed
   * @returns The bech32 encoded address
   */
  getAddress(): string {
    return getAddressFromSeed(this.phrase, this.network);
  }

  /**
   * Gets the private key associated with this seed
   * @param derivative - The derivative path (default: 0)
   * @param index - The key index (default: 0)
   * @returns The bech32 encoded private key
   */
  getPrivateKey(derivative: number = 0, index: number = 0): string {
    return getPrivateKeyFromSeed(this.phrase, derivative, index);
  }
}
