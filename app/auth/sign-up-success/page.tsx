import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircleIcon, MailIcon, ArrowLeftIcon, SparklesIcon } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="w-10 h-10 text-green-500" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Welcome aboard!
              </h1>
              <p className="text-muted-foreground text-lg">
                Your account has been created successfully
              </p>
            </div>
          </div>

          {/* Success Card */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-xl">
            <CardHeader className="space-y-2 text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-full flex items-center justify-center">
                <MailIcon className="w-8 h-8 text-blue-500" />
              </div>
              <CardTitle className="text-2xl text-card-foreground">Check Your Email</CardTitle>
              <CardDescription className="text-muted-foreground">
                We've sent you a confirmation link
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  You've successfully signed up! Please check your email and click the confirmation link to activate your account before signing in.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground/70">
                  <SparklesIcon className="w-4 h-4" />
                  <span>Your AI chat experience awaits!</span>
                </div>
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

          {/* Features */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground/60">
              <div className="flex items-center gap-1">
                <CheckCircleIcon className="w-3 h-3" />
                <span>Account created</span>
              </div>
              <div className="flex items-center gap-1">
                <MailIcon className="w-3 h-3" />
                <span>Email sent</span>
              </div>
              <div className="flex items-center gap-1">
                <SparklesIcon className="w-3 h-3" />
                <span>Ready to chat</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
