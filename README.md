# SafariChain

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENCE)
[![Built with Scaffold-ETH 2](https://img.shields.io/badge/Built%20with-Scaffold--ETH%202-FF6B35)](https://scaffoldeth.io)

SafariChain is a decentralized social and ticketing platform that transforms ETHSafari into a fully on-chain community experience. It pulls real-time ETHSafari tweets via twitterapi.io, lets users connect their wallet to comment and like directly on-chain (preserving anonymity), and enables minting of the official 2026 ETHSafari NFT Ticket — burnable at the gate. SafariChain turns every tweet into a discussion thread on the blockchain and makes event access a native Web3 action. No logins. No data leaks. Just wallets, tweets, and tickets — all on-chain.

## Features

- **Real-Time Tweet Integration**: Fetches and displays ETHSafari tweets using Twitter API for seamless social interaction.
- **On-Chain Interactions**: Comment and like tweets directly on the blockchain, ensuring privacy and decentralization.
- **NFT Ticketing**: Mint and burn official 2026 ETHSafari NFT Tickets for event access.
- **Gasless Transactions**: Supports gasless smart accounts for user-friendly interactions.
- **Wallet-Only Access**: No traditional logins required; connect your wallet and engage.
- **Built on Scaffold-ETH 2**: Leverages modern Ethereum tooling for robust, scalable dApps.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (>= v20.18.3)
- [Yarn](https://yarnpkg.com/) (v1 or v2+)
- [Git](https://git-scm.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mwihoti/safarichain.git
   cd safarichain
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Set up environment variables:
   - Copy `packages/nextjs/.env.example` to `packages/nextjs/.env.local` and fill in the required values:
     - `NEXT_PUBLIC_ALCHEMY_API_KEY`: Your Alchemy API key
     - `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: Your WalletConnect Project ID
   - For Twitter API integration, ensure you have access to twitterapi.io and configure accordingly in the app.

### Running the Project

1. Start the local Ethereum network:
   ```bash
   yarn chain
   ```

2. Deploy the smart contracts:
   ```bash
   yarn deploy
   ```

3. Start the Next.js frontend:
   ```bash
   yarn start
   ```

   Visit `http://localhost:3000` to interact with the app. Use the Debug Contracts tab to test smart contract interactions.

### Usage Examples

- **Viewing Tweets**: Navigate to the home page to see real-time ETHSafari tweets.
- **On-Chain Comments**: Connect your wallet, open a tweet modal, and submit comments gaslessly.
- **Minting Tickets**: Use the ticketing interface to mint NFT tickets for ETHSafari 2026.
- **Liking Tweets**: Click the heart icon on tweets to like them on-chain.

## Smart Contracts

SafariChain includes two main smart contracts:

- **ETHSafariComments**: Handles on-chain comments and likes for tweets, minting NFT comments.
- **ETHSafariTicket**: Manages NFT tickets for ETHSafari 2026 events.

Contracts are deployed to Sepolia testnet and can be found in `packages/hardhat/contracts/`.

## Testing

Run the smart contract tests:
```bash
yarn hardhat:test
```

## Contributing

We welcome contributions! Please read our [contributing guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License - see the [LICENCE](LICENCE) file for details.