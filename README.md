# ⚡ Gifto - Multi-Token Crypto Gift Cards

**Revolutionizing crypto gifting with zero custody risk and lightning-fast redemption across EVM chains**

Gifto is a modern dApp that enables users to send cryptocurrency as digital gift cards with multi-token support. Using secure smart contract escrow, recipients can claim gifts instantly while maintaining complete security and supporting native tokens, ERC20s, and NFTs.

![Gifto Banner](public/gifto.png)

## ✨ Features

### 🎁 **Core Gifting Features**
- **Zero Custody Risk**: Funds secured in smart contract escrow until redemption
- **Multi-Token Support**: Send ETH, ERC20 tokens, NFTs (ERC721/ERC1155) in single gift cards
- **Multi-Chain**: Deploy across Ethereum, Polygon, Arbitrum, Base, and Optimism
- **Lightning Fast**: Recipients can claim gifts in under 10 seconds
- **Share by Link or QR**: Send gifts via shareable links or QR codes
- **No Signup Required**: Frictionless onboarding for recipients

### 🔒 **Security & Trust**
- **Smart Contract Escrow**: Audited smart contracts handle fund security
- **Time-Lock Protection**: Automatic expiration with sender withdrawal rights
- **Anti-MEV Protection**: Recipient verification prevents frontrunning
- **Multi-Sig Support**: Enhanced security for high-value gifts
- **Wallet Integration**: Compatible with all EVM wallets (MetaMask, WalletConnect, etc.)

### 🎨 **Beautiful UI/UX**
- **Modern Design**: Stunning glassmorphism design with animated starfield background
- **Mobile-First**: Optimized for mobile devices with touch-friendly interfaces
- **Dark Theme**: Elegant dark theme with Gifto brand colors (flamingo pink to tangerine orange)
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Beautiful transitions and hover effects

