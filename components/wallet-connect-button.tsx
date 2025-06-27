"use client"

import { useWallet } from '@/components/providers/wallet-provider'
import { Button } from '@/components/ui/button'
import { Wallet, LogOut, Loader2, Copy, ExternalLink, ChevronDown, User, Coins } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { useHederaBalance, formatBalance } from '@/hooks/useHederaBalance'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
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
  const { isConnected, accountId, network, isLoading, isInitialized, connect, disconnect } = useWallet()
  const { balance, loading: balanceLoading } = useHederaBalance(accountId, network)
  const [copied, setCopied] = useState(false)

  const formatAccountId = (accountId: string) => {
    if (accountId.length <= 12) return accountId
    return `${accountId.slice(0, 6)}...${accountId.slice(-6)}`
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const getExplorerUrl = (accountId: string, network: string) => {
    const baseUrl = network === 'mainnet' 
      ? 'https://hashscan.io/mainnet/account'
      : 'https://hashscan.io/testnet/account'
    return `${baseUrl}/${accountId}`
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className={cn(
              "bg-black/40 backdrop-blur-sm border-white/10 hover:border-white/20 hover:bg-black/60",
              "flex items-center gap-3 h-10 px-4 rounded-lg transition-all duration-200",
              "hover:shadow-lg hover:shadow-primary/20",
              className
            )}
          >
            <div className="flex items-center gap-3">
              {/* Status indicator */}
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              
              {/* Account info - clean layout */}
              <span className="text-sm font-mono text-white">
                {formatAccountId(accountId)}
              </span>
              
              <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          className="w-80 bg-black/40 backdrop-blur-sm border-white/10 rounded-xl shadow-2xl shadow-black/50"
          align="end"
          sideOffset={12}
        >
          <DropdownMenuLabel className="text-white">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Wallet Account
            </div>
          </DropdownMenuLabel>
          
          <div className="p-3">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 space-y-3 border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Account ID</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-white">{accountId}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => copyToClipboard(accountId)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {balance?.hbar && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">HBAR Balance</span>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center">
                      <Coins className="h-2.5 w-2.5 text-black" />
                    </div>
                    <span className="text-sm font-bold text-white">
                      {formatBalance(balance.hbar)}
                    </span>
                    <span className="text-xs text-yellow-400 font-medium">HBAR</span>
                  </div>
                </div>
              )}
              
              {balance?.tokens && balance.tokens.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-medium text-muted-foreground border-b border-white/10 pb-1">Token Holdings</span>
                  {balance.tokens.slice(0, 2).map((token) => (
                    <div key={token.tokenId} className="flex items-center justify-between py-1">
                      <span className="text-xs font-medium text-muted-foreground">{token.symbol}</span>
                      <span className="text-xs font-semibold text-white">
                        {formatBalance(token.balance, token.decimals)}
                      </span>
                    </div>
                  ))}
                  {balance.tokens.length > 2 && (
                    <div className="text-center pt-1">
                      <span className="text-xs text-primary font-medium">
                        +{balance.tokens.length - 2} more tokens
                      </span>
                    </div>
                  )}
                </div>
              )}
              
              {network && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Network</span>
                  <span className="text-sm text-white capitalize">
                    {network}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <DropdownMenuSeparator className="bg-white/10" />
          
          {copied && (
            <DropdownMenuItem disabled className="text-green-400">
              ✓ Copied to clipboard
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem 
            onClick={() => window.open(getExplorerUrl(accountId, network || 'testnet'), '_blank')}
            className="dropdown-menu-item"
          >
            <ExternalLink className="mr-3 h-4 w-4" />
            View on HashScan
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => copyToClipboard(accountId)}
            className="dropdown-menu-item"
          >
            <Copy className="mr-3 h-4 w-4" />
            Copy Account ID
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-white/10 mx-2" />
          
          <DropdownMenuItem 
            onClick={disconnect}
            className="dropdown-menu-item-danger"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Disconnect Wallet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button 
      onClick={connect}
      className={cn(
        "bg-gradient-to-r from-[#FF4D9D] to-[#FF8A39] hover:from-[#FF6BA8] hover:to-[#FFA055]",
        "border-0 text-white font-semibold rounded-lg transition-all duration-200",
        "hover:shadow-lg hover:shadow-primary/30 hover:scale-105 wallet-button-glow",
        className
      )} 
      size={size}
    >
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  )
}