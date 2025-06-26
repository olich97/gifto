"use client"

import { useWallet } from '@/components/providers/wallet-provider'
import { Button } from '@/components/ui/button'
import { Wallet, LogOut, Loader2, Network } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface WalletConnectButtonProps {
  className?: string
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
  showAccountId?: boolean
}

export const WalletConnectButton = ({ 
  className, 
  size = 'default',
  variant = 'default',
  showAccountId = true
}: WalletConnectButtonProps) => {
  const { isConnected, accountId, network, isLoading, isInitialized, connect, disconnect, refreshConnection } = useWallet()

  const formatAccountId = (accountId: string) => {
    if (accountId.length <= 12) return accountId
    return `${accountId.slice(0, 6)}...${accountId.slice(-6)}`
  }

  // Show loading state if AppKit is not initialized or if we're in a loading state
  if (!isInitialized || isLoading) {
    return (
      <Button 
        className={cn(className)} 
        size={size} 
        variant={variant}
        disabled
      >
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {!isInitialized ? 'Initializing...' : 'Connecting...'}
      </Button>
    )
  }

  if (isConnected && accountId) {
    return (
      <div className="flex items-center gap-2">
        {showAccountId && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-mono text-white">
              {formatAccountId(accountId)}
            </span>
            {network && (
              <span className="text-xs text-muted-foreground">
                ({network.replace('hedera:', '')})
              </span>
            )}
          </div>
        )}
        <Button 
          onClick={disconnect}
          className={cn(className)} 
          size={size} 
          variant="outline"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Disconnect</span>
          <span className="sm:hidden">DC</span>
        </Button>
      </div>
    )
  }

  return (
    <Button 
      onClick={connect}
      className={cn(className)} 
      size={size} 
      variant={variant}
    >
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  )
}