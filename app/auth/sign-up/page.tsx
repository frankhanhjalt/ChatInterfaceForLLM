"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { BotIcon, LockIcon, ArrowLeftIcon } from "lucide-react"
import Image from "next/image"

export default function SignUpPage() {
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
                Registration Disabled
              </h1>
              <p className="text-muted-foreground text-lg">
                New user registration is temporarily unavailable
              </p>
            </div>
          </div>

          {/* Disabled Message */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-xl">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl text-card-foreground text-center">Account Creation Paused</CardTitle>
              <CardDescription className="text-muted-foreground text-center">
                We're currently not accepting new user registrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center">
                  <LockIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  New user registration has been temporarily disabled. Please check back later or contact support if you need immediate access.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium py-3 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <Link href="/auth/login">
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Back to Sign In
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground/60">
              If you already have an account, you can still sign in normally.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
