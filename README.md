# 🌟 StellarPay

![CI/CD](https://github.com/Keshavsudhane01/stellar-belt---stellar-pay/actions/workflows/ci.yml/badge.svg)
![Tests](https://img.shields.io/badge/tests-18%20passing-brightgreen)
![Network](https://img.shields.io/badge/network-Stellar%20Testnet-blue)
![License](https://img.shields.io/badge/license-MIT-green)

> A Stellar Testnet dApp with wallet connection, XLM payments,
> Soroban smart contracts, payment splitting, and live event streaming.

---

## 🔗 Live Demo

[https://stellar-pay.vercel.app](https://stellar-pay.vercel.app)

---

## 📖 Project Description

StellarPay is a full-featured Stellar Testnet dApp that allows users
to connect multiple wallet providers, view their XLM balance, send
XLM transactions with memo support, interact with deployed Soroban
smart contracts, split payments between multiple recipients, earn
SDT reward tokens via inter-contract calls, and monitor live
on-chain events through a real-time activity feed.

Built with Next.js 14, TypeScript, Tailwind CSS, and the Stellar SDK.
Fully mobile responsive, covered by 18 automated tests, and
continuously deployed via GitHub Actions to Vercel.

> ⚠️ Testnet only. No real funds are used.

---

## ⚙️ Setup Instructions

```bash
git clone https://github.com/Keshavsudhane01/stellar-belt---stellar-pay.git
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
NEXT_PUBLIC_COUNTER_CONTRACT_ID=YOUR_COUNTER_ADDRESS
NEXT_PUBLIC_SDT_TOKEN_ADDRESS=YOUR_SDT_ADDRESS
NEXT_PUBLIC_PAYMENT_SPLITTER_ADDRESS=YOUR_SPLITTER_ADDRESS
NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS=YOUR_REWARD_ADDRESS
```

---

## 📸 Screenshots

### Wallet Options Available
![Wallet Picker](./screenshots/wallet-picker.png)

### Wallet Connected State
![Wallet Connected](./screenshots/wallet-connected.png)

### Balance Displayed
![Balance](./screenshots/balance.png)

### Successful Testnet Transaction
![Transaction Success](./screenshots/tx-success.png)

### Transaction Result Shown to User
![Transaction Result](./screenshots/tx-result.png)

### Test Output — 18 Tests Passing
![Tests Passing](./screenshots/tests-passing.png)

### Mobile Responsive View
![Mobile View](./screenshots/mobile.png)

### CI/CD Pipeline Running
![CI/CD](./screenshots/cicd.png)

---

## 🎥 Demo Video

[▶️ Watch 1-Minute Demo](https://loom.com/YOUR_LINK)

---

## 📋 Contract Addresses

| Contract         | Address                            |
|------------------|------------------------------------|
| Counter          | `YOUR_COUNTER_CONTRACT_ADDRESS`    |
| Payment Splitter | `YOUR_SPLITTER_CONTRACT_ADDRESS`   |
| Reward Contract  | `YOUR_REWARD_CONTRACT_ADDRESS`     |
| SDT Token        | `YOUR_SDT_TOKEN_ADDRESS`           |

---

## ✅ Verified Transaction Hashes

| Action                        | Hash                        | Explorer                                                                          |
|-------------------------------|-----------------------------|-----------------------------------------------------------------------------------|
| Counter contract deployed     | `YOUR_DEPLOY_HASH`          | [View ↗](https://stellar.expert/explorer/testnet/tx/YOUR_DEPLOY_HASH)            |
| Counter increment called      | `YOUR_INCREMENT_HASH`       | [View ↗](https://stellar.expert/explorer/testnet/tx/YOUR_INCREMENT_HASH)         |
| Payment split executed        | `YOUR_SPLIT_HASH`           | [View ↗](https://stellar.expert/explorer/testnet/tx/YOUR_SPLIT_HASH)             |
| SDT token minted              | `YOUR_MINT_HASH`            | [View ↗](https://stellar.expert/explorer/testnet/tx/YOUR_MINT_HASH)              |
| XLM sent on testnet           | `YOUR_SEND_HASH`            | [View ↗](https://stellar.expert/explorer/testnet/tx/YOUR_SEND_HASH)              |

---

## 🧪 Running Tests

```bash
npm test
npm run test:coverage
```

| Suite                  | Tests | Status      |
|------------------------|-------|-------------|
| stellar.test.ts        | 6     | ✅ Passing  |
| transactions.test.ts   | 4     | ✅ Passing  |
| BalanceCard.test.tsx   | 4     | ✅ Passing  |
| SendPayment.test.tsx   | 4     | ✅ Passing  |
| **Total**              | **18**| ✅ All Pass |

---

## 🛠️ Tech Stack

| Layer           | Technology                         |
|-----------------|------------------------------------|
| Framework       | Next.js 14 + TypeScript            |
| Styling         | Tailwind CSS                       |
| Stellar SDK     | @stellar/stellar-sdk               |
| Wallet Kit      | @creit-tech/stellar-wallets-kit    |
| Smart Contracts | Soroban — Rust                     |
| Testing         | Jest + React Testing Library       |
| CI/CD           | GitHub Actions                     |
| Deployment      | Vercel                             |

---

*Built on Stellar Testnet · Not for real funds*
