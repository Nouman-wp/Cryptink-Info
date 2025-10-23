"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Save, Sparkles, Users, Eye, Settings } from "lucide-react"

export default function Editor() {
  const [content, setContent] = useState("")
  const [showAISuggestions, setShowAISuggestions] = useState(false)

  const aiSuggestions = [
    "The moonlight cast eerie shadows across the abandoned blockchain node...",
    "She typed the final line of code, her hands trembling with anticipation...",
    "In the metaverse, identity was fluid, malleable, and entirely in your control..."
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/">
              <img
                src="/cryptink-logo.png"
                alt="CryptInk Logo"
                className="h-7 cursor-pointer"
              />
            </a>
            <div className="text-sm text-muted-foreground">
              Chapter 3: The Discovery
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Saved 2 min ago</span>
            <Button variant="ghost" size="sm">
              <Users className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button size="sm" className="gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex gap-6">
        {/* Main Editor */}
        <div className="flex-1">
          <Card className="p-6 min-h-[80vh]">
            <Textarea
              className="min-h-[70vh] border-none text-lg leading-relaxed resize-none focus-visible:ring-0"
              placeholder="Start writing your story..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Card>

          {/* AI Assistant Toggle */}
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setShowAISuggestions(!showAISuggestions)}
            >
              <Sparkles className="h-4 w-4" />
              AI Writing Assistant
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 space-y-4">
          {/* Stats */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Document Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Words</span>
                <span className="font-medium">{content.split(' ').filter(w => w).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Characters</span>
                <span className="font-medium">{content.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reading time</span>
                <span className="font-medium">{Math.ceil(content.split(' ').filter(w => w).length / 200)} min</span>
              </div>
            </div>
          </Card>

          {/* AI Suggestions */}
          {showAISuggestions && (
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">AI Suggestions</h3>
              </div>
              <div className="space-y-3">
                {aiSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-background/50 border border-border/50 text-sm cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => setContent(content + suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Collaborators */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Active Collaborators</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-xs">
                  AK
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Alice.sol</div>
                  <div className="text-xs text-muted-foreground">Editing now</div>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-xs">
                  BM
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Bob.crypto</div>
                  <div className="text-xs text-muted-foreground">Offline</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Encryption Status */}
          <Card className="p-4 border-green-500/30 bg-green-500/5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold">End-to-End Encrypted</div>
                <div className="text-xs text-muted-foreground">Via Arcium MXE</div>
              </div>
            </div>
            <Badge variant="outline" className="w-full justify-center text-xs">
              Auto-save enabled
            </Badge>
          </Card>
        </div>
      </div>
    </div>
  )
}
