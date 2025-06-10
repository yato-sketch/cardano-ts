import { Blockfrost } from "../../providers/blockfrost/blockfrost";
import { test, expect, describe } from "vitest";
import { Network } from "../../types";
import testData from "../data/test-data.json";

const BLOCKFROST_PROJECT_ID = process.env.BLOCKFROST_PROJECT_ID;
const BLOCKFROST_PREPROD_PROJECT_ID = process.env.BLOCKFROST_PREPROD_PROJECT_ID;
const BLOCKFROST_PREVIEW_PROJECT_ID = process.env.BLOCKFROST_PREVIEW_PROJECT_ID;

function createBlockTests(network: Network) {
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

  describe(`Block Tests (${network})`, () => {
    const provider = new Blockfrost(projectId, network);

    test("getLatestBlock returns block info", async () => {
      const block = await provider.getLatestBlock();
      expect(block).toBeDefined();
      expect(block.hash).toBeDefined();
      expect(block.height).toBeGreaterThan(0);
    });

    test("getBlock returns block info", async () => {
      const latestBlock = await provider.getLatestBlock();
      const block = await provider.getBlock(latestBlock.hash);
      expect(block).toBeDefined();
      expect(block.hash).toBe(latestBlock.hash);
    });

    test("getBlockTransactions returns transactions", async () => {
      const latestBlock = await provider.getLatestBlock();
      const transactions = await provider.getBlockTransactions(latestBlock.hash);
      expect(Array.isArray(transactions)).toBe(true);
    });

    test("getConfirmations returns confirmations", async () => {
      try {
        const confirmations = await provider.getConfirmations(data.txHash);
        expect(confirmations).toBeGreaterThan(0);
      } catch (error: unknown) {
        if (error && typeof error === 'object' && 'status_code' in error && error.status_code === 404) {
          console.warn(`Transaction not found on ${network}, skipping test`);
          return;
        }

        throw error;
      }
    });

    test("getMetadata returns metadata", async () => {
      try {
        const metadata = await provider.getMetadata(data.txHash);
        expect(Array.isArray(metadata)).toBe(true);
      } catch (error: unknown) {
        if (error && typeof error === 'object' && 'status_code' in error && error.status_code === 404) {
          console.warn(`Transaction metadata not found on ${network}, skipping test`);
          return;
        }

        throw error;
      }
    });
  });
}

// Run tests for each network
Object.keys(testData).forEach((network) => createBlockTests(network as Network)); 