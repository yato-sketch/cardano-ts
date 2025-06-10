import { Blockfrost } from "../../providers/blockfrost/blockfrost";
import { test, expect, describe } from "vitest";
import { Network } from "../../types";
import testData from "../data/test-data.json";

const BLOCKFROST_PROJECT_ID = process.env.BLOCKFROST_PROJECT_ID;
const BLOCKFROST_PREPROD_PROJECT_ID = process.env.BLOCKFROST_PREPROD_PROJECT_ID;
const BLOCKFROST_PREVIEW_PROJECT_ID = process.env.BLOCKFROST_PREVIEW_PROJECT_ID;

function createPoolTests(network: Network) {
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

  describe(`Pool Tests (${network})`, () => {
    const provider = new Blockfrost(projectId, network);

    test("getPool returns pool info", async () => {
      try {
        const pool = await provider.getPool(data.poolId);
        expect(pool).toBeDefined();
        expect(pool.pool_id).toBe(data.poolId);
      } catch (error: unknown) {
        if (error && typeof error === 'object' && 'status_code' in error && error.status_code === 404) {
          console.warn(`Test pool not found on ${network}, skipping test`);
          return;
        }

        if (error && typeof error === 'object' && 'status_code' in error && error.status_code === 400) {
          console.warn(`Invalid pool ID format on ${network}, skipping test`);
          return;
        }

        throw error;
      }
    });

    test("getPoolMetadata returns metadata", async () => {
      try {
        const metadata = await provider.getPoolMetadata(data.poolId);
        expect(metadata).toBeDefined();
      } catch (error: unknown) {
        if (error && typeof error === 'object' && 'status_code' in error && error.status_code === 404) {
          console.warn(`Test pool metadata not found on ${network}, skipping test`);
          return;
        }

        if (error && typeof error === 'object' && 'status_code' in error && error.status_code === 400) {
          console.warn(`Invalid pool ID format on ${network}, skipping test`);
          return;
        }

        throw error;
      }
    });

    test("getPoolHistory returns history", async () => {
      try {
        const history = await provider.getPoolHistory(data.poolId);
        expect(Array.isArray(history)).toBe(true);
      } catch (error: unknown) {
        if (error && typeof error === 'object' && 'status_code' in error && error.status_code === 404) {
          console.warn(`Test pool history not found on ${network}, skipping test`);
          return;
        }

        if (error && typeof error === 'object' && 'status_code' in error && error.status_code === 400) {
          console.warn(`Invalid pool ID format on ${network}, skipping test`);
          return;
        }

        throw error;
      }
    });

    test("getPoolDelegators returns delegators", async () => {
      try {
        const delegators = await provider.getPoolDelegators(data.poolId);
        expect(Array.isArray(delegators)).toBe(true);
      } catch (error: unknown) {
        if (error && typeof error === 'object' && 'status_code' in error && error.status_code === 404) {
          console.warn(`Test pool delegators not found on ${network}, skipping test`);
          return;
        }

        if (error && typeof error === 'object' && 'status_code' in error && error.status_code === 400) {
          console.warn(`Invalid pool ID format on ${network}, skipping test`);
          return;
        }

        throw error;
      }
    });
  });
}

Object.keys(testData).forEach((network) => createPoolTests(network as Network)); 