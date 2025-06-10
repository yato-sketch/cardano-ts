import { test, expect, describe } from "vitest";
import { Seed } from "../../core/seed";

describe("Seed Tests", () => {
  // Using a valid 12-word mnemonic
  const testPhrase = "neck trend supply announce because claw fiscal chimney initial popular flock congress drip mobile gun caution enjoy rely loud thing cruel devote demise garlic";
  const differentPhrase = "exit brisk private front neither gravity clay apple oxygen core royal sport voyage index tide feature public abuse suggest fog foot cabbage exact proud";

  test("creates seed with mainnet", () => {
    const seed = new Seed(testPhrase, "mainnet");
    expect(seed).toBeDefined();
    expect(seed.getAddress()).toBeDefined();
  });

  test("creates seed with preview", () => {
    const seed = new Seed(testPhrase, "preview");
    expect(seed).toBeDefined();
    expect(seed.getAddress()).toBeDefined();
  });

  test("generates same address for same phrase and network", () => {
    const seed1 = new Seed(testPhrase, "mainnet");
    const seed2 = new Seed(testPhrase, "mainnet");
    
    expect(seed1.getAddress()).toBe(seed2.getAddress());
  });

  test("generates different addresses for different networks", () => {
    const seed1 = new Seed(testPhrase, "mainnet");
    const seed2 = new Seed(testPhrase, "preview");
    
    expect(seed1.getAddress()).not.toBe(seed2.getAddress());
  });

  test("generates different addresses for different phrases", () => {
    const seed1 = new Seed(testPhrase, "mainnet");
    const seed2 = new Seed(differentPhrase, "mainnet");
    
    expect(seed1.getAddress()).not.toBe(seed2.getAddress());
  });

  test("gets private key", () => {
    const seed = new Seed(testPhrase, "mainnet");
    const privateKey = seed.getPrivateKey();
    expect(privateKey).toBeDefined();
  });

  test("gets different private keys for different derivatives", () => {
    const seed = new Seed(testPhrase, "mainnet");
    const privateKey1 = seed.getPrivateKey(0);
    const privateKey2 = seed.getPrivateKey(1);
    
    expect(privateKey1).not.toBe(privateKey2);
  });

  test("gets different private keys for different indices", () => {
    const seed = new Seed(testPhrase, "mainnet");
    const privateKey1 = seed.getPrivateKey(0, 0);
    const privateKey2 = seed.getPrivateKey(0, 1);
    
    expect(privateKey1).not.toBe(privateKey2);
  });

  test("throws error for invalid phrase", () => {
    expect(() => new Seed("invalid phrase", "mainnet")).toThrow();
  });

  test("throws error for empty phrase", () => {
    expect(() => new Seed("", "mainnet")).toThrow();
  });
}); 