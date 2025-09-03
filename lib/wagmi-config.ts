import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import {
  mainnet,
  polygon,
  arbitrum,
  base,
  optimism,
  sepolia,
  polygonMumbai,
  arbitrumGoerli,
  baseGoerli,
  optimismGoerli,
} from 'wagmi/chains'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!projectId) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is required')
}

// Define supported chains for mainnet and testnet
export const mainnetChains = [mainnet, polygon, arbitrum, base, optimism]
export const testnetChains = [sepolia, polygonMumbai, arbitrumGoerli, baseGoerli, optimismGoerli]

// Use testnet chains for development, mainnet for production
export const chains = process.env.NODE_ENV === 'development' ? testnetChains : mainnetChains

export const config = getDefaultConfig({
  appName: 'Gifto - Multi-Token Crypto Gift Cards',
  projectId,
  chains,
  ssr: true, // Enable SSR support for Next.js
})

// Import contract addresses from contracts lib
export { GIFT_CARD_MANAGER_ADDRESSES, getGiftCardManagerAddress } from './contracts'

// Default chain for the app
export const defaultChain = process.env.NODE_ENV === 'development' ? sepolia : mainnet