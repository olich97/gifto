# CLAUDE.md - Gifto Project Context

This file contains essential information for Claude about the Gifto project, including architecture, design decisions, development patterns, and technical implementation details.

## 🎯 Project Overview

**Gifto** is a modern dApp for sending cryptocurrency as digital gift cards on Hedera Hashgraph. The project transforms a Next.js dashboard template into a crypto gifting platform with zero custody risk using Hedera's scheduled transactions.

### Core Concept
- **Senders**: Create gift cards by signing scheduled transactions that lock funds in their wallet
- **Recipients**: Claim gifts by co-signing the scheduled transaction, triggering instant transfer
- **Security**: Funds never leave the sender's wallet until redemption - no custodial risk

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Blockchain**: Hedera Hashgraph
- **Wallet Integration**: Hedera Wallet Connect v2 + Reown AppKit
- **Authentication**: Non-custodial wallet-based authentication

### Project Structure
```
├── app/                     # Next.js App Router pages
│   ├── dashboard/          # Gift management interface (protected)
│   ├── redeem/            # Gift redemption page (planned)
│   ├── page.tsx           # Landing page (public)
│   ├── globals.css        # Global styles + starfield background
│   └── layout.tsx         # Root layout with wallet provider
├── components/
│   ├── dashboard/         # Dashboard-specific components
│   ├── layout/           # Sidebar, mobile nav, etc.
│   ├── providers/        # React context providers
│   │   ├── wallet-provider.tsx    # Wallet connection state
│   │   └── auth-provider.tsx      # Authentication guard
│   ├── ui/               # shadcn/ui base components
│   └── wallet-connect-button.tsx  # Wallet connection UI
├── design_reference/     # Design mockups and inspiration
├── lib/
│   ├── wallet-config.ts  # Hedera Wallet Connect configuration
│   └── utils.ts          # Utilities and server actions
├── template.config.ts    # App configuration
└── types/               # TypeScript type definitions
```

## 🔐 Authentication System

### Wallet-Based Authentication
- **Non-Custodial**: Users authenticate with their Hedera wallets
- **Landing Page**: Always public and accessible
- **Dashboard**: Protected route requiring wallet connection
- **Supported Wallets**: HashPack, Blade, Kabila, and other WalletConnect-compatible wallets

### Implementation Details
```typescript
// Wallet Provider wraps the entire app
<WalletProvider>
  <AuthProvider requireAuth={true}> // Dashboard only
    <DashboardContent />
  </AuthProvider>
</WalletProvider>
```

### Key Components
- **WalletProvider**: Manages wallet connection state globally
- **AuthProvider**: Guards protected routes, shows connection UI if needed
- **WalletConnectButton**: Unified wallet connection interface

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

## 🔧 Wallet Integration

### Dependencies
```json
{
  "@hashgraph/hedera-wallet-connect": "2.0.1-canary.24fffa7.0",
  "@hashgraph/sdk": "^2.67.0",
  "@reown/appkit": "^1.7.11",
  "@reown/appkit-adapter-wagmi": "^1.7.11",
  "@walletconnect/universal-provider": "^2.21.4",
  "@wagmi/core": "^2.17.3",
  "wagmi": "^2.15.6",
  "ethers": "^6.14.4",
  "viem": "^2.31.4"
}
```

### Environment Variables
```bash
# Required for wallet authentication
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Optional Hedera configuration
NEXT_PUBLIC_HEDERA_NETWORK=testnet
HEDERA_ACCOUNT_ID=0.0.xxxxx
HEDERA_PRIVATE_KEY=302xxx...
```

### Wallet State Management
```typescript
const { isConnected, accountId, network, isLoading, connect, disconnect } = useWallet()

// Connection states:
// - isLoading: Checking wallet connection status
// - isConnected: Wallet is connected and authenticated
// - accountId: Hedera account ID (e.g., "0.0.123456")
// - network: Current network (Testnet/Mainnet)
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
  <span className="text-sm font-mono text-white">{accountId}</span>
</div>

// Disconnect button
<Button variant="outline" onClick={disconnect}>
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
🔄 **Hedera SDK Integration**: Transaction creation and signing
🔄 **Gift Creation**: Form to create scheduled transactions
🔄 **Gift Redemption**: Page for recipients to claim gifts
🔄 **QR Code Generation**: Generate QR codes for gift links
🔄 **Gift Management**: Track sent and received gifts

## 💡 Development Guidelines

### Authentication Patterns
- **Public Routes**: Landing page, features, documentation
- **Protected Routes**: Dashboard, gift creation, gift management  
- **Wallet State**: Always check `isConnected` before wallet operations
- **Error Handling**: Graceful fallbacks when wallet connection fails

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
// Standard component pattern with wallet integration
export default function ComponentName() {
  const { isConnected, accountId } = useWallet()
  
  if (!isConnected) {
    return <WalletConnectButton />
  }
  
  return (
    <div className="glassmorphism-card">
      {/* Component content */}
    </div>
  )
}
```

This document serves as the comprehensive technical reference for the Gifto project. Update it as the project evolves and new features are implemented.