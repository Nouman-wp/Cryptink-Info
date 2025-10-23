"use client"

import { useState, useEffect, useRef } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { User, LogOut, Settings, ChevronDown, Wallet } from 'lucide-react'

export function WalletDropdown() {
  const { publicKey, disconnect } = useWallet()
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  if (!mounted || !publicKey || !user) {
    return null
  }

  const walletAddress = publicKey.toBase58()
  const shortAddress = `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`

  const handleDisconnect = async () => {
    await disconnect()
    logout()
    setIsOpen(false)
    router.push('/')
  }

  const menuItems = [
    {
      icon: User,
      label: 'View Profile',
      onClick: () => {
        router.push(`/profile`)
        setIsOpen(false)
      }
    },
    {
      icon: Settings,
      label: 'Edit Profile',
      onClick: () => {
        router.push('/profile?edit=true')
        setIsOpen(false)
      }
    },
    {
      icon: Wallet,
      label: 'My Projects',
      onClick: () => {
        router.push('/dashboard')
        setIsOpen(false)
      }
    },
    {
      icon: LogOut,
      label: 'Disconnect',
      onClick: handleDisconnect,
      danger: true
    }
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 hover:bg-background/80 transition-all"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-semibold text-sm">
          {user.username?.charAt(0).toUpperCase() || 'U'}
        </div>
        <span className="text-sm font-medium hidden sm:inline">{shortAddress}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border/50 bg-background/95 backdrop-blur-md shadow-2xl z-50">
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-semibold">
                {user.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user.username || 'Anonymous'}</p>
                <p className="text-xs text-muted-foreground truncate">{shortAddress}</p>
              </div>
            </div>
            {user.reputation !== undefined && (
              <div className="mt-3 pt-3 border-t border-border/50">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Reputation</span>
                  <span className="font-semibold text-primary">{user.reputation} pts</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    item.danger
                      ? 'text-red-500 hover:bg-red-500/10'
                      : 'text-foreground hover:bg-background/80'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
