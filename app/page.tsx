"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { BotIcon, SparklesIcon, LoaderIcon } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/chat")
      } else {
        router.push("/auth/login")
      }
    }
  }, [user, loading, router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="text-center space-y-6">
        {/* Loading Icon */}
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-full flex items-center justify-center">
          <div className="relative">
            <BotIcon className="w-12 h-12 text-secondary" />
            <LoaderIcon className="absolute inset-0 w-12 h-12 text-secondary animate-spin" />
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            {loading ? "Loading..." : "Redirecting..."}
          </h1>
          <p className="text-muted-foreground text-lg">
            {loading ? "Checking authentication..." : "Taking you to the right place..."}
          </p>
        </div>
        
        {/* Loading Animation */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-secondary rounded-full animate-bounce"></div>
        </div>
        
        {/* Features */}
        <div className="pt-8">
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground/60">
            <div className="flex items-center gap-1">
              <SparklesIcon className="w-3 h-3" />
              <span>AI powered</span>
            </div>
            <div className="flex items-center gap-1">
              <BotIcon className="w-3 h-3" />
              <span>Smart chat</span>
            </div>
            <div className="flex items-center gap-1">
              <SparklesIcon className="w-3 h-3" />
              <span>Modern UI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
