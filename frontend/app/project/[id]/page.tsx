"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BookOpen, Users, Lock, DollarSign, Edit, Share2, Download } from "lucide-react"

export default function ProjectDetail() {
  const project = {
    title: "The Blockchain Odyssey",
    description: "An epic journey through the world of decentralized finance and smart contracts. Follow our protagonist as they navigate the complex landscape of Web3, encountering challenges, allies, and adversaries along the way.",
    author: "Alex.sol",
    authorWallet: "DYw8j...x7Ks9",
    chapters: 24,
    visibility: "paid",
    price: 0.5,
    earnings: 245.80,
    readers: 1240,
    rating: 4.8,
    genre: "Technology",
    publishedDate: "March 15, 2024",
    lastUpdated: "May 20, 2024"
  }

  const collaborators = [
    { name: "Sarah.crypto", role: "Co-Author", share: "30%", avatar: "SC" },
    { name: "Dev.master", role: "Editor", share: "10%", avatar: "DM" },
    { name: "Review.eth", role: "Reviewer", share: "5%", avatar: "RE" }
  ]

  const chapters = [
    { number: 1, title: "The Beginning", words: 2500, published: true },
    { number: 2, title: "First Steps", words: 2800, published: true },
    { number: 3, title: "The Discovery", words: 3200, published: true },
    { number: 4, title: "New Allies", words: 2900, published: false },
    { number: 5, title: "The Challenge", words: 0, published: false }
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
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl font-bold">{project.title}</h1>
                <Badge variant={project.visibility === "paid" ? "default" : "secondary"}>
                  <DollarSign className="h-3 w-3 mr-1" />
                  {project.price} SOL
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground max-w-3xl">
                {project.description}
              </p>
            </div>
            <Button className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Project
            </Button>
          </div>

          {/* Author Info */}
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback className="bg-primary/10 text-sm">AS</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{project.author}</div>
              <div className="text-sm text-muted-foreground">{project.authorWallet}</div>
            </div>
            <Badge variant="outline">{project.genre}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chapters List */}
            <Card>
              <CardHeader>
                <CardTitle>Chapters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {chapters.map((chapter) => (
                    <div
                      key={chapter.number}
                      className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-background/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                          {chapter.number}
                        </div>
                        <div>
                          <div className="font-medium">{chapter.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {chapter.words > 0 ? `${chapter.words} words` : "Not started"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {chapter.published ? (
                          <Badge variant="default">Published</Badge>
                        ) : (
                          <Badge variant="outline">Draft</Badge>
                        )}
                        <Button size="sm" variant="ghost">
                          {chapter.published ? "View" : "Edit"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Add New Chapter
                </Button>
              </CardContent>
            </Card>

            {/* Collaborators */}
            <Card>
              <CardHeader>
                <CardTitle>Collaborators & Revenue Share</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {collaborators.map((collab, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border border-border/50"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary/10 text-sm">{collab.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{collab.name}</div>
                          <div className="text-sm text-muted-foreground">{collab.role}</div>
                        </div>
                      </div>
                      <Badge variant="secondary">{collab.share}</Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Users className="h-4 w-4 mr-2" />
                  Invite Collaborator
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Project Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Total Chapters</div>
                  <div className="text-2xl font-bold">{project.chapters}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Total Readers</div>
                  <div className="text-2xl font-bold">{project.readers}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Rating</div>
                  <div className="text-2xl font-bold">{project.rating} / 5.0</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Total Earnings</div>
                  <div className="text-2xl font-bold text-primary">${project.earnings}</div>
                </div>
              </CardContent>
            </Card>

            {/* Publication Info */}
            <Card>
              <CardHeader>
                <CardTitle>Publication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Published</span>
                  <span className="font-medium">{project.publishedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-medium">{project.lastUpdated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Visibility</span>
                  <Badge variant="outline">{project.visibility}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Storage</span>
                  <Badge variant="outline">Arweave</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Blockchain Info */}
            <Card className="border-green-500/30 bg-green-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Blockchain Verified
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contract</span>
                  <span className="font-mono text-xs">abc...123</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network</span>
                  <span>Solana Devnet</span>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  View on Explorer
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
