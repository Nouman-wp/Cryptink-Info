"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { WalletButton } from '@/components/wallet/WalletButton'
import { Loader2 } from 'lucide-react'

export default function ConnectWallet() {
  const { connected, publicKey } = useWallet()
  const { isAuthenticated, loading, error, user } = useAuth()
  const router = useRouter()
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    // Only redirect once we have both token AND user, and we haven't redirected yet
    if (!loading && isAuthenticated && user && !hasRedirected) {
      setHasRedirected(true)
      // Small delay to ensure state is stable
      setTimeout(() => {
        router.push('/dashboard')
      }, 100)
    }
  }, [isAuthenticated, user, loading, router, hasRedirected])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background gradient */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse 50% 35% at 50% 0%, rgba(226, 232, 240, 0.12), transparent 60%), #000000",
        }}
      />

      <Card className="w-full max-w-md relative z-10 border-border/50 bg-background/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
          <CardDescription>
            Choose a Solana wallet to get started with CryptInk
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Wallet Connection Status */}
          {!connected && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Connect your Solana wallet to authenticate and start writing
              </p>

              <div className="flex justify-center">
                <WalletButton className="!bg-primary hover:!bg-primary/90 !rounded-lg !h-12 !px-6 !text-base !font-medium !transition-colors" />
              </div>

              <div className="pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground text-center mb-3">
                  Supported Wallets
                </p>
                <div className="flex justify-center gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-1 mx-auto">
                      <span className="text-lg">👻</span>
                    </div>
                    <p className="text-xs">Phantom</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-1 mx-auto">
                      <span className="text-lg">🔥</span>
                    </div>
                    <p className="text-xs">Solflare</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Connected but authenticating */}
          {connected && !isAuthenticated && loading && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <div>
                <p className="font-medium">Authenticating...</p>
                <p className="text-sm text-muted-foreground">
                  Please sign the message in your wallet
                </p>
              </div>
            </div>
          )}

          {/* Connected and authenticated */}
          {connected && isAuthenticated && user && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              </div>
              <div>
                <p className="font-medium">Connected Successfully!</p>
                <p className="text-sm text-muted-foreground">
                  Redirecting to dashboard...
                </p>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-500 text-center">{error}</p>
            </div>
          )}

          {/* Info section */}
          <div className="pt-4 border-t border-border/50">
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <p>Your wallet signature is used to verify ownership</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <p>No transaction fees for authentication</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <p>Your private keys never leave your wallet</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
