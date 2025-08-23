import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { UserIcon, BotIcon, SparklesIcon } from "lucide-react"

interface MessageProps {
  role: "user" | "assistant"
  content: string
  timestamp?: string
  className?: string
}

export function Message({ role, content, timestamp, className }: MessageProps) {
  const isUser = role === "user"
  
  console.log("💬 [Message] Rendering message:", { role, content, timestamp, className })

  return (
    <div className={cn(
      "group relative py-6 px-4 md:px-6 transition-colors duration-200",
      isUser ? "bg-background" : "bg-gradient-to-r from-muted/30 via-muted/20 to-muted/10",
      className
    )}>
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-4 items-start">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <Avatar className={cn(
              "h-9 w-9 ring-2 ring-offset-2 transition-all duration-200",
              isUser 
                ? "ring-primary/20 bg-gradient-to-br from-primary to-primary/80" 
                : "ring-secondary/20 bg-gradient-to-br from-secondary to-secondary/80"
            )}>
              <AvatarFallback className={cn(
                "text-sm font-semibold text-white",
                isUser ? "bg-gradient-to-br from-primary to-primary/80" : "bg-gradient-to-br from-secondary to-secondary/80"
              )}>
                {isUser ? <UserIcon className="h-4 w-4" /> : <BotIcon className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Message Content */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "font-semibold text-sm",
                  isUser ? "text-foreground" : "text-foreground"
                )}>
                  {isUser ? "You" : "AI Assistant"}
                </span>
                {!isUser && (
                  <SparklesIcon className="h-3 w-3 text-secondary animate-pulse" />
                )}
              </div>
              {timestamp && (
                <span className="text-xs text-muted-foreground/70 font-mono">
                  {new Date(timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              )}
            </div>

            {/* Message Text */}
            <div className={cn(
              "prose prose-sm max-w-none leading-relaxed",
              "text-foreground/90",
              isUser ? "font-medium" : "font-normal"
            )}>
              <div className={cn(
                "whitespace-pre-wrap break-words",
                isUser ? "text-foreground" : "text-foreground/90"
              )}>
                {content || <span className="text-destructive/80 italic">[Empty message]</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle border for visual separation */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r",
        isUser 
          ? "from-transparent via-border/30 to-transparent" 
          : "from-transparent via-muted/40 to-transparent"
      )} />
    </div>
  )
}
