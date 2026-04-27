# 🌟 StellarPay

![CI/CD](https://github.com/Keshavsudhane01/stellar-pay/actions/workflows/ci.yml/badge.svg)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen)
![Network](https://img.shields.io/badge/network-Stellar%20Testnet-blue)
![License](https://img.shields.io/badge/license-MIT-green)

> A production-ready Stellar blockchain dApp built on Testnet.
> Connect your wallet, check balances, send XLM, interact with
> smart contracts, split payments, earn reward tokens, and watch
> live on-chain events — all in one app.

---

## 🔴 Live Demo

[https://stellar-pay.vercel.app](https://stellar-pay.vercel.app)

---

## 📖 Description

StellarPay is a full-featured Stellar Testnet dApp that lets users
connect multiple wallets, view XLM balances, send payments, interact
with deployed Soroban smart contracts, split bills between multiple
recipients, earn SDT reward tokens through inter-contract calls, and
monitor live blockchain events through a real-time activity feed.

The app is fully mobile responsive, tested with 28+ automated tests,
and deployed via a GitHub Actions CI/CD pipeline to Vercel.

> ⚠️ Testnet only. No real funds are used or required.

---

## ✨ Features

- Multi-wallet connection: Freighter, xBull, Albedo
- XLM balance display with auto-refresh every 15 seconds
- Send XLM with destination, amount, and optional memo
- One-click Testnet faucet funding via Friendbot
- On-chain counter smart contract (Soroban)
- Payment splitter with inter-contract reward minting
- Custom SDT reward token (SEP-0041 standard)
- Real-time on-chain event streaming and activity feed
- Transaction status tracking: Pending → Success / Failed
- 3 typed error handlers: wallet not found, user rejected, insufficient balance
- In-memory caching with TTL for balance and transaction data
- Optimistic UI updates for instant feedback
- Skeleton loading states across all async components
- Full mobile responsive layout
- GitHub Actions CI/CD with auto-deploy to Vercel

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Stellar SDK | @stellar/stellar-sdk |
| Wallet Kit | @creit-tech/stellar-wallets-kit |
| Smart Contracts | Soroban (Rust) |
| Testing | Jest + React Testing Library |
| CI/CD | GitHub Actions |
| Deployment | Vercel |

---

## 📦 Setup Instructions

### Prerequisites

- Node.js 18 or higher
- Freighter, xBull, or Albedo wallet browser extension
- Rust + Stellar CLI (only needed if redeploying contracts)

### Install and Run Locally

```bash
# Clone the repository
git clone https://github.com/Keshavsudhane01/stellar-pay.git

# Move into the project folder
cd stellar-pay

# Install all dependencies
npm install

# Copy the environment variables file
cp .env.example .env.local

# Open .env.local and fill in your contract addresses
# (pre-filled values are provided below in Contract Addresses section)

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file in the root with these values:

```env
NEXT_PUBLIC_STELLAR_NETWORK=TESTNET
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_SOROBAN_RPC=https://soroban-testnet.stellar.org
NEXT_PUBLIC_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
NEXT_PUBLIC_COUNTER_CONTRACT_ID=YOUR_COUNTER_CONTRACT_ADDRESS
NEXT_PUBLIC_SDT_TOKEN_ADDRESS=YOUR_SDT_TOKEN_ADDRESS
NEXT_PUBLIC_PAYMENT_SPLITTER_ADDRESS=YOUR_SPLITTER_ADDRESS
NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS=YOUR_REWARD_ADDRESS
```

### How to Use the App

1. Install [Freighter](https://www.freighter.app) browser extension
2. Switch Freighter network to Testnet
3. Open the app and click **Connect Wallet**
4. Choose your wallet from the picker modal
5. Click **Fund with Testnet XLM** to get free testnet funds
6. Use **Send XLM** to send payments to any Stellar Testnet address
7. Use **Split Payment** to divide XLM between multiple recipients
8. Click **Increment Counter** to interact with the smart contract
9. Watch live events appear in the **Activity Feed**

---

## 🔬 Smart Contract Addresses

All contracts are deployed on Stellar Testnet.

| Contract | Address |
|---|---|
| Counter Contract | `YOUR_COUNTER_CONTRACT_ADDRESS` |
| Payment Splitter | `YOUR_SPLITTER_CONTRACT_ADDRESS` |
| Reward Contract | `YOUR_REWARD_CONTRACT_ADDRESS` |
| SDT Token (SEP-0041) | `YOUR_SDT_TOKEN_ADDRESS` |

View all contracts on
[Stellar Expert Testnet](https://stellar.expert/explorer/testnet)

---

## ✅ Verified Transactions

| Action | Transaction Hash | Explorer Link |
|---|---|---|
| Counter contract deployed | `YOUR_DEPLOY_TX_HASH` | [View](https://stellar.expert/explorer/testnet/tx/YOUR_DEPLOY_TX_HASH) |
| Counter increment called | `YOUR_INCREMENT_TX_HASH` | [View](https://stellar.expert/explorer/testnet/tx/YOUR_INCREMENT_TX_HASH) |
| Payment split executed | `YOUR_SPLIT_TX_HASH` | [View](https://stellar.expert/explorer/testnet/tx/YOUR_SPLIT_TX_HASH) |
| SDT token minted | `YOUR_MINT_TX_HASH` | [View](https://stellar.expert/explorer/testnet/tx/YOUR_MINT_TX_HASH) |
| XLM sent (sample) | `YOUR_SEND_TX_HASH` | [View](https://stellar.expert/explorer/testnet/tx/YOUR_SEND_TX_HASH) |

---

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Run in watch mode during development
npm run test:watch
```

### Test Coverage Summary

| Test File | Tests | Status |
|---|---|---|
| `stellar.test.ts` | 10 tests | ✅ Passing |
| `transactions.test.ts` | 10 tests | ✅ Passing |
| `BalanceCard.test.tsx` | 4 tests | ✅ Passing |
| `SendPayment.test.tsx` | 4 tests | ✅ Passing |
| **Total** | **28 tests** | ✅ All Passing |

---

## 📸 Screenshots

### Wallet Connection

> Shows the multi-wallet picker modal with Freighter, xBull, and Albedo options

![Wallet Picker](./screenshots/wallet-picker.png)

### Wallet Connected and Balance

> Shows connected wallet address, XLM balance, and network badge

![Wallet Connected](./screenshots/wallet-connected.png)

### Send XLM

> Shows the payment form with destination, amount, memo fields and validation

![Send Payment](./screenshots/send-payment.png)

### Transaction Success

> Shows the success state with transaction hash linked to Stellar Expert

![Transaction Success](./screenshots/tx-success.png)

### Smart Contract Interaction

> Shows the on-chain counter with increment button and contract address

![Contract Interaction](./screenshots/contract-interaction.png)

### Payment Splitter

> Shows the split payment form with multiple recipients and SDT reward preview

![Payment Splitter](./screenshots/payment-splitter.png)

### Activity Feed

> Shows live on-chain events streaming in real time with type, hash, and time

![Activity Feed](./screenshots/activity-feed.png)

### Test Output

> Shows terminal output with all 28 tests passing and coverage report

![Tests Passing](./screenshots/tests-passing.png)

### Mobile Responsive View

> Shows the app layout on a 375px mobile screen

![Mobile View](./screenshots/mobile-view.png)

### CI/CD Pipeline

> Shows GitHub Actions workflow with all jobs passing (lint, test, build, deploy)

![CI/CD Passing](./screenshots/cicd-passing.png)

---

## 🎥 Demo Video

Watch the full 1-minute walkthrough here:

[▶️ Watch Demo on Loom](https://loom.com/YOUR_DEMO_LINK)

The demo covers:
- Connecting a wallet and funding via Faucet
- Viewing and refreshing XLM balance
- Sending an XLM transaction and viewing the hash
- Incrementing the on-chain counter
- Splitting a payment between 3 recipients
- Earning SDT reward tokens
- Watching the live activity feed update in real time

---

## 🗂️ Project Structure

```
stellar-pay/
├── .github/
│   └── workflows/
│       ├── ci.yml              # Main CI/CD pipeline
│       └── pr-checks.yml       # Pull request checks
├── app/
│   ├── layout.tsx              # Root layout with WalletProvider
│   ├── page.tsx                # Main dashboard page
│   └── globals.css             # Global styles
├── components/
│   ├── WalletButton.tsx        # Connect/disconnect button
│   ├── WalletModal.tsx         # Multi-wallet picker modal
│   ├── BalanceCard.tsx         # XLM balance display
│   ├── FaucetButton.tsx        # Testnet faucet funding
│   ├── SendPayment.tsx         # XLM payment form
│   ├── TransactionList.tsx     # Recent transactions
│   ├── TransactionStatus.tsx   # Live tx status tracker
│   ├── ContractInteraction.tsx # Soroban counter contract UI
│   ├── PaymentSplitter.tsx     # Split payment with rewards
│   ├── ActivityFeed.tsx        # Real-time event stream
│   ├── MobileMenu.tsx          # Mobile navigation drawer
│   └── ErrorBoundary.tsx       # React error boundary
├── lib/
│   ├── stellar.ts              # Horizon API functions
│   ├── wallet.ts               # StellarWalletsKit integration
│   ├── transactions.ts         # Transaction builder
│   ├── soroban.ts              # Soroban contract calls
│   ├── errors.ts               # Typed error classes
│   ├── cache.ts                # In-memory TTL cache
│   └── eventStream.ts          # Real-time event polling
├── context/
│   └── WalletContext.tsx       # Global wallet state
├── contracts/
│   ├── counter/                # On-chain counter contract
│   │   ├── src/lib.rs
│   │   └── Cargo.toml
│   ├── payment_splitter/       # Split payment contract
│   │   ├── src/lib.rs
│   │   └── Cargo.toml
│   └── reward/                 # SDT reward minting contract
│       ├── src/lib.rs
│       └── Cargo.toml
├── __tests__/
│   ├── lib/
│   │   ├── stellar.test.ts
│   │   └── transactions.test.ts
│   └── components/
│       ├── BalanceCard.test.tsx
│       └── SendPayment.test.tsx
├── scripts/
│   └── deploy-token.sh         # Token deployment script
├── types/
│   └── index.ts                # TypeScript interfaces
├── screenshots/                # All required screenshots
├── .env.example                # Environment variables template
├── jest.config.ts              # Jest configuration
├── jest.setup.ts               # Jest setup file
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

---

## ⚙️ CI/CD Pipeline

The project uses GitHub Actions with 4 automated jobs:

| Job | Trigger | What it does |
|---|---|---|
| Lint & Type Check | Every push and PR | Runs ESLint and TypeScript compiler |
| Run Tests | After lint passes | Runs all 28 Jest tests with coverage |
| Build Check | After tests pass | Runs `next build` to verify production build |
| Deploy to Vercel | Push to main only | Auto-deploys production build to Vercel |

### Setup CI/CD for Your Fork

Add these secrets in your GitHub repository settings under
**Settings → Secrets and variables → Actions**:

| Secret | Where to get it |
|---|---|
| `VERCEL_TOKEN` | [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Vercel project settings → General |
| `VERCEL_PROJECT_ID` | Vercel project settings → General |

---

## 🔐 Error Handling

The app handles 3 distinct error types:

| Error | When it occurs | User sees |
|---|---|---|
| `WalletNotFoundError` | Extension not installed | Install prompt with download link |
| `UserRejectedError` | User cancels signing | Soft message, not treated as a failure |
| `InsufficientBalanceError` | Balance too low | Amount field highlighted with exact shortfall |

All Horizon transaction errors are parsed into human-readable messages
using result code mapping in `lib/errors.ts`.

---

## 🌐 Stellar Network Info

| Property | Value |
|---|---|
| Network | Testnet |
| Horizon URL | https://horizon-testnet.stellar.org |
| Soroban RPC | https://soroban-testnet.stellar.org |
| Network Passphrase | Test SDF Network ; September 2015 |
| Friendbot Faucet | https://friendbot.stellar.org |
| Block Explorer | https://stellar.expert/explorer/testnet |

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 🙏 Acknowledgements

- [Stellar Development Foundation](https://stellar.org)
- [Soroban Documentation](https://soroban.stellar.org)
- [Freighter Wallet](https://www.freighter.app)
- [StellarWalletsKit](https://github.com/Creit-Tech/Stellar-Wallets-Kit)
- [Stellar Expert Explorer](https://stellar.expert)

---

*Built with ❤️ on Stellar Testnet*
