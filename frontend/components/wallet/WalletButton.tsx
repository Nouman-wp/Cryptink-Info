"use client"

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

interface WalletButtonProps {
  className?: string
}

export function WalletButton({ className }: WalletButtonProps = {}) {
  const { connected, publicKey } = useWallet()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const defaultClassName = "!bg-primary hover:!bg-primary/90 !rounded-md !h-10 !px-4 !text-sm !font-medium !transition-colors"
  const finalClassName = className || defaultClassName

  if (!mounted) {
    return (
      <Button variant="default" disabled className="h-10 px-4">
        Select Wallet
      </Button>
    )
  }

  return <WalletMultiButton className={finalClassName} />
}
