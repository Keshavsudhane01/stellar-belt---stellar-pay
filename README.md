# 🌟 StellarPay

![CI/CD](https://github.com/YOUR_USERNAME/stellar-pay/actions/workflows/ci.yml/badge.svg)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen)
![Network](https://img.shields.io/badge/network-Stellar%20Testnet-blue)
![License](https://img.shields.io/badge/license-MIT-green)

> A production-ready Stellar blockchain dApp built on Testnet.
> Connect your wallet, check balances, send XLM, interact with
> Soroban smart contracts, split payments, earn reward tokens,
> and watch live on-chain events.

---

## 🔗 Live Demo

[https://stellar-belt-stellar-pay-git-main-udhanekeshav28-5799s-projects.vercel.app](https://stellar-belt-stellar-pay-git-main-udhanekeshav28-5799s-projects.vercel.app)

---

## 📖 Project Description

StellarPay is a full-featured Stellar Testnet dApp that allows users
to connect multiple wallet providers, view their XLM balance, send
XLM transactions with memo support, interact with deployed Soroban
smart contracts, split payments between multiple recipients, earn
SDT reward tokens via inter-contract calls, and monitor live
on-chain events through a real-time activity feed.

Built with Next.js 14, TypeScript, Tailwind CSS, and the Stellar SDK.
Fully mobile responsive, covered by automated tests, and continuously
deployed via GitHub Actions to Vercel.

> ⚠️ Testnet only. No real funds are used.

---

## ⚙️ Setup Instructions

```bash
git clone https://github.com/YOUR_USERNAME/stellar-pay.git
cd stellar-pay
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

```env
NEXT_PUBLIC_STELLAR_NETWORK=TESTNET
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_SOROBAN_RPC=https://soroban-testnet.stellar.org
NEXT_PUBLIC_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
NEXT_PUBLIC_COUNTER_CONTRACT_ID=CDSDF3RZZ4TH2X2N4KJDT72P3AF2A4CLCVN3SXOKHUJ22SC7ZQIDQTFC
NEXT_PUBLIC_SDT_TOKEN_ADDRESS=CAU2U5ZTXVPCO7SJZGLES5444LKTFJ5QRBFVBUED22TUQ2JNU4PSDKWV
NEXT_PUBLIC_PAYMENT_SPLITTER_ADDRESS=CBTMVK7RTG6RHTQF2SDCFHXPDIULZBBIXVELUUFOBJPZJTDOSTBHBKHB
NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS=CDIS7IB6CSFWLDEOTGQ6KLGKHKOO4NGZ42HQDUXPE5WANS3VRH3BGLVB
```

### How to Use

1. Install [Freighter](https://www.freighter.app) browser extension
2. Switch Freighter to **Testnet** in extension settings
3. Click **Connect Wallet** and choose your wallet
4. Click **Fund with Testnet XLM** to get free funds
5. Use **Send XLM** to send payments
6. Use **Split Payment** to divide XLM between recipients
7. Click **Increment Counter** to interact with the smart contract
8. Watch the **Activity Feed** for live on-chain events

---

## 📸 Screenshots

### Wallet Options Available
![Wallet Picker](./screenshots/wallet-picker.png)

### Wallet Connected and Balance Displayed
![Wallet Connected](./screenshots/wallet-connected.png)

### Successful Testnet Transaction
![Transaction Success](./screenshots/tx-success.png)

### Transaction Result Shown to User
![Transaction Result](./screenshots/tx-result.png)

### Test Output
![Tests Passing](./screenshots/tests-passing.png)

### Mobile Responsive View
![Mobile](./screenshots/mobile.png)

### CI/CD Pipeline Running
![CI/CD](./screenshots/cicd.png)

---

## 🎥 Demo Video

[▶️ Watch 1-Minute Demo](https://loom.com/YOUR_LINK)

---

## 📋 Contract Addresses

| Contract         | Address                                                        |
|------------------|----------------------------------------------------------------|
| Counter          | `CDSDF3RZZ4TH2X2N4KJDT72P3AF2A4CLCVN3SXOKHUJ22SC7ZQIDQTFC` |
| Payment Splitter | `CBTMVK7RTG6RHTQF2SDCFHXPDIULZBBIXVELUUFOBJPZJTDOSTBHBKHB` |
| Reward Contract  | `CDIS7IB6CSFWLDEOTGQ6KLGKHKOO4NGZ42HQDUXPE5WANS3VRH3BGLVB` |
| SDT Token        | `CAU2U5ZTXVPCO7SJZGLES5444LKTFJ5QRBFVBUED22TUQ2JNU4PSDKWV` |

---

## ✅ Verified Transaction Hashes

| Action               | Hash                                                               | Explorer |
|----------------------|--------------------------------------------------------------------|----------|
| Counter deployed     | `40b2e68dfe3d1c242f2efe24abcdaa5fba1d20bbec6d1804847149073bf1c6d3` | [View ↗](https://stellar.expert/explorer/testnet/tx/40b2e68dfe3d1c242f2efe24abcdaa5fba1d20bbec6d1804847149073bf1c6d3) |
| Counter initialized  | `9772e26d888da39a19af6249beac83d156fa55c7daa30e27808a08704a0b2de9` | [View ↗](https://stellar.expert/explorer/testnet/tx/9772e26d888da39a19af6249beac83d156fa55c7daa30e27808a08704a0b2de9) |
| Reward deployed      | `4ed1239f513e1e7f27f767c675bbbdc43d177dd358fc0453689bba97effb7c96` | [View ↗](https://stellar.expert/explorer/testnet/tx/4ed1239f513e1e7f27f767c675bbbdc43d177dd358fc0453689bba97effb7c96) |
| Reward initialized   | `bdefa17ebe822f9a1a30af0aa997282339a7b7b3f1164a59de2fe4f5109d02bf` | [View ↗](https://stellar.expert/explorer/testnet/tx/bdefa17ebe822f9a1a30af0aa997282339a7b7b3f1164a59de2fe4f5109d02bf) |
| Splitter deployed    | `9ef4587139bb2072b2fbaa2418aa6837b1d5ae96b9c0dcd19367d5b3ca294cbf` | [View ↗](https://stellar.expert/explorer/testnet/tx/9ef4587139bb2072b2fbaa2418aa6837b1d5ae96b9c0dcd19367d5b3ca294cbf) |
| Splitter initialized | `295c2cf9061427e14d48c3cae59a73719fb6556fbe44fbf388898d4dfa66f2c6` | [View ↗](https://stellar.expert/explorer/testnet/tx/295c2cf9061427e14d48c3cae59a73719fb6556fbe44fbf388898d4dfa66f2c6) |
| SDT token deployed   | `403037850a87c860d472e139c2da0b3af2c3d106bad0283b2f6db01dfffd2887` | [View ↗](https://stellar.expert/explorer/testnet/tx/403037850a87c860d472e139c2da0b3af2c3d106bad0283b2f6db01dfffd2887) |

---

## 🧪 Running Tests

```bash
npm test
npm run test:coverage
```

---

## 🛠️ Tech Stack

| Layer           | Technology                      |
|-----------------|---------------------------------|
| Framework       | Next.js 14 + TypeScript         |
| Styling         | Tailwind CSS                    |
| Stellar SDK     | @stellar/stellar-sdk            |
| Wallet Kit      | @creit-tech/stellar-wallets-kit |
| Smart Contracts | Soroban — Rust                  |
| Testing         | Jest + React Testing Library    |
| CI/CD           | GitHub Actions                  |
| Deployment      | Vercel                          |

---

## 🌐 Network Info

| Property           | Value                                   |
|--------------------|-----------------------------------------|
| Network            | Testnet                                 |
| Horizon URL        | https://horizon-testnet.stellar.org     |
| Soroban RPC        | https://soroban-testnet.stellar.org     |
| Network Passphrase | Test SDF Network ; September 2015       |
| Friendbot          | https://friendbot.stellar.org           |
| Explorer           | https://stellar.expert/explorer/testnet |

---

*Built on Stellar Testnet · Not for real funds*
