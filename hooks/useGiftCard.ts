import { useReadContract, useWriteContract, useWatchContractEvent } from 'wagmi'
import { useChainId } from 'wagmi'
import { getGiftCardManagerConfig, type GiftCard, type Token, type GiftCardStatistics } from '@/lib/contracts'
import { Address } from 'viem'

// Read hooks
export const useGiftCard = (giftCardId: number) => {
  const chainId = useChainId()
  
  return useReadContract({
    ...getGiftCardManagerConfig(chainId),
    functionName: 'getGiftCard',
    args: [BigInt(giftCardId)],
    query: {
      enabled: giftCardId > 0
    }
  }) as { data: GiftCard | undefined; isLoading: boolean; error: Error | null }
}

export const useGiftCardTokens = (giftCardId: number) => {
  const chainId = useChainId()
  
  return useReadContract({
    ...getGiftCardManagerConfig(chainId),
    functionName: 'getGiftCardTokens',
    args: [BigInt(giftCardId)],
    query: {
      enabled: giftCardId > 0
    }
  }) as { data: Token[] | undefined; isLoading: boolean; error: Error | null }
}

export const useCanClaimGiftCard = (
  giftCardId: number,
  recipient: Address,
  salt: `0x${string}`
) => {
  const chainId = useChainId()
  
  return useReadContract({
    ...getGiftCardManagerConfig(chainId),
    functionName: 'canClaimGiftCard',
    args: [BigInt(giftCardId), recipient, salt],
    query: {
      enabled: giftCardId > 0 && !!recipient && !!salt
    }
  }) as { data: boolean | undefined; isLoading: boolean; error: Error | null }
}

export const useGiftCardsBySender = (sender: Address) => {
  const chainId = useChainId()
  
  return useReadContract({
    ...getGiftCardManagerConfig(chainId),
    functionName: 'getGiftCardsBySender',
    args: [sender],
    query: {
      enabled: !!sender
    }
  }) as { data: bigint[] | undefined; isLoading: boolean; error: Error | null }
}

export const useGiftCardStatistics = () => {
  const chainId = useChainId()
  
  return useReadContract({
    ...getGiftCardManagerConfig(chainId),
    functionName: 'getStatistics'
  }) as { data: GiftCardStatistics | undefined; isLoading: boolean; error: Error | null }
}

export const useTotalGiftCards = () => {
  const chainId = useChainId()
  
  return useReadContract({
    ...getGiftCardManagerConfig(chainId),
    functionName: 'getTotalGiftCards'
  }) as { data: bigint | undefined; isLoading: boolean; error: Error | null }
}

// Write hooks
export const useCreateGiftCard = () => {
  return useWriteContract()
}

export const useClaimGiftCard = () => {
  return useWriteContract()
}

export const useCancelGiftCard = () => {
  return useWriteContract()
}

// Event watching hooks
export const useWatchGiftCardCreated = (
  onCreated: (giftCardId: bigint, sender: Address, recipientHash: `0x${string}`) => void
) => {
  const chainId = useChainId()
  
  useWatchContractEvent({
    ...getGiftCardManagerConfig(chainId),
    eventName: 'GiftCardCreated',
    onLogs: (logs) => {
      logs.forEach((log) => {
        const { giftCardId, sender, recipientHash } = log.args
        if (giftCardId && sender && recipientHash) {
          onCreated(giftCardId, sender, recipientHash)
        }
      })
    }
  })
}

export const useWatchGiftCardClaimed = (
  onClaimed: (giftCardId: bigint, recipient: Address, sender: Address) => void
) => {
  const chainId = useChainId()
  
  useWatchContractEvent({
    ...getGiftCardManagerConfig(chainId),
    eventName: 'GiftCardClaimed',
    onLogs: (logs) => {
      logs.forEach((log) => {
        const { giftCardId, recipient, sender } = log.args
        if (giftCardId && recipient && sender) {
          onClaimed(giftCardId, recipient, sender)
        }
      })
    }
  })
}

export const useWatchGiftCardCancelled = (
  onCancelled: (giftCardId: bigint, sender: Address) => void
) => {
  const chainId = useChainId()
  
  useWatchContractEvent({
    ...getGiftCardManagerConfig(chainId),
    eventName: 'GiftCardCancelled',
    onLogs: (logs) => {
      logs.forEach((log) => {
        const { giftCardId, sender } = log.args
        if (giftCardId && sender) {
          onCancelled(giftCardId, sender)
        }
      })
    }
  })
}

// Helper functions
export const createGiftCardArgs = (
  recipientHash: `0x${string}`,
  expiration: bigint,
  message: string,
  tokens: Token[]
) => {
  const chainId = useChainId()
  return {
    ...getGiftCardManagerConfig(chainId),
    functionName: 'createGiftCard',
    args: [recipientHash, expiration, message, tokens]
  }
}

export const claimGiftCardArgs = (
  giftCardId: number,
  recipient: Address,
  salt: `0x${string}`
) => {
  const chainId = useChainId()
  return {
    ...getGiftCardManagerConfig(chainId),
    functionName: 'claimGiftCard',
    args: [BigInt(giftCardId), recipient, salt]
  }
}

export const cancelGiftCardArgs = (giftCardId: number) => {
  const chainId = useChainId()
  return {
    ...getGiftCardManagerConfig(chainId),
    functionName: 'cancelGiftCard',
    args: [BigInt(giftCardId)]
  }
}