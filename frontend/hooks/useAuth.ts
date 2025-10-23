"use client"

import { useState, useEffect, useRef } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { api } from '@/lib/api'
import bs58 from 'bs58'
import { User } from '@/lib/types'

export function useAuth() {
  const { publicKey, signMessage, connected } = useWallet()
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isAuthenticating = useRef(false)
  const hasLoadedToken = useRef(false)

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('cryptink_token')
    if (savedToken) {
      setToken(savedToken)
      fetchCurrentUser(savedToken)
    } else {
      setLoading(false)
    }
    hasLoadedToken.current = true
  }, [])

  // Only authenticate when wallet connects and no valid token exists
  useEffect(() => {
    // Don't do anything until we've checked localStorage
    if (!hasLoadedToken.current) return

    if (connected && publicKey && !token && !isAuthenticating.current && !loading) {
      // Only auto-authenticate on the /connect page
      if (typeof window !== 'undefined' && window.location.pathname === '/connect') {
        authenticate()
      }
    } else if (!connected) {
      // Clear auth on disconnect
      setUser(null)
      setToken(null)
      localStorage.removeItem('cryptink_token')
    }
  }, [connected, publicKey, token, loading])

  const fetchCurrentUser = async (authToken: string) => {
    try {
      setLoading(true)
      const response = await api.getCurrentUser(authToken)
      if (response.success) {
        setUser(response.user)
      }
    } catch (err: any) {
      console.error('Failed to fetch user:', err)
      // Token might be invalid, clear it
      setToken(null)
      setUser(null)
      localStorage.removeItem('cryptink_token')
    } finally {
      setLoading(false)
    }
  }

  const authenticate = async () => {
    if (!publicKey || !signMessage) {
      setError('Wallet not connected')
      return
    }

    // Prevent multiple simultaneous authentication attempts
    if (isAuthenticating.current) {
      console.log('Authentication already in progress, skipping...')
      return
    }

    isAuthenticating.current = true
    setLoading(true)
    setError(null)

    try {
      // Create message to sign
      const message = `Sign this message to authenticate with CryptInk.\n\nWallet: ${publicKey.toBase58()}\nTimestamp: ${Date.now()}`
      const messageBytes = new TextEncoder().encode(message)

      // Request signature from wallet
      const signature = await signMessage(messageBytes)
      const signatureBase58 = bs58.encode(signature)

      // Verify with backend
      const response = await api.verifyWallet(
        publicKey.toBase58(),
        signatureBase58,
        message
      )

      if (response.success && response.token) {
        setToken(response.token)
        setUser(response.user)
        localStorage.setItem('cryptink_token', response.token)
      } else {
        throw new Error('Authentication failed')
      }
    } catch (err: any) {
      console.error('Authentication error:', err)
      setError(err.message || 'Failed to authenticate')
      isAuthenticating.current = false
    } finally {
      setLoading(false)
      isAuthenticating.current = false
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('cryptink_token')
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token && !!user,
    authenticate,
    logout
  }
}
