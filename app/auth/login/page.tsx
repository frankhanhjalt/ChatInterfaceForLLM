"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { BotIcon, SparklesIcon, ArrowRightIcon, MailIcon, LockIcon } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/chat")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-full flex items-center justify-center overflow-hidden">
                      <Image 
          src="/img/avatar.png" 
          alt="AI Assistant Avatar"
                width={80}
                height={80}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-muted-foreground text-lg">
                Sign in to continue to your AI chat experience
              </p>
            </div>
          </div>

          {/* Login Form */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-xl">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl text-card-foreground text-center">Sign In</CardTitle>
              <CardDescription className="text-muted-foreground text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-card-foreground font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-input/50 border-border/50 text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-card-foreground font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 bg-input/50 border-border/50 text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive text-center">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium py-3 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Sign In</span>
                      <ArrowRightIcon className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  New user registration is currently disabled
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="text-center space-y-4">
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
                <MailIcon className="w-3 h-3" />
                <span>Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
