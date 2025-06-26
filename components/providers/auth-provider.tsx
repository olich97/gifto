"use client"

import { useWallet } from '@/components/providers/wallet-provider'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import { Loader2, Shield, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WalletConnectButton } from '@/components/wallet-connect-button'

interface AuthProviderProps {
  children: ReactNode
  requireAuth?: boolean
}

export const AuthProvider = ({ children, requireAuth = false }: AuthProviderProps) => {
  const { isConnected, isLoading, isInitialized, accountId } = useWallet()
  const router = useRouter()

  // Debug logging
  console.log('AuthProvider - requireAuth:', requireAuth, 'isConnected:', isConnected, 'isLoading:', isLoading, 'isInitialized:', isInitialized, 'accountId:', accountId)

  // Show loading spinner while AppKit is initializing or checking wallet connection
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-transparent">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">
            {!isInitialized ? 'Initializing wallet system...' : 'Checking wallet connection...'}
          </p>
        </div>
      </div>
    )
  }

  // If authentication is required but user is not connected or doesn't have an account
  if (requireAuth && (!isConnected || !accountId)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-transparent p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-r from-[#FF4D9D] to-[#FF8A39] rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <Shield className="h-10 w-10 text-white" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Wallet Required
            </h1>
            <p className="text-muted-foreground">
              Connect your Hedera wallet to access the Gifto dashboard and start sending crypto gifts.
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Wallet className="h-4 w-4 text-primary" />
                <span>Supports HashPack, Blade, Kabila and more</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                <span>Non-custodial - your keys, your crypto</span>
              </div>
            </div>
          </div>

          <WalletConnectButton 
            className="w-full"
            size="lg"
          />

          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="text-muted-foreground hover:text-white"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}