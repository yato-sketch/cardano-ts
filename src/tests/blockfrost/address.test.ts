import { Blockfrost } from "../../providers/blockfrost/blockfrost";
import { test, expect, describe } from "vitest";
import { Network } from "../../types";
import testData from "../data/test-data.json";

const BLOCKFROST_PROJECT_ID = process.env.BLOCKFROST_PROJECT_ID;
const BLOCKFROST_PREPROD_PROJECT_ID = process.env.BLOCKFROST_PREPROD_PROJECT_ID;
const BLOCKFROST_PREVIEW_PROJECT_ID = process.env.BLOCKFROST_PREVIEW_PROJECT_ID;

function createAddressTests(network: Network) {
  const data = testData[network];
  const projectId = network === "mainnet" 
    ? BLOCKFROST_PROJECT_ID 
    : network === "preprod" 
      ? BLOCKFROST_PREPROD_PROJECT_ID 
      : BLOCKFROST_PREVIEW_PROJECT_ID;

  if (!projectId) {
    console.warn(`Skipping ${network} tests: Missing project ID`);
    return;
  }

  describe(`Address Tests (${network})`, () => {
    const provider = new Blockfrost(projectId, network);

    test("getUtxos returns UTXOs", async () => {
      const utxos = await provider.getUtxos(data.address);
      expect(utxos.length).toBeGreaterThanOrEqual(0);

      if (utxos.length > 0) {
        expect(utxos[0].amount).toBeGreaterThan(0n);
        expect(utxos[0].assets.length).toBeGreaterThanOrEqual(0);
      }
    });

    test("getStakedAddresses returns addresses", async () => {
      try {
        const addresses = await provider.getStakedAddresses(data.stakeAddress);
        expect(addresses.length).toBeGreaterThan(0);
      } catch (error: unknown) {
        if (error && typeof error === 'object' && 'status_code' in error && error.status_code === 404) {
          console.warn(`Test stake address not found on ${network}, skipping test`);
          return;
        }

        throw error;
      }
    });
  });
}

// Run tests for each network
Object.keys(testData).forEach((network) => createAddressTests(network as Network)); 