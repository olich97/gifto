"use client"

import { ReactNode, useEffect, useState } from 'react'
import { projectId } from '@/lib/config'

// Initialize AppKit outside of component to avoid re-initialization
let appKitInitialized = false

const initializeAppKit = async () => {
  if (appKitInitialized || typeof window === 'undefined' || !projectId) {
    return
  }

  try {
    const { createAppKit } = await import('@reown/appkit/react')
    const { HederaAdapter } = await import('@hashgraph/hedera-wallet-connect')
    const { HederaChainDefinition } = await import('@hashgraph/hedera-wallet-connect')
    
    const metadata = {
      name: 'Gifto',
      description: 'Send crypto gifts instantly on Hedera Hashgraph',
      url: typeof window !== 'undefined' ? window.location.origin : 'https://gifto.app',
      icons: [typeof window !== 'undefined' ? `${window.location.origin}/gifto.png` : 'https://gifto.app/gifto.png']
    }

    // Use only native Hedera networks for stability
    const networks = [
      HederaChainDefinition.Native.Testnet,
      HederaChainDefinition.Native.Mainnet
    ]

    // Initialize the adapter
    const hederaAdapter = new HederaAdapter({
      projectId: projectId!,
      networks,
      namespace: 'hedera'
    })

    // Create AppKit with just the Hedera adapter
    const appKit = createAppKit({
      adapters: [hederaAdapter],
      projectId: projectId!,
      metadata,
      networks,
      defaultNetwork: networks[0],
      themeMode: 'dark',
      themeVariables: {
        '--w3m-font-family': 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        '--w3m-accent': '#FF4D9D',
        '--w3m-color-mix': '#FF4D9D',
        '--w3m-color-mix-strength': 20,
        '--w3m-border-radius-master': '12px',
        '--w3m-background-color': '#1B1243',
        '--w3m-color-overlay': 'rgba(12, 14, 37, 0.8)',
        '--w3m-color-bg-1': 'rgba(27, 18, 67, 0.95)',
        '--w3m-color-bg-2': 'rgba(0, 0, 0, 0.4)',
        '--w3m-color-bg-3': 'rgba(255, 255, 255, 0.05)',
        '--w3m-color-fg-1': '#ffffff',
        '--w3m-color-fg-2': 'rgba(255, 255, 255, 0.7)',
        '--w3m-color-fg-3': 'rgba(255, 255, 255, 0.5)',
        '--w3m-color-success': '#5EF58C',
        '--w3m-color-error': '#FF4E4E',
        '--w3m-border-color': 'rgba(255, 255, 255, 0.1)',
        '--w3m-overlay-background-color': 'rgba(12, 14, 37, 0.9)',
        '--w3m-overlay-backdrop-filter': 'blur(10px)',
      },
      features: {
        analytics: true,
        socials: false,
        swaps: false,
        onramp: false,
        email: false,
      }
    })

    // Store globally for access
    if (typeof window !== 'undefined') {
      (window as any).appKit = appKit
    }

    appKitInitialized = true
    console.log('AppKit initialized successfully with Hedera')
  } catch (error) {
    console.error('Failed to initialize AppKit:', error)
  }
}

interface AppKitProviderProps {
  children: ReactNode
}

export const AppKitProvider = ({ children }: AppKitProviderProps) => {
  const [mounted, setMounted] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !initialized) {
      initializeAppKit().then(() => {
        setInitialized(true)
      })
    }
  }, [mounted, initialized])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}