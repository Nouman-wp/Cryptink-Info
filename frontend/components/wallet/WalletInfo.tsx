"use client"

import { useWallet } from '@solana/wallet-adapter-react'
import { useConnection } from '@solana/wallet-adapter-react'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Copy, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function WalletInfo() {
  const { publicKey, connected, wallet } = useWallet()
  const { connection } = useConnection()
  const [balance, setBalance] = useState<number | null>(null)

  useEffect(() => {
    if (publicKey && connected) {
      // Fetch balance
      connection.getBalance(publicKey).then((bal) => {
        setBalance(bal / 1e9) // Convert lamports to SOL
      })
    }
  }, [publicKey, connected, connection])

  if (!connected || !publicKey) {
    return null
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(publicKey.toBase58())
  }

  const viewOnExplorer = () => {
    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet'
    const cluster = network === 'mainnet-beta' ? '' : `?cluster=${network}`
    window.open(`https://explorer.solana.com/address/${publicKey.toBase58()}${cluster}`, '_blank')
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          Wallet Connected
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Wallet</div>
          <Badge variant="secondary" className="font-medium">
            {wallet?.adapter.name || 'Unknown'}
          </Badge>
        </div>

        <div>
          <div className="text-xs text-muted-foreground mb-1">Address</div>
          <div className="flex items-center gap-2">
            <code className="text-xs bg-background/50 px-2 py-1 rounded">
              {publicKey.toBase58().slice(0, 8)}...{publicKey.toBase58().slice(-8)}
            </code>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={copyAddress}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={viewOnExplorer}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {balance !== null && (
          <div>
            <div className="text-xs text-muted-foreground mb-1">Balance</div>
            <div className="text-lg font-bold">{balance.toFixed(4)} SOL</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
