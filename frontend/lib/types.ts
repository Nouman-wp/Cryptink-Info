export interface User {
  id: string
  walletAddress: string
  username?: string
  bio?: string
  avatar?: string
  reputation: number
  tags?: string[]
  socialLinks?: {
    twitter?: string
    github?: string
    website?: string
  }
  createdAt: string
  lastActive?: string
}

export interface Project {
  _id: string
  title: string
  description?: string
  genre?: string
  tags: string[]
  authorWallet: string
  contractAddress?: string
  visibility: 'public' | 'private' | 'paid'
  price: number
  currency: string
  coverImage?: string
  coverColor?: string
  status: 'draft' | 'active' | 'published' | 'archived'
  collaborators: Collaborator[]
  stats: ProjectStats
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface Collaborator {
  walletAddress: string
  role: 'author' | 'co-author' | 'editor' | 'reviewer'
  revenueShare: number
  joinedAt: string
}

export interface ProjectStats {
  totalReaders: number
  totalEarnings: number
  rating: number
  reviews: number
}

export interface Chapter {
  _id: string
  projectId: string
  chapterNumber: number
  title: string
  content: string
  encryptedContentUri?: string
  contentHash?: string
  wordCount: number
  readingTime: number
  authorWallet: string
  status: 'draft' | 'published' | 'archived'
  version: number
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  _id: string
  signature: string
  type: 'purchase' | 'royalty' | 'collaboration_payment'
  projectId?: string
  fromWallet: string
  toWallet: string
  amount: number
  currency: string
  status: 'pending' | 'confirmed' | 'failed'
  metadata?: Record<string, string>
  createdAt: string
}
