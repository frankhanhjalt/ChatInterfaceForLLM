import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangleIcon, ArrowLeftIcon, HomeIcon, RefreshCwIcon } from "lucide-react"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500/20 to-red-500/10 rounded-full flex items-center justify-center">
              <AlertTriangleIcon className="w-10 h-10 text-red-500" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Oops! Something went wrong
              </h1>
              <p className="text-muted-foreground text-lg">
                We encountered an error during authentication
              </p>
            </div>
          </div>

          {/* Error Card */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-xl">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-xl text-card-foreground">Authentication Error</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-3">
                {params?.error ? (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive font-medium">Error: {params.error}</p>
                  </div>
                ) : (
                  <div className="p-3 bg-muted/50 border border-border/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">An unspecified error occurred during authentication.</p>
                  </div>
                )}
                
                <p className="text-sm text-muted-foreground/70 leading-relaxed">
                  Don't worry, this is usually a temporary issue. You can try again or return to the login page.
                </p>
              </div>
              
              <div className="space-y-3">
                <Button 
                  asChild 
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium py-3 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <Link href="/auth/login" className="flex items-center justify-center gap-2">
                    <ArrowLeftIcon className="h-4 w-4" />
                    Back to Login
                  </Link>
                </Button>
                
                <Button 
                  variant="outline"
                  asChild 
                  className="w-full border-border/50 hover:bg-muted/50 transition-all duration-200"
                >
                  <Link href="/" className="flex items-center justify-center gap-2">
                    <HomeIcon className="h-4 w-4" />
                    Go Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Help */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground/60">
              <div className="flex items-center gap-1">
                <RefreshCwIcon className="w-3 h-3" />
                <span>Try again</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangleIcon className="w-3 h-3" />
                <span>Check details</span>
              </div>
              <div className="flex items-center gap-1">
                <HomeIcon className="w-3 h-3" />
                <span>Go home</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
