import {
  StellarWalletsKit,
  Networks,
} from "@creit.tech/stellar-wallets-kit"
import { FREIGHTER_ID, FreighterModule } from "@creit.tech/stellar-wallets-kit/modules/freighter"
import { XBULL_ID, xBullModule } from "@creit.tech/stellar-wallets-kit/modules/xbull"
import { ALBEDO_ID, AlbedoModule } from "@creit.tech/stellar-wallets-kit/modules/albedo"
import { Networks as StellarNetworks } from "@stellar/stellar-sdk"

// Initialize the kit statically
StellarWalletsKit.init({
  network: Networks.TESTNET,
  selectedWalletId: FREIGHTER_ID,
  modules: [
    new FreighterModule(),
    new xBullModule(),
    new AlbedoModule()
  ]
})

export const kit = StellarWalletsKit

export async function signWithKit(transactionXDR: string, publicKey: string): Promise<string> {
  const { signedTxXdr } = await kit.signTransaction(transactionXDR, {
    networkPassphrase: StellarNetworks.TESTNET,
    address: publicKey
  })
  return signedTxXdr
}

export function disconnectKit(): void {
  kit.disconnect()
  localStorage.removeItem("stellar_wallet_pk")
  localStorage.removeItem("stellar_wallet_id")
}
