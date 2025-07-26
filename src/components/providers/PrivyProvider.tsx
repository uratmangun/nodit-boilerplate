import { PrivyProvider } from '@privy-io/react-auth'
import { type ReactNode } from 'react'

interface PrivyProviderWrapperProps {
  children: ReactNode
}

export default function PrivyProviderWrapper({ children }: PrivyProviderWrapperProps) {
  const appId = import.meta.env['VITE_PRIVY_APP_ID']
  const clientId = import.meta.env['VITE_PRIVY_CLIENT_ID']

  if (!appId) {
    console.warn('VITE_PRIVY_APP_ID is not set. Privy authentication will not work.')
    return <>{children}</>
  }

  return (
    <PrivyProvider
      appId={appId}
      clientId={clientId}
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          logo: 'https://your-logo-url',
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },
        // Configure login methods
        loginMethods: ['email', 'wallet'],
        // Configure supported external wallets
        supportedChains: [
          {
            id: 1,
            name: 'Ethereum',
            network: 'ethereum',
            nativeCurrency: {
              decimals: 18,
              name: 'Ether',
              symbol: 'ETH',
            },
            rpcUrls: {
              default: {
                http: ['https://cloudflare-eth.com'],
              },
              public: {
                http: ['https://cloudflare-eth.com'],
              },
            },
            blockExplorers: {
              default: { name: 'Etherscan', url: 'https://etherscan.io' },
            },
          },
        ],
      }}
    >
      {children}
    </PrivyProvider>
  )
}
