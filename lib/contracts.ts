import { Address } from 'viem'

// Contract ABIs
export const GIFT_CARD_MANAGER_ABI = [
  // Read functions
  {
    inputs: [{ name: 'giftCardId', type: 'uint256' }],
    name: 'getGiftCard',
    outputs: [
      {
        components: [
          { name: 'sender', type: 'address' },
          { name: 'recipientHash', type: 'bytes32' },
          { name: 'expiration', type: 'uint256' },
          { name: 'createdAt', type: 'uint256' },
          { name: 'claimed', type: 'bool' },
          { name: 'cancelled', type: 'bool' },
          { name: 'message', type: 'string' },
          { name: 'tokenCount', type: 'uint256' }
        ],
        name: 'giftCard',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'giftCardId', type: 'uint256' }],
    name: 'getGiftCardTokens',
    outputs: [
      {
        components: [
          { name: 'tokenType', type: 'uint8' },
          { name: 'contractAddress', type: 'address' },
          { name: 'amount', type: 'uint256' },
          { name: 'tokenId', type: 'uint256' },
          { name: 'data', type: 'bytes' }
        ],
        name: 'tokens',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { name: 'giftCardId', type: 'uint256' },
      { name: 'recipient', type: 'address' },
      { name: 'salt', type: 'bytes32' }
    ],
    name: 'canClaimGiftCard',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'sender', type: 'address' }],
    name: 'getGiftCardsBySender',
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getTotalGiftCards',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getStatistics',
    outputs: [
      { name: 'totalCreated', type: 'uint256' },
      { name: 'totalClaimed', type: 'uint256' },
      { name: 'totalCancelled', type: 'uint256' },
      { name: 'totalValue', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  // Write functions
  {
    inputs: [
      { name: 'recipientHash', type: 'bytes32' },
      { name: 'expiration', type: 'uint256' },
      { name: 'message', type: 'string' },
      {
        components: [
          { name: 'tokenType', type: 'uint8' },
          { name: 'contractAddress', type: 'address' },
          { name: 'amount', type: 'uint256' },
          { name: 'tokenId', type: 'uint256' },
          { name: 'data', type: 'bytes' }
        ],
        name: 'tokens',
        type: 'tuple[]'
      }
    ],
    name: 'createGiftCard',
    outputs: [{ name: 'giftCardId', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'giftCardId', type: 'uint256' },
      { name: 'recipient', type: 'address' },
      { name: 'salt', type: 'bytes32' }
    ],
    name: 'claimGiftCard',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'giftCardId', type: 'uint256' }],
    name: 'cancelGiftCard',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'giftCardId', type: 'uint256' },
      { indexed: true, name: 'sender', type: 'address' },
      { indexed: true, name: 'recipientHash', type: 'bytes32' },
      { indexed: false, name: 'expiration', type: 'uint256' },
      { indexed: false, name: 'message', type: 'string' }
    ],
    name: 'GiftCardCreated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'giftCardId', type: 'uint256' },
      { indexed: true, name: 'recipient', type: 'address' },
      { indexed: true, name: 'sender', type: 'address' }
    ],
    name: 'GiftCardClaimed',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'giftCardId', type: 'uint256' },
      { indexed: true, name: 'sender', type: 'address' }
    ],
    name: 'GiftCardCancelled',
    type: 'event'
  }
] as const

// Contract addresses by chain
export const GIFT_CARD_MANAGER_ADDRESSES: Record<number, Address> = {
  // Mainnet addresses (to be deployed)
  1: (process.env.NEXT_PUBLIC_GIFT_CARD_MANAGER_ETHEREUM || '') as Address,
  137: (process.env.NEXT_PUBLIC_GIFT_CARD_MANAGER_POLYGON || '') as Address,
  42161: (process.env.NEXT_PUBLIC_GIFT_CARD_MANAGER_ARBITRUM || '') as Address,
  8453: (process.env.NEXT_PUBLIC_GIFT_CARD_MANAGER_BASE || '') as Address,
  10: (process.env.NEXT_PUBLIC_GIFT_CARD_MANAGER_OPTIMISM || '') as Address,
  
  // Testnet addresses
  11155111: (process.env.NEXT_PUBLIC_GIFT_CARD_MANAGER_SEPOLIA || '') as Address,
  80001: (process.env.NEXT_PUBLIC_GIFT_CARD_MANAGER_POLYGON_MUMBAI || '') as Address,
  421613: (process.env.NEXT_PUBLIC_GIFT_CARD_MANAGER_ARBITRUM_GOERLI || '') as Address,
  84531: (process.env.NEXT_PUBLIC_GIFT_CARD_MANAGER_BASE_GOERLI || '') as Address,
  420: (process.env.NEXT_PUBLIC_GIFT_CARD_MANAGER_OPTIMISM_GOERLI || '') as Address,
  
  // Local development
  31337: (process.env.NEXT_PUBLIC_GIFT_CARD_MANAGER_HARDHAT || '0x5FbDB2315678afecb367f032d93F642f64180aa3') as Address
}

// Helper function to get contract address for current chain
export const getGiftCardManagerAddress = (chainId: number): Address => {
  const address = GIFT_CARD_MANAGER_ADDRESSES[chainId]
  if (!address) {
    throw new Error(`GiftCardManager not deployed on chain ${chainId}`)
  }
  return address
}

// Helper function to get contract config for wagmi
export const getGiftCardManagerConfig = (chainId: number) => ({
  address: getGiftCardManagerAddress(chainId),
  abi: GIFT_CARD_MANAGER_ABI
})

// Token types enum for TypeScript
export enum TokenType {
  NATIVE = 0,
  ERC20 = 1,
  ERC721 = 2,
  ERC1155 = 3
}

// TypeScript types for contract interaction
export interface Token {
  tokenType: TokenType
  contractAddress: Address
  amount: bigint
  tokenId: bigint
  data: `0x${string}`
}

export interface GiftCard {
  sender: Address
  recipientHash: `0x${string}`
  expiration: bigint
  createdAt: bigint
  claimed: boolean
  cancelled: boolean
  message: string
  tokenCount: bigint
}

export interface GiftCardStatistics {
  totalCreated: bigint
  totalClaimed: bigint
  totalCancelled: bigint
  totalValue: bigint
}