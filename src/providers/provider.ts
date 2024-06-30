import { UTxO } from "@lucid-evolution/lucid";
import { OutRef } from "../types.js";

type Address = string;
type Asset = string;

type AssetAddress = {
  address: string;
  quantity: string;
};

type Provider = {
  network: "mainnet" | "preprod" | "preview";
  findAllTokens: (policyId: string) => Promise<Address[]>;
  findToken: (tokenId: string) => Promise<Address>;
  findTokensOf: (policyId: string) => Promise<Asset[]>;
  getStakedAddresses: (stakeKey: string) => Promise<Address[]>;
  getAssetAddresses: (assetId: string) => Promise<AssetAddress[]>;
  getTokenHistory: (tokenId: string, limit: number) => Promise<OutRef[]>;
  getUtxos: (address: string, paginate?: boolean) => Promise<UTxO[]>;
};

export default Provider;
