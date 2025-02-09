# WebIt.AI Platform 

WebIt.AI is a decentralized platform that helps turn innovative ideas into reality through blockchain-based crowdfunding and AI-powered project generation. The platform enables creators to launch their ideas as tokens, build communities, and receive funding through a unique bonding curve mechanism.

## 🌟 Key Features 

- AI-powered idea generation and refinement
- Blockchain-based crowdfunding through token creation
- Automated liquidity pool creation on Uniswap V3
- Community engagement tools and social features
- Multi-chain support (Arbitrum Mainnet)
- Subdomain-based project pages

## 🏗️ Architecture

The project consists of two main components:

### Frontend (Next.js Application)

- **Framework**: Next.js 14 with App Router
- **Key Directories**:
  - `/app` - Main application routes and pages
  - `/common` - Shared components, utilities, and constants
  - `/utils` - Helper functions and configurations

### Smart Contracts (Solidity)

- **Framework**: Hardhat + Thirdweb
- **Key Contracts**:
  - `IdeaFactory.sol` - Main factory contract for token creation
  - `Idea.sol` - ERC20 token implementation
  - `IdeaFactoryLiquidity.sol` - Uniswap V3 integration

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 20.18.0
- NPM ≥ 10.8.2
- Arbitrum RPC URL (for development)

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/digitalcache/web3it.ai.git
cd web3it.ai
```

2. Create environment files from the example env

### Frontend Installation

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
npm start
```

### Smart Contract Development

1. Install dependencies:
```bash
cd thirdweb
npm install
```

2. Compile contracts:
```bash
npx thirdweb build
```

3. Deploy contracts:
```bash
npx thirdweb deploy -k THIRDWEB_KEY
```

## 🔧 Core Technologies

- **Frontend**:
  - Next.js 14
  - TailwindCSS
  - Wagmi/RainbowKit
  - Framer Motion
  - SWR
  - React Hook Form

- **Smart Contracts**:
  - Solidity 0.8.24
  - OpenZeppelin Contracts
  - Uniswap V3 SDK
  - Hardhat
  - Thirdweb

- **Infrastructure**:
  - Supabase
  - IPFS (Pinata)
  - Vercel
  - Arbitrum Network

## 📦 Project Structure

```
.
├── frontend/
│   ├── app/                    # Next.js pages and routes
│   ├── common/                 # Shared components and utilities
│   │   ├── components/         # Reusable React components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Utility functions
│   │   └── types/             # TypeScript type definitions
│   └── public/                # Static assets
│
└── thirdweb/
    ├── contracts/             # Smart contract source files
    ├── scripts/               # Deployment and management scripts
    └── test/                  # Contract test files
```

## 🔐 Security

- Smart contracts are based on OpenZeppelin's secure implementations
- User authentication handled through Web3 wallets
- Environment variables properly segregated and protected
- Frontend protected against common web vulnerabilities

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details

## 💫 Acknowledgments

- OpenZeppelin for secure contract implementations
- Uniswap team for DEX infrastructure
- Claude AI for generation capabilities
- ThirdWeb and Vercel for deployment tools

## 🌐 Documentation

For more detailed documentation:
- [Smart Contract Documentation](docs/contracts.md)
- [Frontend Documentation](docs/frontend.md)
- [API Documentation](docs/api.md)

## 🤔 Support

For support, join our [Telegram community](https://t.me/dreamstarterxyz) or open an issue on GitHub.
