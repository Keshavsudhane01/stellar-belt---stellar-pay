# 🌟 StellarPay

![CI/CD](https://github.com/Keshavsudhane01/stellar-belt---stellar-pay/actions/workflows/ci.yml/badge.svg)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen)
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
git clone https://github.com/Keshavsudhane01/stellar-belt---stellar-pay.git
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
| stellar.test.ts          | 6     | ✅ Passing |
| transactions.test.ts     | 4     | ✅ Passing |
| BalanceCard.test.tsx     | 4     | ✅ Passing |
| SendPayment.test.tsx     | 4     | ✅ Passing |
| **Total**                | **18**| ✅ All Pass|

---

## 📸 Screenshots

### Wallet Connected
![Wallet Connected](./screenshots/wallet-connected.png)

### Balance Displayed
![Balance](./screenshots/balance.png)

### Transaction Success
![Transaction](./screenshots/tx-success.png)

### Wallet Options
![Wallet Picker](./screenshots/wallet-picker.png)

### Contract Interaction
![Contract](./screenshots/contract.png)

### Tests Passing
![Tests](./screenshots/tests-passing.png)

### Mobile View
![Mobile](./screenshots/mobile.png)

### CI/CD Pipeline
![CI/CD](./screenshots/cicd.png)

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

## 🔧 Complete Contract Deployment Commands

Run these in order from your project root. Replace `YOUR_SECRET_KEY`
and `YOUR_PUBLIC_KEY` with your actual Stellar Testnet account values.

---

### Step 1 — Install Stellar CLI

```bash
cargo install --locked stellar-cli --features opt
```

Verify installation:

```bash
stellar --version
```

---

### Step 2 — Configure Testnet Identity

```bash
stellar keys generate --global deployer --network testnet
stellar keys address deployer
```

Fund the deployer account:

```bash
curl "https://friendbot.stellar.org?addr=$(stellar keys address deployer)"
```

---

### Step 3 — Build All Contracts

```bash
cd contracts/counter
cargo build --target wasm32-unknown-unknown --release

cd ../reward
cargo build --target wasm32-unknown-unknown --release

cd ../payment_splitter
cargo build --target wasm32-unknown-unknown --release

cd ../..
```

---

### Step 4 — Deploy Counter Contract

```bash
stellar contract deploy \
  --wasm contracts/counter/target/wasm32-unknown-unknown/release/counter.wasm \
  --source deployer \
  --network testnet
```

Save the output address as `COUNTER_ADDRESS`.

Initialize it:

```bash
stellar contract invoke \
  --id COUNTER_ADDRESS \
  --source deployer \
  --network testnet \
  -- initialize \
  --owner $(stellar keys address deployer)
```

Test it works:

```bash
stellar contract invoke \
  --id COUNTER_ADDRESS \
  --source deployer \
  --network testnet \
  -- get_count
```

---

### Step 5 — Deploy SDT Token Contract

Download the pre-built Soroban token WASM:

```bash
curl -L https://github.com/stellar/soroban-examples/releases/download/v20.0.0/soroban_token_contract.wasm \
  -o soroban_token.wasm
```

Deploy it:

```bash
stellar contract deploy \
  --wasm soroban_token.wasm \
  --source deployer \
  --network testnet
```

Save the output address as `SDT_TOKEN_ADDRESS`.

Initialize the token:

```bash
stellar contract invoke \
  --id SDT_TOKEN_ADDRESS \
  --source deployer \
  --network testnet \
  -- initialize \
  --admin $(stellar keys address deployer) \
  --decimal 7 \
  --name "Stellar Dev Token" \
  --symbol "SDT"
```

Verify token symbol:

```bash
stellar contract invoke \
  --id SDT_TOKEN_ADDRESS \
  --source deployer \
  --network testnet \
  -- symbol
```

---

### Step 6 — Deploy Reward Contract

```bash
stellar contract deploy \
  --wasm contracts/reward/target/wasm32-unknown-unknown/release/reward.wasm \
  --source deployer \
  --network testnet
```

Save the output address as `REWARD_ADDRESS`.

Initialize with the SDT token address:

```bash
stellar contract invoke \
  --id REWARD_ADDRESS \
  --source deployer \
  --network testnet \
  -- initialize \
  --admin $(stellar keys address deployer) \
  --reward_token SDT_TOKEN_ADDRESS
```

Grant the reward contract minting authority on the SDT token:

```bash
stellar contract invoke \
  --id SDT_TOKEN_ADDRESS \
  --source deployer \
  --network testnet \
  -- set_authorized \
  --id REWARD_ADDRESS \
  --authorize true
```

---

### Step 7 — Deploy Payment Splitter Contract

```bash
stellar contract deploy \
  --wasm contracts/payment_splitter/target/wasm32-unknown-unknown/release/payment_splitter.wasm \
  --source deployer \
  --network testnet
```

Save the output address as `SPLITTER_ADDRESS`.

Initialize with both the admin and reward contract:

```bash
stellar contract invoke \
  --id SPLITTER_ADDRESS \
  --source deployer \
  --network testnet \
  -- initialize \
  --admin $(stellar keys address deployer) \
  --reward_contract REWARD_ADDRESS
```

---

### Step 8 — Test the Full Inter-Contract Flow

Test payment split (replace `RECIPIENT_1` and `RECIPIENT_2` with real addresses):

```bash
stellar contract invoke \
  --id SPLITTER_ADDRESS \
  --source deployer \
  --network testnet \
  -- split_payment \
  --payer $(stellar keys address deployer) \
  --token_id SDT_TOKEN_ADDRESS \
  --recipients '[RECIPIENT_1, RECIPIENT_2]' \
  --total_amount 2000000000
```

Check total splits counter:

```bash
stellar contract invoke \
  --id SPLITTER_ADDRESS \
  --source deployer \
  --network testnet \
  -- get_total_splits
```

---

### Step 9 — Update Your .env.local

Paste the 4 deployed addresses:

```env
NEXT_PUBLIC_COUNTER_CONTRACT_ID=COUNTER_ADDRESS
NEXT_PUBLIC_SDT_TOKEN_ADDRESS=SDT_TOKEN_ADDRESS
NEXT_PUBLIC_PAYMENT_SPLITTER_ADDRESS=SPLITTER_ADDRESS
NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS=REWARD_ADDRESS
```

---

### Step 10 — Verify All on Stellar Expert

Open each link and confirm contract exists and has transactions:

```text
https://stellar.expert/explorer/testnet/contract/COUNTER_ADDRESS
https://stellar.expert/explorer/testnet/contract/SDT_TOKEN_ADDRESS
https://stellar.expert/explorer/testnet/contract/SPLITTER_ADDRESS
https://stellar.expert/explorer/testnet/contract/REWARD_ADDRESS
```

Copy the transaction hashes from Stellar Expert and paste them into
the **Verified Transactions** table in your README.

---

### Final Submission Commands

```bash
npm test
npm run build
git add .
git commit -m "final: complete submission"
git push origin main
```
