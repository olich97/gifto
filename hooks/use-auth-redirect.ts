"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@/components/providers/wallet-provider'

export function useAuthRedirect() {
  const { isConnected, accountId } = useWallet()
  const router = useRouter()

  useEffect(() => {
    // Only redirect if wallet just connected and we're on the landing page
    if (isConnected && accountId) {
      const currentPath = window.location.pathname
      if (currentPath === '/' || currentPath === '/connect') {
        // Add a small delay to ensure wallet state is fully settled
        const timeoutId = setTimeout(() => {
          console.log('Redirecting to dashboard after wallet connection')
          router.push('/dashboard')
        }, 100)

        return () => clearTimeout(timeoutId)
      }
    }
  }, [isConnected, accountId, router])
}