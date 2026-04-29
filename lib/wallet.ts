// lib/wallet.ts
import { type StellarWalletsKit as KitType } from "@creit.tech/stellar-wallets-kit"

let kitInstance: any = null;

// Helper to get the kit instance only on the client
async function getKit() {
  if (typeof window === "undefined") return null;
  
  if (!kitInstance) {
    const { StellarWalletsKit, Networks } = await import("@creit.tech/stellar-wallets-kit");
    const { FreighterModule, FREIGHTER_ID } = await import("@creit.tech/stellar-wallets-kit/modules/freighter");
    const { xBullModule } = await import("@creit.tech/stellar-wallets-kit/modules/xbull");
    const { AlbedoModule } = await import("@creit.tech/stellar-wallets-kit/modules/albedo");

    StellarWalletsKit.init({
      network: Networks.TESTNET,
      selectedWalletId: FREIGHTER_ID,
      modules: [
        new FreighterModule(),
        new xBullModule(),
        new AlbedoModule()
      ]
    });
    kitInstance = StellarWalletsKit;
  }
  return kitInstance;
}

export async function connectWallet(walletId: string) {
  const kit = await getKit();
  if (!kit) return null;
  
  kit.setWallet(walletId);
  return await kit.fetchAddress();
}

export async function signWithKit(transactionXDR: string, publicKey: string): Promise<string> {
  const kit = await getKit();
  if (!kit) throw new Error("Kit not initialized");

  const { Networks } = await import("@stellar/stellar-sdk");
  const { signedTxXdr } = await kit.signTransaction(transactionXDR, {
    networkPassphrase: Networks.TESTNET,
    address: publicKey
  });
  return signedTxXdr;
}

export async function disconnectKit(): Promise<void> {
  const kit = await getKit();
  if (kit) kit.disconnect();
  
  if (typeof window !== "undefined") {
    localStorage.removeItem("stellar_wallet_pk");
    localStorage.removeItem("stellar_wallet_id");
  }
}

// We still export the kit for legacy reasons, but it will be null on server
export const kit = typeof window !== "undefined" ? kitInstance : null;