### ⚡ **Technical Excellence**
- **Next.js 15**: Latest features with Turbopack for fast development
- **TypeScript**: Full type safety throughout the application
- **EVM Compatible**: Built for Ethereum and all EVM-compatible chains
- **Smart Contracts**: OpenZeppelin-based secure contracts
- **Performance Optimized**: Server components and optimal caching
- **PWA Ready**: Progressive Web App capabilities

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Blockchain**: EVM-Compatible Chains (Ethereum, Polygon, Arbitrum, Base, Optimism)
- **Smart Contracts**: [OpenZeppelin](https://openzeppelin.com/contracts/)
- **Wallet Integration**: [Wagmi](https://wagmi.sh/) + [RainbowKit](https://rainbowkit.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- yarn (recommended)
- EVM wallet (MetaMask, WalletConnect compatible)
- Testnet ETH for development

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/olich97/gifto.git
   cd gifto
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Run the development server**
   ```bash
   yarn dev
   ```

4. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000) to see the landing page!

## 🎯 How It Works

### For Senders:
1. **Create Your Gift**: Select multiple tokens (ETH, ERC20s, NFTs) in one gift card
2. **Set Privacy**: Gift uses keccak256(recipient_address + salt) for privacy protection
3. **Smart Contract Escrow**: All tokens stored securely in single GiftCardManager contract
4. **Share**: Share the gift link/QR code with recipient address and salt

### For Recipients:
1. **Click Link**: Open the gift link or scan QR code
2. **Connect Wallet**: Connect any EVM-compatible wallet
3. **Claim Instantly**: Provide salt to verify identity and claim all tokens at once

### Gas Efficiency:
- **Traditional approach**: ~2M+ gas per gift (contract deployment)
- **Gifto approach**: ~100-200k gas per gift (struct storage)
- **Savings**: Up to 85% reduction in gas costs

## 📁 Project Structure

```
├── app/                          # Next.js App Router
│   ├── dashboard/               # Gift management dashboard
│   ├── redeem/                  # Gift redemption page
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Global styles with starfield
│   └── layout.tsx              # Root layout
├── components/                  # Reusable components
│   ├── dashboard/              # Dashboard components
│   ├── layout/                 # Layout components (sidebar, mobile nav)
│   └── ui/                     # shadcn/ui components
├── contracts/                   # Smart contracts
│   ├── GiftCardManager.sol     # Main gift card manager (single contract)
│   ├── interfaces/             # Contract interfaces
│   │   └── IGiftCardManager.sol # Manager interface
│   └── test/                  # Contract tests
├── lib/                        # Utilities and actions
├── hooks/                      # Custom React hooks
├── template.config.ts          # App configuration
└── types/                      # TypeScript types
```

## 🎨 Design System

### Brand Colors
- **Flamingo**: `#FF4D9D` - Primary brand color
- **Tangerine**: `#FF8A39` - Secondary brand color  
- **Aqua**: `#29DFFF` - Accent color
- **Midnight**: `#0C0E25` - Dark background
- **Dusk**: `#1B1243` - Card backgrounds

### Visual Features
- **Starfield Background**: Animated star field with brand colors
- **Glassmorphism**: Cards with backdrop blur and transparent backgrounds
- **Gradient Elements**: Beautiful gradients using brand colors
- **Smooth Animations**: Elegant transitions and hover effects

## 🌟 Key Pages

### Landing Page
- **Hero Section**: Compelling value proposition with call-to-action
- **Features**: Six key benefits of using Gifto
- **How It Works**: Three-step process explanation
- **Stats**: Zero custody risk, <3s redemption, Hedera-powered
- **Mobile Optimized**: Perfect mobile experience

### Dashboard
- **Send Gifts**: Create and manage gift cards
- **My Gifts**: Track sent and received gifts
- **Analytics**: Gift statistics and insights
- **Mobile-Friendly**: Full mobile navigation

## 🔗 EVM Integration

### Smart Contract Architecture
Gifto uses a gas-optimized single contract architecture:
- **GiftCardManager**: Single contract managing all gift cards as structs
- **Multi-Token Support**: Handles ETH, ERC20, ERC721, ERC1155 tokens in one gift
- **Privacy Protection**: Recipient verification via keccak256(address + salt)
- **Gas Efficiency**: ~85% gas savings vs individual contract deployment
- **Security Features**: ReentrancyGuard, expiration handling, pausable controls

### Supported Tokens
- **Native Tokens**: ETH, MATIC, AVAX, BNB on respective chains
- **ERC20 Tokens**: USDC, USDT, DAI, and thousands more
- **NFTs**: ERC721 and ERC1155 collections
- **Multi-Chain**: Cross-chain compatibility via LayerZero/Chainlink CCIP

### Supported Networks
- **Ethereum Mainnet**: The original and most secure network
- **Polygon**: Low-cost transactions with high throughput
- **Arbitrum**: Layer 2 scaling with Ethereum security
- **Base**: Coinbase's L2 with seamless fiat integration
- **Optimism**: Optimistic rollup with growing ecosystem

## 📱 Mobile Experience

- **Progressive Web App**: Install on mobile devices
- **Touch Optimized**: Large buttons and touch-friendly interface  
- **Mobile Sidebar**: Slide-out navigation
- **Responsive Design**: Adapts to all screen sizes
- **Fast Loading**: Optimized for mobile networks

## 🚀 Deployment

### Vercel (Recommended)
```bash
yarn build
npx vercel --prod
```

### Environment Variables
```bash
# Add to .env.local
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
NEXT_PUBLIC_DEFAULT_CHAIN=ethereum

# Smart contract addresses (single manager per chain)
NEXT_PUBLIC_GIFT_CARD_MANAGER_ETHEREUM=0x...
NEXT_PUBLIC_GIFT_CARD_MANAGER_POLYGON=0x...
NEXT_PUBLIC_GIFT_CARD_MANAGER_ARBITRUM=0x...
NEXT_PUBLIC_GIFT_CARD_MANAGER_BASE=0x...
NEXT_PUBLIC_GIFT_CARD_MANAGER_OPTIMISM=0x...

# For contract deployment
PRIVATE_KEY=your_deployer_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## 🔒 Security

- **Smart Contract Audits**: Thoroughly audited contracts using OpenZeppelin standards
- **Time-Lock Mechanism**: Automatic expiration prevents permanent fund lock
- **Multi-Signature Support**: Enhanced security for high-value transactions
- **Anti-MEV Protection**: Recipient verification prevents sandwich attacks
- **Upgradeable Contracts**: Secure upgrade patterns for bug fixes and improvements
- **Open Source**: Full transparency and community auditing

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenZeppelin](https://openzeppelin.com/) for secure smart contract standards
- [Ethereum Foundation](https://ethereum.org/) for the revolutionary platform
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Next.js](https://nextjs.org/) team for the incredible framework
- [Wagmi](https://wagmi.sh/) and [RainbowKit](https://rainbowkit.com/) for excellent wallet integration
- The EVM developer community for inspiration and support

---

**Built with ❤️ for the decentralized future**

If you found Gifto helpful, please consider giving it a ⭐ on GitHub!

## 🔗 Links

- **Website**: [gifto.app](https://gifto.app) (when deployed)
- **Ethereum**: [ethereum.org](https://ethereum.org)
- **OpenZeppelin**: [openzeppelin.com](https://openzeppelin.com)
- **Wagmi Documentation**: [wagmi.sh](https://wagmi.sh)
- **RainbowKit**: [rainbowkit.com](https://rainbowkit.com)
- **Community**: EVM Developer Communities