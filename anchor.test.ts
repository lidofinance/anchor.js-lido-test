import {
  AddressProviderFromJson,
  Anchor,
  queryHubWithdrawable,
  queryRewardHolder,
} from "@anchor-protocol/anchor.js";
import { LCDClient, MnemonicKey, Wallet } from "@terra-money/terra.js";
import { contractAddresses } from "./config";

import dotenv from "dotenv";
dotenv.config();
const addressProvider = new AddressProviderFromJson(contractAddresses);

describe("Anchor", () => {
  let lcd: LCDClient;
  let anchor: Anchor;
  let wallet: Wallet;
  let key: MnemonicKey;
  beforeEach(async () => {
    lcd = new LCDClient({
      URL: "https://bombay-lcd.terra.dev",
      chainID: "bombay-12",
    });

    key = new MnemonicKey({
      mnemonic: process.env.WALLET_MNEMONIC,
    });
    wallet = new Wallet(lcd, key);
    anchor = new Anchor(lcd, addressProvider);
  });
  test("Mint: run", async () => {
    const msgs = await anchor.bluna
      .mint({ amount: "1", validator: "doesn't matter" })
      .generateWithWallet(wallet);

    const tx = await wallet.createAndSignTx({
      msgs,
    });
    const res = await lcd.tx.broadcast(tx);
    expect(res.txhash).toBeDefined();
  });
  test("Burn: run", async () => {
    const msgs = await anchor.bluna
      .burn({ amount: "1" })
      .generateWithWallet(wallet);
    const tx = await wallet.createAndSignTx({
      msgs,
    });
    const res = await lcd.tx.broadcast(tx);
    expect(res.txhash).toBeDefined();
  });
  test("Claim: get pending claim amount", async () => {
    const out = await queryRewardHolder({ lcd, address: key.accAddress })(
      addressProvider
    );
    expect(out.balance).toBeDefined();
    expect(out.pending_rewards).toBeDefined();
    expect(Number(out.balance)).toBeGreaterThan(0);
    expect(Number(out.pending_rewards)).toBeGreaterThan(0);
  });
  test("Claim: run", async () => {
    const msgs = await anchor.bluna.claim({}).generateWithWallet(wallet);
    const tx = await wallet.createAndSignTx({
      msgs,
    });
    const res = await lcd.tx.broadcast(tx);
    expect(res.txhash).toBeDefined();
  });
  test("Withdraw: list of pending withdraws", async () => {
    const out = await queryHubWithdrawable({
      lcd,
      address: key.accAddress,
      block_time: Date.now(),
    })(addressProvider);
    expect(out.withdrawable).toBeDefined();
    expect(!Number.isNaN(Number(out.withdrawable))).toBeTruthy();
    expect(Number(out.withdrawable)).toBeGreaterThan(0);
  });
  test("Withdraw: run", async () => {
    const msgs = await anchor.bluna.withdraw().generateWithWallet(wallet);
    const tx = await wallet.createAndSignTx({
      msgs,
    });
    const res = await lcd.tx.broadcast(tx);
    expect(res.txhash).toBeDefined();
  });
  test("Instant: run", async () => {
    const msgs = await anchor.bluna
      .instantBurn({ amount: "1" })
      .generateWithWallet(wallet);

    const tx = await wallet.createAndSignTx({ msgs });
    const res = await lcd.tx.broadcast(tx);
    expect(res.txhash).toBeDefined();
  });
});
