"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, BookOpen, Users, Star, Lock, Globe, DollarSign } from "lucide-react"
import { WalletButton } from "@/components/wallet/WalletButton"

export default function Browse() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const books = [
    {
      id: "1",
      title: "The Blockchain Odyssey",
      author: "Alex.sol",
      authorAvatar: "AX",
      description: "An epic journey through the world of decentralized finance and smart contracts",
      chapters: 24,
      readers: 1240,
      rating: 4.8,
      price: 0.5,
      visibility: "paid",
      coverColor: "bg-gradient-to-br from-blue-500 to-cyan-500",
      genre: "Technology"
    },
    {
      id: "2",
      title: "Crypto Dreams",
      author: "Sarah.crypto",
      authorAvatar: "SC",
      description: "A collection of short stories about life in Web3",
      chapters: 15,
      readers: 890,
      rating: 4.6,
      price: 0,
      visibility: "public",
      coverColor: "bg-gradient-to-br from-purple-500 to-pink-500",
      genre: "Fiction"
    },
    {
      id: "3",
      title: "Solana for Beginners",
      author: "Dev.master",
      authorAvatar: "DM",
      description: "Complete guide to building your first dApp on Solana",
      chapters: 32,
      readers: 2100,
      rating: 4.9,
      price: 1.2,
      visibility: "paid",
      coverColor: "bg-gradient-to-br from-green-500 to-emerald-500",
      genre: "Education"
    },
    {
      id: "4",
      title: "The NFT Artist",
      author: "Creative.eth",
      authorAvatar: "CE",
      description: "Behind the scenes of creating and selling digital art",
      chapters: 18,
      readers: 750,
      rating: 4.7,
      price: 0,
      visibility: "public",
      coverColor: "bg-gradient-to-br from-orange-500 to-red-500",
      genre: "Art"
    },
    {
      id: "5",
      title: "DeFi Decoded",
      author: "Finance.wizard",
      authorAvatar: "FW",
      description: "Understanding yield farming, liquidity pools, and more",
      chapters: 20,
      readers: 1580,
      rating: 4.8,
      price: 0.8,
      visibility: "paid",
      coverColor: "bg-gradient-to-br from-yellow-500 to-orange-500",
      genre: "Finance"
    },
    {
      id: "6",
      title: "Privacy Protocols",
      author: "Anon.dev",
      authorAvatar: "AD",
      description: "Deep dive into zero-knowledge proofs and encryption",
      chapters: 28,
      readers: 950,
      rating: 4.9,
      price: 0,
      visibility: "private",
      coverColor: "bg-gradient-to-br from-slate-500 to-zinc-500",
      genre: "Technology"
    }
  ]

  const filters = [
    { id: "all", label: "All Books" },
    { id: "free", label: "Free" },
    { id: "paid", label: "Paid" },
    { id: "popular", label: "Popular" },
    { id: "new", label: "New Releases" }
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/">
              <img
                src="/cryptink-logo.png"
                alt="CryptInk Logo"
                className="h-8 cursor-pointer"
              />
            </a>
            <nav className="hidden md:flex gap-6">
              <a href="/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</a>
              <a href="/browse" className="text-foreground font-medium">Browse</a>
              <a href="/editor" className="text-muted-foreground hover:text-foreground">Editor</a>
              <a href="/earnings" className="text-muted-foreground hover:text-foreground">Earnings</a>
            </nav>
          </div>
          <WalletButton />
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-border/50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold mb-4">Discover Amazing Stories</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Explore thousands of books written and published on the blockchain. Support your favorite authors directly.
            </p>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for books, authors, or topics..."
                className="pl-10 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 overflow-x-auto">
            <Filter className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            {filters.map((filter) => (
              <Button
                key={filter.id}
                variant={selectedFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter.id)}
                className="flex-shrink-0"
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Card
              key={book.id}
              className="border-border/50 bg-background/30 backdrop-blur-sm hover:border-primary/50 transition-all cursor-pointer group overflow-hidden"
            >
              {/* Book Cover */}
              <div className={`h-48 ${book.coverColor} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute top-4 right-4">
                  <Badge variant={book.visibility === "paid" ? "default" : "secondary"}>
                    {book.visibility === "private" && <Lock className="h-3 w-3 mr-1" />}
                    {book.visibility === "public" && <Globe className="h-3 w-3 mr-1" />}
                    {book.visibility === "paid" && <DollarSign className="h-3 w-3 mr-1" />}
                    {book.price > 0 ? `${book.price} SOL` : "Free"}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <Badge variant="secondary" className="mb-2">
                    {book.genre}
                  </Badge>
                </div>
              </div>

              {/* Book Info */}
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors line-clamp-1">
                  {book.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                    {book.authorAvatar}
                  </div>
                  by {book.author}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {book.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {book.chapters} chapters
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {book.readers}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    {book.rating}
                  </div>
                </div>

                <Button className="w-full" variant={book.price > 0 ? "default" : "outline"}>
                  {book.price > 0 ? `Purchase for ${book.price} SOL` : "Read for Free"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center mt-12">
          <Button variant="outline" size="lg">
            Load More Books
          </Button>
        </div>
      </main>
    </div>
  )
}
