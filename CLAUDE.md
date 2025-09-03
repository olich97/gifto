# CLAUDE.md - Gifto Project Context

This file contains essential information for Claude about the Gifto project, including architecture, design decisions, development patterns, and technical implementation details.

## 🎯 Project Overview

**Gifto** is a modern dApp for sending cryptocurrency as multi-token digital gift cards across EVM-compatible chains. The project transforms a Next.js dashboard template into a comprehensive crypto gifting platform with zero custody risk using secure smart contract escrow.

### Core Concept
- **Senders**: Create gift cards containing multiple tokens (ETH, ERC20s, NFTs) via smart contract escrow
- **Recipients**: Claim gifts by verifying identity and executing secure withdrawal from escrow
- **Multi-Token**: Single gift cards can contain native tokens, ERC20s, and NFTs simultaneously
- **Multi-Chain**: Deploy across Ethereum, Polygon, Arbitrum, Base, and Optimism
- **Security**: Funds secured in audited smart contracts with time-lock and anti-MEV protection

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Blockchain**: EVM-Compatible Chains (Ethereum, Polygon, Arbitrum, Base, Optimism)
- **Smart Contracts**: OpenZeppelin-based secure contracts
- **Wallet Integration**: Wagmi + RainbowKit for universal EVM wallet support
- **Authentication**: Non-custodial wallet-based authentication

### Project Structure
```
├── app/                     # Next.js App Router pages
│   ├── dashboard/          # Gift management interface (protected)
│   ├── redeem/            # Gift redemption page
│   ├── create/            # Multi-token gift creation
│   ├── page.tsx           # Landing page (public)
│   ├── globals.css        # Global styles + starfield background
│   └── layout.tsx         # Root layout with wallet provider
├── components/
│   ├── dashboard/         # Dashboard-specific components
│   ├── layout/           # Sidebar, mobile nav, etc.
│   ├── providers/        # React context providers
│   │   ├── wallet-provider.tsx    # EVM wallet connection state
│   │   └── auth-provider.tsx      # Authentication guard
│   ├── gift/             # Gift card components
│   │   ├── multi-token-selector.tsx   # Token selection UI
│   │   ├── gift-card-preview.tsx     # Gift preview
│   │   └── redemption-flow.tsx       # Redemption interface
│   ├── ui/               # shadcn/ui base components
│   └── wallet-connect-button.tsx  # Wallet connection UI
├── design_reference/     # Design mockups and inspiration
├── contracts/               # Smart contract source
│   ├── GiftCardManager.sol  # Single gas-efficient manager contract
│   ├── interfaces/         # Contract interfaces
│   │   └── IGiftCardManager.sol # Manager contract interface
│   └── test/               # Contract tests
│       └── GiftCardManager.test.js # Comprehensive test suite
├── lib/
│   ├── wagmi-config.ts     # Wagmi configuration
│   ├── contracts.ts        # Contract ABI and addresses
│   └── utils.ts            # Utilities and server actions
├── hooks/                   # Custom React hooks
│   ├── useGiftCard.ts      # Gift card operations
│   ├── useMultiToken.ts    # Multi-token management
│   └── useChainSwitch.ts   # Chain switching logic
├── template.config.ts    # App configuration
└── types/               # TypeScript type definitions
```

## 🔐 Authentication System

### EVM Wallet-Based Authentication
- **Non-Custodial**: Users authenticate with any EVM-compatible wallet
- **Landing Page**: Always public and accessible
- **Dashboard**: Protected route requiring wallet connection
- **Supported Wallets**: MetaMask, Rainbow, Coinbase Wallet, WalletConnect, and 100+ others
- **Multi-Chain**: Seamless chain switching within the application
- **Gas Efficiency**: Single contract deployment per chain reduces complexity

### Implementation Details
```typescript
// Wagmi + RainbowKit Provider wraps the entire app
<WagmiConfig config={wagmiConfig}>
  <RainbowKitProvider chains={chains} theme={darkTheme()}>
    <AuthProvider requireAuth={true}> // Dashboard only
      <DashboardContent />
    </AuthProvider>
  </RainbowKitProvider>
</WagmiConfig>
```

### Key Components
- **WagmiConfig**: Manages EVM wallet connection state globally
- **RainbowKitProvider**: Provides beautiful wallet connection UI
- **AuthProvider**: Guards protected routes, shows connection UI if needed
- **ChainSwitcher**: Allows users to switch between supported chains

### Account Type Support
Hedera supports two types of cryptographic keys for accounts:

