"use client"

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { AppKitProvider } from './appkit-provider'
import { AppKitHookMonitor } from './appkit-hook-monitor'

interface WalletContextType {
  isConnected: boolean
  accountId: string | null
  network: string | null
  isLoading: boolean
  isInitialized: boolean
  connect: () => void
  disconnect: () => Promise<void>
  refreshConnection: () => void
}

const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  accountId: null,
  network: null,
  isLoading: true,
  isInitialized: false,
  connect: () => {},
  disconnect: async () => {},
  refreshConnection: () => {}
})

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

interface WalletProviderProps {
  children: ReactNode
}


const WalletProviderInner = ({ children }: WalletProviderProps) => {
  const [isConnected, setIsConnected] = useState(false)
  const [accountId, setAccountId] = useState<string | null>(null)
  const [network, setNetwork] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  const handleStateChange = (state: any) => {
    console.log('Wallet state changed via hooks:', state)
    setIsConnected(state.isConnected)
    setAccountId(state.accountId)
    setNetwork(state.network)
    setIsLoading(state.isLoading)
    setIsInitialized(state.isInitialized)
  }

  const connect = () => {
    if (typeof window !== 'undefined' && (window as any).appKit) {
      (window as any).appKit.open()
    }
  }

  const disconnect = async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).appKit) {
        await (window as any).appKit.disconnect()
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error)
    }
  }

  const refreshConnection = () => {
    // The state is now managed through AppKit hooks
    console.log('Connection refresh requested - state managed by hooks')
  }

  return (
    <>
      <AppKitHookMonitor onStateChange={handleStateChange} />
      <WalletContext.Provider 
        value={{
          isConnected,
          accountId,
          network,
          isLoading,
          isInitialized,
          connect,
          disconnect,
          refreshConnection
        }}
      >
        {children}
      </WalletContext.Provider>
    </>
  )
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  return (
    <AppKitProvider>
      <WalletProviderInner>
        {children}
      </WalletProviderInner>
    </AppKitProvider>
  )
}