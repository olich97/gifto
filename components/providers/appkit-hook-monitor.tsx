"use client"

import { useEffect, useState, useRef } from 'react'
import { useAppKitAccount, useAppKitState } from '@reown/appkit/react'

interface AppKitHookMonitorProps {
  onStateChange: (state: any) => void
}

// Component that actually uses the hooks - only rendered when AppKit is ready
const AppKitHooksConsumer = ({ onStateChange }: AppKitHookMonitorProps) => {
  const account = useAppKitAccount()
  const appKitState = useAppKitState()
  const previouslyConnected = useRef(false)

  useEffect(() => {
    console.log('AppKit Account Hook Data:', account)
    console.log('AppKit State Hook Data:', appKitState)
    
    // Extract Hedera account ID from CAIP address
    let accountId = null
    let network = null
    
    if (account.caipAddress && account.caipAddress.startsWith('hedera:')) {
      // Format: "hedera:testnet:0.0.123456" or "hedera:mainnet:0.0.123456"
      const parts = account.caipAddress.split(':')
      if (parts.length === 3) {
        network = parts[1] // "testnet" or "mainnet"
        accountId = parts[2] // "0.0.123456"
        console.log('Extracted Hedera Account ID:', accountId, 'Network:', network)
      }
    }
    
    // Detect successful connection
    if (account.isConnected && accountId && !previouslyConnected.current) {
      console.log('🎉 Wallet connected successfully!', accountId)
      previouslyConnected.current = true
    } else if (!account.isConnected) {
      previouslyConnected.current = false
    }
    
    // Fix loading state - if we have account info and are connected, we're not loading
    // Even if AppKit still shows loading=true
    const actuallyLoading = appKitState.loading && !account.isConnected && !account.caipAddress
    
    onStateChange({
      isConnected: account.isConnected && appKitState.initialized,
      accountId,
      address: account.address,
      caipAddress: account.caipAddress,
      network,
      isLoading: actuallyLoading,
      isInitialized: appKitState.initialized
    })
  }, [
    account.isConnected, 
    account.caipAddress, 
    account.address,
    appKitState.initialized, 
    appKitState.loading,
    onStateChange
  ])

  return null
}

// Wrapper that waits for AppKit to be ready
export const AppKitHookMonitor = ({ onStateChange }: AppKitHookMonitorProps) => {
  const [appKitReady, setAppKitReady] = useState(false)
  
  useEffect(() => {
    const checkAppKit = () => {
      if (typeof window !== 'undefined' && (window as any).appKit) {
        console.log('AppKit detected, enabling hooks')
        setAppKitReady(true)
      } else {
        // Keep checking every 500ms until AppKit is ready
        setTimeout(checkAppKit, 500)
      }
    }
    
    checkAppKit()
  }, [])

  // Only render the hooks consumer when AppKit is ready
  if (!appKitReady) {
    return null
  }

  return <AppKitHooksConsumer onStateChange={onStateChange} />
}