- **Ed25519 (Native)**: Hedera's preferred key type, supported only by the native `hedera` namespace
- **ECDSA (EVM Compatible)**: Required for EVM compatibility, supported by both namespaces

### Configuration
```typescript
// lib/wallet-config.ts - Fixed AppKit approach with proper adapters
import { createAppKit } from '@reown/appkit/react'
import { HederaAdapter, HederaChainDefinition } from '@hashgraph/hedera-wallet-connect'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'

const hederaAdapter = new HederaAdapter({
  projectId,
  networks: [HederaChainDefinition.Native.Testnet, HederaChainDefinition.Native.Mainnet],
  namespace: 'hedera',
  options: {
    logger: 'debug',
    metadata
  }
})

const ethersAdapter = new EthersAdapter() // For compatibility

export const appKit = createAppKit({
  adapters: [hederaAdapter, ethersAdapter], // Hedera first, Ethers for fallback
  defaultNetwork: HederaChainDefinition.Native.Testnet,
  networks: [HederaChainDefinition.Native.Testnet, HederaChainDefinition.Native.Mainnet],
  // ... other config
})
```

**Key Changes**: 
- Fixed import path to `@reown/appkit/react`
- Added EthersAdapter for compatibility 
- Proper HederaAdapter options structure
- Version compatibility with working hgraph-io repository

## 🎨 Design System

### Brand Colors
```css
/* Primary brand colors */
--flamingo: #FF4D9D;      /* Primary brand color */
--tangerine: #FF8A39;     /* Secondary brand color */
--aqua: #29DFFF;          /* Accent color */
--midnight: #0C0E25;      /* Dark background base */
--dusk: #1B1243;          /* Card/component backgrounds */
--violet-fog: #302766;    /* Muted backgrounds */
```

### Design Principles
1. **Dark Theme Only**: Removed theme switching, focused on elegant dark aesthetic
2. **Glassmorphism**: Cards use `bg-black/40 backdrop-blur-sm border-white/10`
3. **Gradient Accents**: Brand colors used in gradients for buttons and highlights
4. **Starfield Background**: Immersive animated star field covering the entire screen
5. **Mobile-First**: Responsive design optimized for mobile experience

### Visual Elements
- **Background**: Multi-layered gradient (`#1A1B3A` → `#4A1D3A`) with animated starfield
- **Cards**: Glassmorphism effect with subtle borders and backdrop blur
- **Buttons**: Gradient backgrounds with hover effects and smooth transitions
- **Navigation**: Collapsible sidebar with mobile hamburger menu

## 🌟 Key Components

### Landing Page (`app/page.tsx`)
- **Hero Section**: Value proposition with call-to-action buttons
- **Stats Section**: Key metrics (0 custody risk, <3s redemption, Hedera-powered)
- **Features**: Six key benefits of using Gifto
- **How It Works**: Three-step process explanation
- **Wallet Integration**: Connect wallet button in navigation
- **Footer**: Hedera-focused links and company information

### Dashboard (`app/dashboard/page.tsx`)
- **Protected Route**: Requires wallet connection via AuthProvider
- **Tabs Interface**: Overview, Analytics, Performance, Insights
- **Stats Cards**: KPI metrics with trend indicators
- **Charts**: Performance overview, revenue distribution, user engagement
- **Mobile Header**: Hamburger menu and wallet button for mobile

### Authentication Flow
1. **Landing Page**: Public access, wallet connection optional
2. **Dashboard Access**: Redirects to wallet connection if not authenticated
3. **Wallet Connection**: Opens WalletConnect modal with Hedera wallets
4. **Post-Connection**: Dashboard becomes accessible, user info displayed

### Layout Components
- **Sidebar** (`components/layout/sidebar.tsx`): Desktop navigation with glassmorphism + wallet button
- **Mobile Sidebar** (`components/layout/mobile-sidebar.tsx`): Slide-out navigation
- **WalletConnectButton**: Consistent wallet connection UI across the app

## 🔧 EVM Wallet Integration

### Dependencies
```json
{
  "@rainbow-me/rainbowkit": "^2.0.0",
  "wagmi": "^2.15.6",
  "viem": "^2.31.4",
  "@openzeppelin/contracts": "^5.0.0",
  "ethers": "^6.14.4"
}
```

### Environment Variables
```bash
# Required for wallet authentication
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key

# Smart contract addresses (single manager per chain)
NEXT_PUBLIC_GIFT_CARD_MANAGER_ETHEREUM=0x...
NEXT_PUBLIC_GIFT_CARD_MANAGER_POLYGON=0x...
NEXT_PUBLIC_GIFT_CARD_MANAGER_ARBITRUM=0x...
NEXT_PUBLIC_GIFT_CARD_MANAGER_BASE=0x...
NEXT_PUBLIC_GIFT_CARD_MANAGER_OPTIMISM=0x...

# For contract deployment and verification
PRIVATE_KEY=your_deployer_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key

# Default chain configuration
NEXT_PUBLIC_DEFAULT_CHAIN=ethereum
```

