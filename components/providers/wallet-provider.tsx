"use client"

import { ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { config } from '@/lib/wagmi-config'

import '@rainbow-me/rainbowkit/styles.css'

// Create a client
const queryClient = new QueryClient()

interface WalletProviderProps {
  children: ReactNode
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          theme={darkTheme({
            accentColor: '#FF4D9D',
            accentColorForeground: 'white',
            borderRadius: 'medium',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
          modalSize="compact"
          coolMode
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

// Export Wagmi hooks for easy access
export {
  useAccount,
  useConnect,
  useDisconnect,
  useChainId,
  useSwitchChain,
  useBalance,
  useReadContract,
  useWriteContract,
  useWatchContractEvent,
} from 'wagmi'

export { useConnectModal } from '@rainbow-me/rainbowkit'

// Legacy compatibility - map old useWallet to new Wagmi hooks
import { useAccount as useWagmiAccount, useDisconnect as useWagmiDisconnect } from 'wagmi'
import { useConnectModal as useRainbowConnectModal } from '@rainbow-me/rainbowkit'

export const useWallet = () => {
  const { address, isConnected, connector, chain } = useWagmiAccount()
  const { disconnect } = useWagmiDisconnect()
  const { openConnectModal } = useRainbowConnectModal()
  
  return {
    isConnected,
    address,
    accountId: address, // For backward compatibility
    network: chain?.name.toLowerCase(),
    chainId: chain?.id,
    chain,
    connector,
    isLoading: false,
    isInitialized: true,
    connect: () => openConnectModal?.(),
    disconnect,
    refreshConnection: () => {
      console.log('Connection refresh - managed by Wagmi')
    }
  }
}