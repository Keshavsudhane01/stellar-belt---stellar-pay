# 🌟 StellarPay

![CI/CD](https://github.com/Keshavsudhane01/stellar-pay/actions/workflows/ci.yml/badge.svg)
![Tests](https://img.shields.io/badge/tests-28%20passing-brightgreen)
![Network](https://img.shields.io/badge/network-Stellar%20Testnet-blue)

> Stellar Testnet dApp — wallet connection, XLM payments,
> smart contracts, payment splitting, and live event streaming.

## 🔗 Live Demo
[https://stellar-pay.vercel.app](https://stellar-pay.vercel.app)

---

## 📖 Description

StellarPay lets you connect a Stellar wallet, view your XLM balance,
send payments, interact with Soroban smart contracts, split bills
between recipients, earn SDT reward tokens, and watch live on-chain
events — all on Stellar Testnet.

---

## 🚀 Setup

```bash
git clone https://github.com/Keshavsudhane01/stellar-pay.git
cd stellar-pay
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### .env.local

```env
NEXT_PUBLIC_STELLAR_NETWORK=TESTNET
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_SOROBAN_RPC=https://soroban-testnet.stellar.org
NEXT_PUBLIC_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
NEXT_PUBLIC_COUNTER_CONTRACT_ID=YOUR_COUNTER_ADDRESS
NEXT_PUBLIC_SDT_TOKEN_ADDRESS=YOUR_SDT_ADDRESS
NEXT_PUBLIC_PAYMENT_SPLITTER_ADDRESS=YOUR_SPLITTER_ADDRESS
NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS=YOUR_REWARD_ADDRESS
```

---

## 🔬 Contract Addresses

| Contract         | Address                           |
|------------------|-----------------------------------|
| Counter          | `YOUR_COUNTER_CONTRACT_ADDRESS`   |
| Payment Splitter | `YOUR_SPLITTER_CONTRACT_ADDRESS`  |
| Reward Contract  | `YOUR_REWARD_CONTRACT_ADDRESS`    |
| SDT Token        | `YOUR_SDT_TOKEN_ADDRESS`          |

---

## ✅ Verified Transactions

| Action             | Hash                    | Link |
|--------------------|-------------------------|------|
| Contract deployed  | `YOUR_DEPLOY_TX_HASH`   | [View](https://stellar.expert/explorer/testnet/tx/YOUR_DEPLOY_TX_HASH) |
| Counter increment  | `YOUR_INCREMENT_TX_HASH`| [View](https://stellar.expert/explorer/testnet/tx/YOUR_INCREMENT_TX_HASH) |
| Payment split      | `YOUR_SPLIT_TX_HASH`    | [View](https://stellar.expert/explorer/testnet/tx/YOUR_SPLIT_TX_HASH) |
| XLM sent           | `YOUR_SEND_TX_HASH`     | [View](https://stellar.expert/explorer/testnet/tx/YOUR_SEND_TX_HASH) |

---

## 🧪 Tests

```bash
npm test
npm run test:coverage
```

| Suite                    | Tests | Status     |
|--------------------------|-------|------------|
| stellar.test.ts          | 10    | ✅ Passing |
| transactions.test.ts     | 10    | ✅ Passing |
| BalanceCard.test.tsx     | 4     | ✅ Passing |
| SendPayment.test.tsx     | 4     | ✅ Passing |
| **Total**                | **28**| ✅ All Pass|

---

## 📸 Screenshots

### Wallet Connected
![Wallet Connected](./screenshots/wallet-connected.png)

### Balance Displayed
![Balance](./screenshots/wallet-connected.png)

### Transaction Success
![Transaction](./screenshots/tx-success.png)

### Wallet Options
![Wallet Picker](./screenshots/wallet-picker.png)

### Contract Interaction
![Contract](./screenshots/contract-interaction.png)

### Tests Passing
![Tests](./screenshots/tests-passing.png)

### Mobile View
![Mobile](./screenshots/mobile-view.png)

### CI/CD Pipeline
![CI/CD](./screenshots/cicd-passing.png)

---

## 🎥 Demo Video

[▶️ Watch 1-Minute Demo](https://loom.com/YOUR_LINK)

---

## ⚙️ CI/CD

GitHub Actions runs on every push:
lint → test → build → deploy to Vercel

**Required GitHub Secrets:**

| Secret              | Source                          |
|---------------------|---------------------------------|
| `VERCEL_TOKEN`      | vercel.com/account/tokens       |
| `VERCEL_ORG_ID`     | Vercel project settings         |
| `VERCEL_PROJECT_ID` | Vercel project settings         |

---

## 🛠️ Tech Stack

Next.js 14 · TypeScript · Tailwind CSS · @stellar/stellar-sdk ·
@creit-tech/stellar-wallets-kit · Soroban Rust Contracts ·
Jest · GitHub Actions · Vercel

---

*Built on Stellar Testnet · Not for real funds*
