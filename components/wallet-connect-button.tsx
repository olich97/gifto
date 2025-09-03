"use client"

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useWallet, useBalance } from '@/components/providers/wallet-provider'
import { Button } from '@/components/ui/button'
import { Wallet, LogOut, Copy, ExternalLink, ChevronDown, User, Coins } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button 
                    onClick={openConnectModal}
                    className={cn(
                      "bg-gradient-to-r from-[#FF4D9D] to-[#FF8A39] hover:from-[#FF6BA8] hover:to-[#FFA055]",
                      "border-0 text-white font-semibold rounded-lg transition-all duration-200",
                      "hover:shadow-lg hover:shadow-primary/30 hover:scale-105",
                      className
                    )}
                    size={size}
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button 
                    onClick={openChainModal}
                    variant="destructive"
                    size={size}
                    className={cn(className)}
                  >
                    Wrong network
                  </Button>
                );
              }

              // Collapsed mode: show elegant chain icon with rich tooltip
              if (!showAccountId) {
                return (
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={openAccountModal}
                          variant="ghost"
                          className={cn(
                            "group relative w-12 h-12 p-0 rounded-xl transition-all duration-300",
                            "bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm",
                            "border border-white/10 hover:border-white/25",
                            "hover:shadow-lg hover:shadow-primary/20",
                            "focus:ring-2 focus:ring-primary/50 focus:ring-offset-0",
                            className
                          )}
                        >
                          {/* Connection status indicator */}
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-2 border-black/50 shadow-lg">
                            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
                          </div>
                          
                          {/* Chain icon or user icon */}
                          <div className="relative">
                            {chain.hasIcon ? (
                              <div className="relative">
                                <div
                                  style={{
                                    background: chain.iconBackground,
                                    width: 24,
                                    height: 24,
                                    borderRadius: 8,
                                    overflow: 'hidden',
                                  }}
                                  className="shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                                >
                                  <img
                                    alt={chain.name ?? 'Chain icon'}
                                    src={chain.iconUrl}
                                    style={{ width: 24, height: 24 }}
                                  />
                                </div>
                                <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                            )}
                          </div>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent 
                        side="right" 
                        className="max-w-sm p-0 border-white/20 shadow-2xl"
                      >
                        <div className="bg-black/95 backdrop-blur-sm rounded-lg p-4 space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              {chain.hasIcon && (
                                <div
                                  style={{
                                    background: chain.iconBackground,
                                    width: 20,
                                    height: 20,
                                    borderRadius: 6,
                                    overflow: 'hidden',
                                  }}
                                >
                                  <img
                                    alt={chain.name ?? 'Chain icon'}
                                    src={chain.iconUrl}
                                    style={{ width: 20, height: 20 }}
                                  />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-white text-sm">{chain.name}</p>
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                                <span className="text-xs text-green-400">Connected</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                          
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Account</p>
                              <p className="font-mono text-sm text-white font-medium">{account.displayName}</p>
                            </div>
                            {account.displayBalance && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Balance</p>
                                <p className="text-sm text-primary font-medium">{account.displayBalance}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              }

              // Full mode: stunning account card with chain integration
              return (
                <Button
                  onClick={openAccountModal}
                  variant="outline"
                  className={cn(
                    "group relative w-full h-auto p-0 rounded-xl transition-all duration-300",
                    "bg-gradient-to-br from-black/30 to-black/50 backdrop-blur-sm",
                    "border border-white/10 hover:border-white/25",
                    "hover:shadow-lg hover:shadow-primary/10",
                    "focus:ring-2 focus:ring-primary/50 focus:ring-offset-0",
                    "overflow-hidden",
                    className
                  )}
                  size={size}
                >
                  {/* Subtle background pattern */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,77,157,0.03)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative flex items-center gap-3 p-4 w-full">
                    {/* Chain indicator with glow */}
                    <div className="relative flex-shrink-0">
                      {chain.hasIcon && (
                        <div className="relative">
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 24,
                              height: 24,
                              borderRadius: 8,
                              overflow: 'hidden',
                            }}
                            className="shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                          >
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              style={{ width: 24, height: 24 }}
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      )}
                    </div>
                    
                    {/* Account info section */}
                    <div className="flex flex-col items-start min-w-0 flex-1">
                      {/* Account name with status */}
                      <div className="flex items-center gap-2 min-w-0 w-full mb-1">
                        <div className="relative">
                          <div className="w-2 h-2 bg-gradient-to-br from-green-400 to-green-500 rounded-full shadow-sm" />
                          <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-40" />
                        </div>
                        <span className="text-sm font-semibold text-white truncate max-w-[140px] group-hover:text-white/90 transition-colors">
                          {account.displayName}
                        </span>
                      </div>
                      
                      {/* Balance and network info */}
                      {account.displayBalance && (
                        <div className="flex items-center justify-between w-full text-xs">
                          <span className="font-mono text-primary/90 font-medium truncate max-w-[100px]">
                            {account.displayBalance}
                          </span>
                          <span className="text-muted-foreground/70 px-2 py-0.5 bg-white/5 rounded-md text-[10px] font-medium">
                            {chain.name}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Subtle arrow indicator */}
                    <div className="flex-shrink-0 w-4 h-4 rounded-full bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors duration-300">
                      <div className="w-1.5 h-1.5 border-t border-r border-white/40 rotate-45 transform group-hover:border-white/60 transition-colors duration-300" />
                    </div>
                  </div>
                </Button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}