// Get project ID at https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!projectId) {
  console.warn('Project ID is not defined')
}

// Set up metadata
export const getMetadata = () => ({
  name: 'Gifto',
  description: 'Send crypto gifts instantly on Hedera Hashgraph',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://gifto.app',
  icons: [typeof window !== 'undefined' ? `${window.location.origin}/gifto.png` : 'https://gifto.app/gifto.png']
})

// Client-side configuration creation
export const createHederaConfig = async () => {
  if (typeof window === 'undefined') return null
  
  const { HederaAdapter, HederaProvider } = await import('@hashgraph/hedera-wallet-connect')
  const { HederaChainDefinition } = await import('@hashgraph/hedera-wallet-connect')
  
  const metadata = getMetadata()
  
  // Only native Hedera networks
  const networks = [
    HederaChainDefinition.Native.Testnet,
    HederaChainDefinition.Native.Mainnet,
  ]
  
  // Native Hedera Adapter only
  const nativeHederaAdapter = new HederaAdapter({
    projectId: projectId!,
    networks,
    namespace: 'hedera',
  })
  
  // Universal Provider
  const universalProvider = await HederaProvider.init({
    projectId: projectId!,
    metadata,
  })
  
  return {
    metadata,
    networks,
    nativeHederaAdapter,
    universalProvider
  }
}