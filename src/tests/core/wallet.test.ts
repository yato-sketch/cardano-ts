import { describe, test, expect } from "vitest";
import { Wallet } from "../../core/wallet";
import { Blockfrost } from "../../providers/blockfrost/blockfrost";

describe("Wallet Tests", () => {
  const testAddress =
    "addr_test1qrs5c09t4gmeyluma5p4pj8gy6vuz0vc3wmcrqawldtpqwyqlm5t90unu8ccfhshhcn95384cpn63vftkxdlr7fqed9qm5vgc0";
  const testStakeAddress =
    "stake_test1uzq0a69jh7f7ruvymctmufj6gn6uqeagky4mrxl3lysvkjsk40lhj";
  const projectId =
    process.env.BLOCKFROST_PREVIEW_PROJECT_ID || "test_project_id";

  test("creates wallet with provider and address", () => {
    const provider = new Blockfrost(projectId, "preview");
    const wallet = new Wallet(provider, testAddress);
    expect(wallet).toBeDefined();
    expect(wallet.getAddress()).toBe(testAddress);
  });

  test("gets UTXOs", async () => {
    const provider = new Blockfrost(projectId, "preview");
    const wallet = new Wallet(provider, testAddress);

    try {
      const utxos = await wallet.getUtxos();
      expect(Array.isArray(utxos)).toBe(true);
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "status_code" in error &&
        error.status_code === 404
      ) {
        console.warn("Address not found, skipping test");
        return;
      }

      throw error;
    }
  });

  test("gets balance", async () => {
    const provider = new Blockfrost(projectId, "preview");
    const wallet = new Wallet(provider, testAddress);

    try {
      const balance = await wallet.getBalance();
      expect(typeof balance).toBe("bigint");
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "status_code" in error &&
        error.status_code === 404
      ) {
        console.warn("Address not found, skipping test");
        return;
      }

      throw error;
    }
  });

  test("gets assets", async () => {
    const provider = new Blockfrost(projectId, "preview");
    const wallet = new Wallet(provider, testAddress);

    try {
      const assets = await wallet.getAssets();
      expect(Array.isArray(assets)).toBe(true);
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "status_code" in error &&
        error.status_code === 404
      ) {
        console.warn("Address not found, skipping test");
        return;
      }

      throw error;
    }
  });

  test("gets asset balance", async () => {
    const provider = new Blockfrost(projectId, "preview");
    const wallet = new Wallet(provider, testAddress);
    const assetId =
      "065270479316f1d92e00f7f9f095ebeaac9d009c878dc35ce36d3404484f534b5974";

    try {
      const balance = await wallet.getAssetBalance(assetId);
      expect(typeof balance).toBe("bigint");
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "status_code" in error &&
        error.status_code === 404
      ) {
        console.warn("Address or asset not found, skipping test");
        return;
      }

      throw error;
    }
  });

  test("checks balance", async () => {
    const provider = new Blockfrost(projectId, "preview");
    const wallet = new Wallet(provider, testAddress);

    try {
      const hasBalance = await wallet.hasBalance(1000n);
      expect(typeof hasBalance).toBe("boolean");
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "status_code" in error &&
        error.status_code === 404
      ) {
        console.warn("Address not found, skipping test");
        return;
      }

      throw error;
    }
  });

  test("checks asset balance", async () => {
    const provider = new Blockfrost(projectId, "preview");
    const wallet = new Wallet(provider, testAddress);
    const assetId =
      "065270479316f1d92e00f7f9f095ebeaac9d009c878dc35ce36d3404484f534b5974";

    try {
      const hasAsset = await wallet.hasAsset(assetId, 1n);
      expect(typeof hasAsset).toBe("boolean");
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "status_code" in error &&
        error.status_code === 404
      ) {
        console.warn("Address or asset not found, skipping test");
        return;
      }

      throw error;
    }
  });

  test("gets staked addresses", async () => {
    const provider = new Blockfrost(projectId, "preview");
    const wallet = new Wallet(provider, testStakeAddress);

    try {
      const stakedAddresses = await wallet.getStakedAddresses();
      expect(Array.isArray(stakedAddresses)).toBe(true);
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "status_code" in error &&
        error.status_code === 404
      ) {
        console.warn("Stake address not found, skipping test");
        return;
      }

      throw error;
    }
  });

  test("gets asset history", async () => {
    const provider = new Blockfrost(projectId, "preview");
    const wallet = new Wallet(provider, testAddress);
    const assetId =
      "065270479316f1d92e00f7f9f095ebeaac9d009c878dc35ce36d3404484f534b5974";

    try {
      const history = await wallet.getAssetHistory(assetId);
      expect(Array.isArray(history)).toBe(true);
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "status_code" in error &&
        error.status_code === 404
      ) {
        console.warn("Address or asset not found, skipping test");
        return;
      }

      throw error;
    }
  });
});
