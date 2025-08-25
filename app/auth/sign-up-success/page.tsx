import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LockIcon, ArrowLeftIcon, AlertTriangleIcon } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-500/20 to-orange-500/10 rounded-full flex items-center justify-center">
              <AlertTriangleIcon className="w-10 h-10 text-orange-500" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Registration Disabled
              </h1>
              <p className="text-muted-foreground text-lg">
                New user registration is currently unavailable
              </p>
            </div>
          </div>

          {/* Disabled Card */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-xl">
            <CardHeader className="space-y-2 text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-muted/30 to-muted/20 rounded-full flex items-center justify-center">
                <LockIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <CardTitle className="text-2xl text-card-foreground">Access Restricted</CardTitle>
              <CardDescription className="text-muted-foreground">
                New account creation is temporarily paused
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  We're currently not accepting new user registrations. If you already have an account, you can still sign in normally. Please check back later for updates.
                </p>
              </div>
              
              <Button 
                asChild 
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium py-3 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                <Link href="/auth/login" className="flex items-center gap-2">
                  <ArrowLeftIcon className="h-4 w-4" />
                  Back to Login
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground/60">
              Existing users can continue to use the service normally.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
