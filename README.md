# ⚡ Gifto - Crypto Gift Cards on Hedera

**Revolutionizing crypto gifting with zero custody risk and lightning-fast redemption**

Gifto is a modern dApp built on Hedera Hashgraph that enables users to send cryptocurrency as digital gift cards. Using Hedera's scheduled transactions, recipients can claim gifts instantly while funds remain secure in the sender's wallet until redemption.

![Gifto Banner](public/gifto.png)

## ✨ Features

### 🎁 **Core Gifting Features**
- **Zero Custody Risk**: Funds stay in your wallet until redemption via Hedera scheduled transactions
- **Lightning Fast**: Recipients can claim gifts in under 3 seconds
- **Share by Link or QR**: Send gifts via shareable links or QR codes
- **Multi-Token Support**: Send HBAR or any HTS (Hedera Token Service) tokens
- **No Signup Required**: Frictionless onboarding for recipients

### 🔒 **Security & Trust**
- **Non-Custodial**: No custodial accounts or third-party custody
- **Scheduled Transactions**: Leverages Hedera's native scheduled transaction feature
- **Wallet Integration**: Seamless integration with Hedera-compatible wallets
- **PIN Protection**: Optional PIN protection for open gift links

### 🎨 **Beautiful UI/UX**
- **Modern Design**: Stunning glassmorphism design with animated starfield background
- **Mobile-First**: Optimized for mobile devices with touch-friendly interfaces
- **Dark Theme**: Elegant dark theme with Gifto brand colors (flamingo pink to tangerine orange)
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Beautiful transitions and hover effects

### ⚡ **Technical Excellence**
- **Next.js 15**: Latest features with Turbopack for fast development
- **TypeScript**: Full type safety throughout the application
- **Hedera Integration**: Built specifically for Hedera Hashgraph
- **Performance Optimized**: Server components and optimal caching
- **PWA Ready**: Progressive Web App capabilities

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Blockchain**: [Hedera Hashgraph](https://hedera.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- yarn (recommended)
- Hedera testnet/mainnet account

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
1. **Create Your Gift**: Choose HBAR or HTS token, set amount, add recipient details
2. **Sign Transaction**: Sign a scheduled transaction that locks funds safely in your wallet
3. **Share**: Share the gift link or QR code with your recipient

### For Recipients:
1. **Click Link**: Open the gift link or scan QR code
2. **Connect Wallet**: Connect your Hedera wallet
3. **Claim Instantly**: Co-sign the transaction to receive your gift instantly

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
├── design_reference/           # Design mockups and references
├── lib/                        # Utilities and actions
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

## 🔗 Hedera Integration

### Scheduled Transactions
Gifto leverages Hedera's unique scheduled transaction feature:
- **Security**: Funds never leave sender's wallet until redemption
- **Efficiency**: No custodial smart contracts needed
- **Speed**: Instant execution when recipient signs
- **Cost**: Minimal transaction fees

### Supported Tokens
- **HBAR**: Native Hedera cryptocurrency
- **HTS Tokens**: Any Hedera Token Service token
- **Future**: Multi-chain support via Chainlink CCIP

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
NEXT_PUBLIC_HEDERA_NETWORK=testnet
HEDERA_ACCOUNT_ID=your_account_id
HEDERA_PRIVATE_KEY=your_private_key
```

## 🔒 Security

- **Non-Custodial**: No funds held by the application
- **Wallet Security**: Users maintain full control of their assets
- **Scheduled Transactions**: Secure Hedera-native functionality
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

- [Hedera Hashgraph](https://hedera.com/) for the amazing DLT platform
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Next.js](https://nextjs.org/) team for the incredible framework
- The Hedera developer community for inspiration and support

---

**Built with ❤️ for the decentralized future**

If you found Gifto helpful, please consider giving it a ⭐ on GitHub!

## 🔗 Links

- **Website**: [gifto.app](https://gifto.app) (when deployed)
- **Hedera Portal**: [portal.hedera.com](https://portal.hedera.com)
- **Documentation**: [docs.hedera.com](https://docs.hedera.com)
- **Community**: [Discord](https://discord.gg/hedera) | [Twitter](https://twitter.com/hedera)