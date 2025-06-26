"use client"

import { ReactNode, useEffect, useState } from 'react'
import { projectId, createHederaConfig } from '@/lib/config'

// Initialize AppKit outside of component to avoid re-initialization
let appKitInitialized = false

const initializeAppKit = async () => {
  if (appKitInitialized || typeof window === 'undefined' || !projectId) {
    return
  }

  try {
    const { createAppKit } = await import('@reown/appkit/react')
    const { hederaTestnet } = await import('@reown/appkit/networks')
    
    const config = await createHederaConfig()
    if (!config) return

    const appKit = createAppKit({
      adapters: [config.nativeHederaAdapter],
      universalProvider: config.universalProvider,
      defaultNetwork: hederaTestnet,
      projectId,
      metadata: config.metadata,
      networks: config.networks,
      themeMode: 'dark',
      features: {
        analytics: true,
        socials: false,
        swaps: false,
        onramp: false,
        email: false,
      },
    })

    // Expose AppKit instance globally for easy access
    if (typeof window !== 'undefined') {
      (window as any).appKit = appKit
    }

    appKitInitialized = true
    console.log('AppKit initialized successfully with Hedera native adapter')
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