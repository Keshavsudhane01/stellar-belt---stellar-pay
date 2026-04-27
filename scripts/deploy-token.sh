#!/bin/bash
set -e

ADMIN_KEY="YOUR_SECRET_KEY"
ADMIN_PK="YOUR_PUBLIC_KEY"
NETWORK="testnet"
TOKEN_WASM="$HOME/.stellar/token.wasm"

echo "Deploying SDT token..."
TOKEN_ADDRESS=$(stellar contract deploy \
  --wasm $TOKEN_WASM \
  --source $ADMIN_KEY \
  --network $NETWORK)

echo "Initializing SDT token..."
stellar contract invoke \
  --id $TOKEN_ADDRESS \
  --source $ADMIN_KEY \
  --network $NETWORK \
  -- initialize \
  --admin $ADMIN_PK \
  --decimal 7 \
  --name "Stellar Dev Token" \
  --symbol "SDT"

echo "TOKEN_ADDRESS=$TOKEN_ADDRESS"
echo "Add to .env.local: NEXT_PUBLIC_SDT_TOKEN_ADDRESS=$TOKEN_ADDRESS"