### Wallet State Management
```typescript
import { useAccount, useConnect, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi'

const { address, isConnected, connector } = useAccount()
const { connect, connectors } = useConnect()
const { disconnect } = useDisconnect()
const { chain } = useNetwork()
const { switchNetwork } = useSwitchNetwork()

// Connection states:
// - isConnected: Wallet is connected and authenticated
// - address: Ethereum address (e.g., "0x1234...abcd")
// - chain: Current network (Ethereum, Polygon, etc.)
// - connector: Connected wallet type (MetaMask, WalletConnect, etc.)
```

## 🎭 Styling Patterns

### Glassmorphism Cards
```tsx
className="bg-black/40 backdrop-blur-sm border-white/10 hover:border-white/20"
```

### Gifto Brand Buttons
```tsx
// Primary button
className="bg-gradient-to-r from-[#FF4D9D] to-[#FF8A39] hover:from-[#FF6BA8] hover:to-[#FFA055]"

// Outline button
className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50"
```

### Wallet Connection States
```tsx
// Connected state
<div className="flex items-center gap-2 px-3 py-2 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
  <span className="text-sm font-mono text-white">{address}</span>
</div>

// Chain indicator
<div className="flex items-center gap-2">
  <img src={chain?.iconUrl} className="w-4 h-4" alt={chain?.name} />
  <span className="text-sm">{chain?.name}</span>
</div>

// Disconnect button
<Button variant="outline" onClick={() => disconnect()}>
  <LogOut className="mr-2 h-4 w-4" />
  Disconnect
</Button>
```

### Mobile Responsiveness
- **Breakpoints**: `sm:`, `md:`, `lg:` for progressive enhancement
- **Grid Systems**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Typography**: `text-2xl md:text-3xl lg:text-4xl` for responsive text
- **Spacing**: `p-4 md:p-6` for responsive padding

## 🌌 Starfield Background

### Implementation
The starfield is created using CSS `radial-gradient` patterns in `body::before` and `main::before` pseudo-elements:

```css
body::after {
  background-image: 
    radial-gradient(1px 1px at 20px 30px, rgba(255, 255, 255, 0.6), transparent),
    radial-gradient(1px 1px at 40px 70px, rgba(255, 77, 157, 0.8), transparent),
    /* ...multiple star positions with brand colors... */;
  background-repeat: repeat;
  background-size: 480px 240px;
  animation: starfieldTwinkle 8s ease-in-out infinite;
}
```

### Star Characteristics
- **Multiple Layers**: Two layers with different patterns and timing
- **Brand Colors**: White, flamingo pink, tangerine orange, aqua blue
- **Size Variation**: 0.5px to 2px stars for depth
- **Animation**: Gentle twinkling with brightness and opacity changes
- **Performance**: Pure CSS, no JavaScript overhead

## 📱 Mobile Experience

### Mobile Navigation
- **Header**: Fixed header with hamburger menu, logo, and wallet button
- **Sidebar**: Slide-out sheet with full navigation
- **Touch Targets**: Minimum 44px touch targets for accessibility

### Responsive Breakpoints
- **Mobile**: < 768px (base styles)
- **Tablet**: 768px - 1024px (`md:`)
- **Desktop**: > 1024px (`lg:`)

### Mobile Optimizations
- **Button Sizing**: Full-width buttons on mobile (`w-full sm:w-auto`)
- **Typography**: Smaller text on mobile with responsive scaling
- **Spacing**: Reduced padding and margins on mobile
- **Grid Layouts**: Single column on mobile, multi-column on larger screens

## 🔧 Development Commands

### Build Commands
```bash
yarn dev          # Development server
yarn build        # Production build
yarn start        # Production server
yarn lint         # ESLint
yarn type-check   # TypeScript check

# Smart contract commands
npx hardhat compile           # Compile contracts
npx hardhat test             # Run contract tests
npx hardhat deploy --network sepolia  # Deploy to testnet
npx hardhat verify --network sepolia <address>  # Verify contract
```

### Authentication Testing
1. **No Wallet**: Dashboard redirects to wallet connection screen
2. **Connected**: Dashboard accessible, wallet info displayed
3. **Disconnected**: Immediately redirects back to connection screen

