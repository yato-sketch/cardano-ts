import { Blockfrost } from "../../providers/blockfrost/blockfrost";
import { test, expect, describe } from "vitest";
import { Network } from "../../types";
import testData from "../data/test-data.json";

const BLOCKFROST_PROJECT_ID = process.env.BLOCKFROST_PROJECT_ID;
const BLOCKFROST_PREPROD_PROJECT_ID = process.env.BLOCKFROST_PREPROD_PROJECT_ID;
const BLOCKFROST_PREVIEW_PROJECT_ID = process.env.BLOCKFROST_PREVIEW_PROJECT_ID;

function createAssetTests(network: Network) {
  const data = testData[network];
  const projectId =
    network === "mainnet"
      ? BLOCKFROST_PROJECT_ID
      : network === "preprod"
        ? BLOCKFROST_PREPROD_PROJECT_ID
        : BLOCKFROST_PREVIEW_PROJECT_ID;

  if (!projectId) {
    console.warn(`Skipping ${network} tests: Missing project ID`);
    return;
  }

  describe(`Asset Tests (${network})`, () => {
    const provider = new Blockfrost(projectId, network);

    test("findToken returns address", async () => {
      try {
        const address = await provider.findToken(data.assetId);
        expect(address).toBeDefined();
        expect(
          address.startsWith(network === "mainnet" ? "addr1" : "addr_test")
        ).toBe(true);
      } catch (error: unknown) {
        if (
          error &&
          typeof error === "object" &&
          "status_code" in error &&
          error.status_code === 404
        ) {
          console.warn(`Test asset not found on ${network}, skipping test`);
          return;
        }

        throw error;
      }
    });

    test("findAllTokens returns tokens", async () => {
      try {
        const tokens = await provider.findAllTokens(data.assetId.slice(0, 56));
        expect(tokens.length).toBeGreaterThan(0);
      } catch (error: unknown) {
        if (
          error &&
          typeof error === "object" &&
          "status_code" in error &&
          error.status_code === 404
        ) {
          console.warn(`Test policy not found on ${network}, skipping test`);
          return;
        }

        throw error;
      }
    });

    test("getAssetAddresses returns addresses", async () => {
      try {
        const addresses = await provider.getAssetAddresses(data.assetId);
        expect(addresses.length).toBeGreaterThan(0);
      } catch (error: unknown) {
        if (
          error &&
          typeof error === "object" &&
          "status_code" in error &&
          error.status_code === 404
        ) {
          console.warn(`Test asset not found on ${network}, skipping test`);
          return;
        }

        throw error;
      }
    });

    test("getTokenHistory returns history", async () => {
      try {
        const history = await provider.getTokenHistory(data.assetId, 10);
        expect(history.length).toBeGreaterThan(0);
        expect(history[0].amount).toBeGreaterThan(0n);
      } catch (error: unknown) {
        if (
          error &&
          typeof error === "object" &&
          "status_code" in error &&
          error.status_code === 404
        ) {
          console.warn(`Test asset not found on ${network}, skipping test`);
          return;
        }

        throw error;
      }
    });
  });
}

Object.keys(testData).forEach((network) =>
  createAssetTests(network as Network)
);
