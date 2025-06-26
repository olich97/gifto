"use client"

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { AppKitProvider } from './appkit-provider'

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
  const [appKitHooks, setAppKitHooks] = useState<any>(null)

  useEffect(() => {
    const initializeHooks = async () => {
      try {
        const { useAppKit, useAppKitAccount, useAppKitNetwork, useAppKitState } = await import('@reown/appkit/react')
        setAppKitHooks({ useAppKit, useAppKitAccount, useAppKitNetwork, useAppKitState })
        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to initialize AppKit hooks:', error)
      }
    }

    // Delay to ensure AppKit is initialized
    const timer = setTimeout(initializeHooks, 1000)
    return () => clearTimeout(timer)
  }, [])

  const connect = () => {
    if (appKitHooks) {
      const { useAppKit } = appKitHooks
      try {
        // This is a simplified approach - in practice you'd need to call this differently
        // For now, we'll handle this through direct AppKit modal opening
        if (typeof window !== 'undefined' && (window as any).appKit) {
          (window as any).appKit.open()
        } else {
          console.log('Opening wallet connection...')
          // Fallback approach
          setIsLoading(true)
        }
      } catch (error) {
        console.error('Error connecting wallet:', error)
      }
    }
  }

  const disconnect = async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).appKit) {
        await (window as any).appKit.disconnect()
      }
      setIsConnected(false)
      setAccountId(null)
      setNetwork(null)
    } catch (error) {
      console.error('Error disconnecting wallet:', error)
    }
  }

  const refreshConnection = () => {
    // Check connection state
    if (typeof window !== 'undefined' && (window as any).appKit) {
      try {
        const state = (window as any).appKit.getState()
        setIsConnected(Boolean(state.address))
        setAccountId(state.address || null)
        setNetwork(state.selectedNetworkId || null)
      } catch (error) {
        console.error('Error refreshing connection:', error)
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (isInitialized) {
      refreshConnection()
      
      // Set up periodic state checking
      const interval = setInterval(refreshConnection, 2000)
      return () => clearInterval(interval)
    }
  }, [isInitialized])

  return (
    <WalletContext.Provider 
      value={{
        isConnected,
        accountId,
        network,
        isLoading: isLoading && !isInitialized,
        isInitialized,
        connect,
        disconnect,
        refreshConnection
      }}
    >
      {children}
    </WalletContext.Provider>
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