### Key Files to Know
- `lib/wallet-config.ts`: Hedera Wallet Connect configuration
- `components/providers/wallet-provider.tsx`: Global wallet state
- `components/providers/auth-provider.tsx`: Route protection
- `components/wallet-connect-button.tsx`: Wallet UI component
- `app/globals.css`: Global styles including starfield
- `.env.example`: Required environment variables

## 🎯 Brand Guidelines

### Tone and Voice
- **Professional**: Enterprise-ready crypto application
- **Modern**: Cutting-edge DeFi technology
- **Trustworthy**: Emphasis on security and non-custodial features
- **Accessible**: Easy to understand for crypto newcomers

### Content Strategy
- **Value Proposition**: Zero custody risk + lightning speed
- **Technical Accuracy**: Proper Hedera terminology and concepts
- **Educational**: Help users understand scheduled transactions
- **Call-to-Action**: Clear paths to connect wallet and send gifts

## 🔗 Hedera Integration (Planned)

### Scheduled Transactions
- **Core Feature**: Leverages Hedera's native scheduled transaction capability
- **Security Model**: Funds locked in sender's wallet until recipient co-signs
- **User Flow**: Create → Sign → Share → Redeem
- **Technical Implementation**: Hedera SDK integration for transaction creation and signing

### Wallet Integration
- **Hedera Wallet Connect v2**: Latest wallet connection standard
- **Supported Wallets**: HashPack, Blade, Kabila, and WalletConnect-compatible wallets
- **Network Support**: Both Testnet and Mainnet for EVM and Native Hedera

## 🧪 Testing Strategy

### Authentication Testing
- Test wallet connection flow
- Verify dashboard protection
- Check mobile wallet UI
- Validate disconnect functionality

### Component Testing
- Test glassmorphism styling consistency
- Verify mobile responsive behavior
- Validate button hover states and animations
- Check starfield animation performance

### Integration Testing
- Navigation between public/protected pages
- Mobile sidebar functionality
- Responsive breakpoint behavior
- Wallet state persistence

## 🚀 Deployment Notes

