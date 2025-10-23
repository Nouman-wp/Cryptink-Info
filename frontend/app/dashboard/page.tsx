"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, BookOpen, Users, TrendingUp, Lock, Globe, DollarSign, Loader2, AlertCircle } from "lucide-react"
import { WalletDropdown } from "@/components/wallet/WalletDropdown"
import { useAuth } from "@/hooks/useAuth"
import { api } from "@/lib/api"
import type { Project } from "@/lib/types"

export default function Dashboard() {
  const router = useRouter()
  const { user, token, isAuthenticated, loading: authLoading } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Redirect to connect page if not authenticated (but wait for auth to load)
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/connect')
    }
  }, [isAuthenticated, authLoading, router])

  // Fetch user's projects
  useEffect(() => {
    if (token) {
      fetchProjects()
    }
  }, [token])

  const fetchProjects = async () => {
    if (!token) return

    try {
      setLoading(true)
      setError(null)
      const response = await api.getMyProjects(token)

      if (response.success && response.projects) {
        setProjects(response.projects)
      }
    } catch (err: any) {
      console.error('Failed to fetch projects:', err)
      setError(err.message || 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats from projects
  const totalChapters = projects.reduce((sum, p) => sum + (p.stats?.chapters || 0), 0)
  const totalCollaborators = projects.reduce((sum, p) => sum + (p.collaborators?.length || 0), 0)
  const publishedProjects = projects.filter(p => p.visibility === 'public').length

  const stats = [
    {
      title: "Total Projects",
      value: projects.length.toString(),
      icon: BookOpen,
      change: "Real-time data"
    },
    {
      title: "Total Chapters",
      value: totalChapters.toString(),
      icon: Globe,
      change: "Across all projects"
    },
    {
      title: "Collaborators",
      value: totalCollaborators.toString(),
      icon: Users,
      change: "Active collaborators"
    },
    {
      title: "Published",
      value: publishedProjects.toString(),
      icon: TrendingUp,
      change: "Public projects"
    }
  ]

  const getColorForProject = (index: number) => {
    const colors = [
      "bg-gradient-to-br from-purple-500 to-pink-500",
      "bg-gradient-to-br from-green-500 to-teal-500",
      "bg-gradient-to-br from-orange-500 to-red-500",
      "bg-gradient-to-br from-blue-500 to-cyan-500",
      "bg-gradient-to-br from-indigo-500 to-purple-500",
    ]
    return colors[index % colors.length]
  }

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
              <a href="/dashboard" className="text-foreground font-medium">Dashboard</a>
              <a href="/browse" className="text-muted-foreground hover:text-foreground">Browse</a>
              <a href="/editor" className="text-muted-foreground hover:text-foreground">Editor</a>
              <a href="/earnings" className="text-muted-foreground hover:text-foreground">Earnings</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <WalletDropdown />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.username || 'Author'}</h2>
          <p className="text-muted-foreground">Here's what's happening with your projects today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-border/50 bg-background/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Projects Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Your Projects</h3>
            <Button className="gap-2" onClick={() => router.push('/editor')}>
              <PlusCircle className="h-4 w-4" />
              New Project
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <Card className="border-red-500/50 bg-red-500/5">
              <CardContent className="flex items-center gap-3 py-6">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-medium text-red-500">Failed to load projects</p>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              </CardContent>
            </Card>
          ) : projects.length === 0 ? (
            <Card className="border-border/50 bg-background/30 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-20">
                <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-6">Start your writing journey by creating your first project</p>
                <Button onClick={() => router.push('/editor')}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Your First Project
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <Card
                  key={project._id}
                  className="border-border/50 bg-background/30 backdrop-blur-sm hover:border-primary/50 transition-all cursor-pointer group"
                  onClick={() => router.push(`/project/${project._id}`)}
                >
                  <div className={`h-32 ${getColorForProject(index)} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge variant={project.visibility === "private" ? "secondary" : "default"} className="mb-2">
                        {project.visibility === "private" && <Lock className="h-3 w-3 mr-1" />}
                        {project.visibility === "public" && <Globe className="h-3 w-3 mr-1" />}
                        {project.visibility === "paid" && <DollarSign className="h-3 w-3 mr-1" />}
                        {project.visibility}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors">{project.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{project.description || 'No description'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {project.stats?.chapters || 0} chapters
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {project.collaborators?.length || 0}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                      <Badge variant={project.visibility === "public" ? "default" : "secondary"}>
                        {project.visibility}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

        </div>

        {/* Quick Actions */}
        {!loading && !error && (
          <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-background">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with your next masterpiece</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Button variant="outline" className="gap-2" onClick={() => router.push('/editor')}>
                <PlusCircle className="h-4 w-4" />
                Create New Project
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => router.push('/browse')}>
                <BookOpen className="h-4 w-4" />
                Browse Projects
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => router.push('/profile')}>
                <Users className="h-4 w-4" />
                View Profile
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
