"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BookOpen, Users, Award, TrendingUp, Copy, ExternalLink, Loader2 } from "lucide-react"
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/api'
import { toast } from 'sonner'

export default function Profile() {
  const router = useRouter()
  const { user, token, isAuthenticated, loading: authLoading } = useAuth()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [stats, setStats] = useState({
    projectsPublished: 0,
    totalCollaborators: 0,
    reputationScore: 0,
    totalEarnings: 0
  })

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    tags: '',
    twitter: '',
    github: '',
    website: ''
  })

  // Redirect if not authenticated (wait for auth to finish loading)
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/connect')
    }
  }, [authLoading, isAuthenticated, router])

  // Load user data and stats
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        bio: user.bio || '',
        tags: user.tags?.join(', ') || '',
        twitter: user.socialLinks?.twitter || '',
        github: user.socialLinks?.github || '',
        website: user.socialLinks?.website || ''
      })

      // Fetch user stats
      if (user.walletAddress) {
        api.getUserStats(user.walletAddress).then(response => {
          if (response.success) {
            setStats(response.stats)
          }
        }).catch(console.error)
      }
    }
  }, [user])

  const handleSaveProfile = async () => {
    if (!token) return

    setSaving(true)
    try {
      const updateData = {
        username: formData.username,
        bio: formData.bio,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        socialLinks: {
          twitter: formData.twitter,
          github: formData.github,
          website: formData.website
        }
      }

      const response = await api.updateProfile(updateData, token)

      if (response.success) {
        toast.success('Profile updated successfully!')
        setIsEditOpen(false)
        // Refresh the page to show updated data
        window.location.reload()
      } else {
        toast.error('Failed to update profile')
      }
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const openInExplorer = () => {
    if (user?.walletAddress) {
      window.open(`https://explorer.solana.com/address/${user.walletAddress}?cluster=devnet`, '_blank')
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const walletAddress = user.walletAddress || ''
  const shortWallet = walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : ''

  const statCards = [
    { label: "Projects Published", value: stats.projectsPublished || 0, icon: BookOpen },
    { label: "Total Collaborators", value: stats.totalCollaborators || 0, icon: Users },
    { label: "Reputation Score", value: user.reputation || 0, icon: Award },
    { label: "Total Earnings", value: `${stats.totalEarnings || 0} SOL`, icon: TrendingUp }
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/">
            <img
              src="/cryptink-logo.png"
              alt="CryptInk Logo"
              className="h-8 cursor-pointer"
            />
          </a>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              Dashboard
            </Button>
            <Button onClick={() => setIsEditOpen(true)}>
              Edit Profile
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/30 to-primary/10">
                  {user.username ? user.username.charAt(0).toUpperCase() : '?'}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold mb-2">{user.username || 'Anonymous User'}</h2>
                <p className="text-muted-foreground mb-4">
                  {user.bio || 'No bio yet. Click "Edit Profile" to add one!'}
                </p>

                {/* Wallet Address */}
                <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {shortWallet}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => copyToClipboard(walletAddress)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={openInExplorer}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {user.tags && user.tags.length > 0 ? (
                    user.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))
                  ) : (
                    <Badge variant="outline" className="opacity-50">No tags yet</Badge>
                  )}
                </div>

                {/* Social Links */}
                {user.socialLinks && (
                  <div className="flex gap-4 mt-4 justify-center md:justify-start">
                    {user.socialLinks.twitter && (
                      <a href={`https://twitter.com/${user.socialLinks.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                        Twitter
                      </a>
                    )}
                    {user.socialLinks.github && (
                      <a href={`https://github.com/${user.socialLinks.github.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                        GitHub
                      </a>
                    )}
                    {user.socialLinks.website && (
                      <a href={user.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                        Website
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information. Changes will be saved to the blockchain.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Your display name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="sci-fi, technology, blockchain"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                placeholder="@username"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                placeholder="@username"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://yoursite.com"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
