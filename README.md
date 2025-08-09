# CoinPort

A minimal, fast crypto wallet UI to manage ETH, SOL, and BTC from the browser. Import/create a 12‑word mnemonic, view balances, and send transactions with a clean, responsive UI.

## Features
- 12‑word mnemonic import/create
- Multi-chain balances: Ethereum, Solana, Bitcoin
- Send transactions
  - ETH: on-chain confirmation via `tx.wait()`
  - SOL: confirmation polling + explorer link
  - BTC: PSBT build/sign and broadcast (public API)
- Resilient balance loading (partial failures/timeouts don’t block UI)
- Modern UI with Tailwind CSS + DaisyUI

## Tech Stack
- React (Vite)
- Tailwind CSS, DaisyUI
- Ethereum: `ethers`
- Solana: `@solana/web3.js`
- Bitcoin: `bitcoinjs-lib`, `tiny-secp256k1`, `ecpair`
- Wallet derivation: `bip39`, `bip32`

## Project Structure
```
my-project/
├─ public/
├─ src/
│  ├─ components/
│  │  ├─ WalletDashboard.jsx
│  │  └─ AssetCard.jsx
│  ├─ context/
│  │  └─ WalletContext.jsx
│  ├─ services/
│  │  ├─ wallet.js
│  │  └─ blockchain.js
│  ├─ App.jsx
│  └─ main.jsx
├─ index.html
├─ package.json
└─ .gitignore
```

## Prerequisites
- Node.js 18+
- NPM (or PNPM/Yarn)
- Git

## Setup
1) Install dependencies
```bash
npm install
```

2) Create an `.env` in project root
```bash
VITE_ETH_RPC_URL=https://your-eth-rpc-url
VITE_SOL_RPC_URL=https://your-sol-rpc-url
# Optional if you later add a keyed BTC provider:
# VITE_BTC_API_URL=...
# VITE_BTC_API_TOKEN=...
```

3) Start dev server
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Configuration
- ETH RPC: set `VITE_ETH_RPC_URL` (e.g., GetBlock/Alchemy/Infura)
- SOL RPC: set `VITE_SOL_RPC_URL` (e.g., GetBlock/Helius/Solana RPC)
- BTC: currently uses public `blockchain.info` endpoints (no API key). You can migrate to a more reliable provider and add env vars later.

## How It Works
- Wallet derivation (`src/services/wallet.js`):
  - Derives ETH, BTC, SOL accounts from a single 12‑word mnemonic.
- Balances (`src/services/blockchain.js`):
  - ETH: `provider.getBalance(address)`
  - SOL: `connection.getBalance(publicKey)`
  - BTC: `https://blockchain.info/q/addressbalance/<address>`
- Send
  - ETH: `ethers.Wallet.sendTransaction` then `tx.wait()`
  - SOL: build `SystemProgram.transfer`, send, UI polls confirmation
  - BTC: build/sign PSBT using UTXOs and broadcast via `blockchain.info/pushtx`

## Notes & Limitations
- BTC path is basic:
  - Simple fee model and UTXO handling
  - Relies on public APIs that may rate-limit; consider Blockstream/BlockCypher (testnet/mainnet) for reliability and fee estimation.
- Use the correct network:
  - If your RPCs are devnet/testnet while addresses are mainnet (or vice versa), balances will be 0 and sends will fail.
- Browser restrictions:
  - Some public APIs may have CORS limitations.

## Roadmap
- Robust BTC fee estimation and UTXO selection
- Testnet/devnet toggles
- Per-chain status badges and retries
- Keyed BTC provider support with env config

## Security
- Never commit mnemonics/private keys.
- Keep RPC URLs with keys in `.env` (already `.gitignore`d).
- This project is for educational/demo purposes—review carefully before production use.

## Scripts
- `npm run dev` – start dev server
- `npm run build` – build for production
- `npm run preview` – preview production build

## License
MIT

## Contributing
Issues and PRs are welcome. Open an issue to discuss features or bugs.
