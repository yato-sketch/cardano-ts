import { Blockfrost } from "@cardano-ts/node";
import { test } from "supertape";
import Wallet, { getAccountUtxos } from "wallet";

const projectId = process.env["BLOCKFROST_API_KEY"] || "";

if (!projectId) {
  console.error("BLOCKFROST_API_KEY must be set");
  process.exit(1);
}

const blockfrost = new Blockfrost(projectId);

test("getAccountUtxos: returns correct number of UTXOs", async (t) => {
  const utxos = await getAccountUtxos(
    blockfrost,
    "stake_test1uz7tnvcj8qy92r2mtlrxugwcnec6ck72c9gp5t5h3jd0qkshdk2kv"
  );
  t.equal(utxos.length, 63);
  t.end();
});

test(
  "fromSeed: no UTXOs in empty wallet",
  async (t) => {
    const wallet = await Wallet.fromSeed(
      blockfrost,
      "rare eagle hint busy hat client maple exact engage much fossil spatial organ clown bonus where error type cannon pink vocal sibling express gown"
    );
    t.equal(wallet.utxos.length, 0);
    t.end();
  },
  { timeout: 9000 }
);

test(
  "fromSeed: retrieves correct number of UTXOs",
  async (t) => {
    const wallet = await Wallet.fromSeed(
      blockfrost,
      "awful water dentist delay giggle cost angry shallow renew alien broom inspire use zone boat dolphin float brief picture trade resemble bullet position nurse"
    );
    t.equal(wallet.utxos.length, 6);
    t.end();
  },
  { timeout: 9000 }
);