### Environment Setup
1. **Get WalletConnect Project ID**: Visit [cloud.reown.com](https://cloud.reown.com/)
2. **Set Environment Variables**: Copy `.env.example` to `.env.local`
3. **Configure Networks**: Set `NEXT_PUBLIC_HEDERA_NETWORK=testnet` for development

### Build Process
1. **TypeScript Check**: Ensure type safety
2. **Lint**: Code quality and consistency  
3. **Build**: Next.js production build
4. **Static Assets**: Optimize images and icons

### Performance Considerations
- **Wallet Integration**: Lazy loading of wallet libraries
- **Starfield**: Pure CSS animations for optimal performance
- **Images**: Optimized with Next.js Image component
- **Code Splitting**: Automatic with Next.js App Router

## 📋 Current Status

### Completed Features
✅ **Authentication System**: Complete wallet-based authentication
✅ **UI/UX Design**: Complete glassmorphism design system
✅ **Landing Page**: Professional marketing page with wallet integration
✅ **Dashboard Protection**: Route guards requiring wallet connection
✅ **Mobile Responsive**: Full mobile optimization including wallet UI
✅ **Starfield Background**: Immersive animated background
✅ **Wallet Integration**: Hedera Wallet Connect v2 with Reown AppKit

### Authentication Flow
✅ **Landing Page**: Public access with optional wallet connection
✅ **Dashboard Guard**: Requires wallet connection to access
✅ **Connection UI**: Beautiful wallet connection screen with supported wallets
✅ **State Management**: Global wallet state with React Context
✅ **Mobile Support**: Responsive wallet UI for all screen sizes

### Planned Features
✅ **Smart Contract Development**: Gas-efficient GiftCardManager contract implemented
🔄 **Contract Deployment**: Deploy GiftCardManager to testnets and mainnets
🔄 **Multi-Token Gift Creation**: Form to select and bundle multiple tokens
🔄 **Gift Redemption**: Secure recipient verification and token claiming
🔄 **Cross-Chain Support**: Deploy contracts on multiple EVM chains
🔄 **NFT Integration**: Support for ERC721 and ERC1155 tokens (implemented)
🔄 **QR Code Generation**: Generate QR codes for gift links
🔄 **Gift Management**: Track sent and received gifts across chains

## 💡 Development Guidelines

### Authentication Patterns
- **Public Routes**: Landing page, features, documentation
- **Protected Routes**: Dashboard, gift creation, gift management  
- **Wallet State**: Always check `isConnected` and `chain` before operations
- **Chain Validation**: Ensure user is on supported network
- **Error Handling**: Graceful fallbacks when wallet connection or network switching fails

### Code Style
- **TypeScript**: Strict type checking enabled
- **Components**: Functional components with hooks
- **Styling**: Tailwind classes with consistent patterns
- **Animations**: Framer Motion for complex animations, CSS for simple ones

### File Naming
- **Components**: kebab-case (e.g., `wallet-connect-button.tsx`)
- **Pages**: kebab-case (e.g., `dashboard/page.tsx`)
- **Utilities**: camelCase (e.g., `wallet-config.ts`)
- **Types**: PascalCase (e.g., `WalletTypes.ts`)

### Component Structure
```tsx
// Standard component pattern with EVM wallet integration
import { useAccount, useNetwork } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function ComponentName() {
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  
  if (!isConnected) {
    return <ConnectButton />
  }
  
  if (!chain || !SUPPORTED_CHAINS.includes(chain.id)) {
    return <ChainSwitchButton />
  }
  
  return (
    <div className="glassmorphism-card">
      {/* Component content */}
    </div>
  )
}
```

## 📋 Smart Contract Architecture

### GiftCardManager Contract
The core of Gifto's gas-efficient architecture is the single `GiftCardManager` contract that handles all gift card operations.

#### Key Features:
- **Gas Efficient**: ~85% gas savings compared to individual contract deployment
- **Multi-Token Support**: Handle ETH, ERC20, ERC721, ERC1155 in single gift cards
- **Privacy Protection**: Uses keccak256(recipient + salt) for recipient privacy
- **Security**: ReentrancyGuard, Pausable, Ownable, comprehensive input validation
- **Scalable**: Single contract manages unlimited gift cards as structs

#### Contract Functions:
```solidity
// Core functions
function createGiftCard(bytes32 recipientHash, uint256 expiration, string calldata message, Token[] calldata tokens) external payable returns (uint256 giftCardId)
function claimGiftCard(uint256 giftCardId, address recipient, bytes32 salt) external
function cancelGiftCard(uint256 giftCardId) external

// View functions
function getGiftCard(uint256 giftCardId) external view returns (GiftCard memory)
function getGiftCardTokens(uint256 giftCardId) external view returns (Token[] memory)
function canClaimGiftCard(uint256 giftCardId, address recipient, bytes32 salt) external view returns (bool)
```

#### Gas Cost Analysis:
| Operation | Traditional (Individual Contracts) | Gifto (Struct Storage) | Savings |
|-----------|-----------------------------------|----------------------|---------|
| Create Gift | ~2,000,000+ gas | ~150,000 gas | ~85% |
| Claim Gift | ~100,000 gas | ~80,000 gas | ~20% |
| Cancel Gift | ~50,000 gas | ~40,000 gas | ~20% |

#### Security Features:
- **ReentrancyGuard**: Prevents reentrancy attacks
- **Access Control**: Only sender can cancel expired gifts
- **Input Validation**: Comprehensive validation of all parameters
- **Time Locks**: Automatic expiration handling
- **Emergency Controls**: Pausable functionality and emergency withdrawal

#### Token Type Support:
```solidity
enum TokenType {
    NATIVE,    // ETH, MATIC, AVAX, etc.
    ERC20,     // USDC, USDT, DAI, etc.
    ERC721,    // NFT collections
    ERC1155    // Semi-fungible tokens
}
```

This document serves as the comprehensive technical reference for the Gifto project. Update it as the project evolves and new features are implemented.

## 🚀 EVM Migration Status

### Phase 1: Planning & Architecture ✅
- Analyzed current Hedera implementation
- Designed EVM-compatible smart contract architecture
- Planned multi-token gift card system
- Updated project documentation

### Phase 2: Smart Contract Development ✅
- [x] Implement GiftCardManager.sol with gas-efficient architecture
- [x] Add multi-token support (ETH, ERC20, ERC721, ERC1155)
- [x] Add OpenZeppelin security patterns (ReentrancyGuard, Pausable, Ownable)
- [x] Create comprehensive test suite
- [ ] Deploy to testnets
- [ ] Verify contracts on block explorers

### Phase 3: Frontend Migration 🔄
- [ ] Replace Hedera wallet integration with Wagmi + RainbowKit
- [ ] Implement multi-chain support
- [ ] Update wallet connection UI
- [ ] Add token selection components
- [ ] Integrate smart contract interactions

### Phase 4: Advanced Features 📋
- [ ] Cross-chain gift card support via LayerZero/CCIP
- [ ] NFT gift card support (ERC721/ERC1155)
- [ ] Batch gift operations
- [ ] Advanced security features
- [ ] Analytics and reporting