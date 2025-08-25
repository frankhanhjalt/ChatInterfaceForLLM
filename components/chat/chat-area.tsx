"use client"

import { useEffect, useRef } from "react"
import { Message } from "./message"
import { ChatInput } from "./chat-input"
import { cn } from "@/lib/utils"
import { BotIcon, SparklesIcon, MessageSquareIcon } from "lucide-react"
import Image from "next/image"
// Model selector moved into ChatInput

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

interface ChatAreaProps {
  messages: ChatMessage[]
  onSendMessage: (message: string) => void
  isLoading?: boolean
  className?: string
}

export function ChatArea({ messages, onSendMessage, isLoading = false, className }: ChatAreaProps) {
  console.log("🎭 [ChatArea] Component rendered with:", { 
    messagesCount: messages.length, 
    isLoading, 
    hasOnSendMessage: !!onSendMessage 
  })
  
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Always scroll to the latest message when messages change or streaming toggles
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages, isLoading])
  
  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      {/* Messages - Fixed height, no scrolling */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-4xl mx-auto overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center p-8">
              <div className="space-y-6 max-w-md">
                {/* Welcome Icon */}
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-full flex items-center justify-center overflow-hidden">
                  <Image 
                    src="/img/avatar.png" 
                    alt="AI Assistant Avatar"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                
                {/* Welcome Text */}
                <div className="space-y-3">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    Welcome to Nalang.ai
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    I'm your Nalang.ai assistant. How can I help you today?
                  </p>
                </div>
                

                
                {/* Features */}
                <div className="pt-6 border-t border-border/50">
                  <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground/60">
                    <div className="flex items-center gap-1">
                      <MessageSquareIcon className="w-3 h-3" />
                      <span>Smart responses</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <SparklesIcon className="w-3 h-3" />
                      <span>AI powered</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BotIcon className="w-3 h-3" />
                      <span>24/7 available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-1 p-4">
              {messages.map((message) => (
                <Message key={message.id} role={message.role} content={message.content} timestamp={message.timestamp} />
              ))}
              {isLoading && messages.length > 0 && messages[messages.length - 1]?.role === "user" && (
                <Message role="assistant" content="Thinking..." className="animate-pulse" />
              )}
              <div ref={endOfMessagesRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input - Fixed at bottom */}
      <div className="flex-shrink-0">
        <ChatInput 
          onSendMessage={onSendMessage} 
          disabled={isLoading} 
          placeholder="Type your message..." 
        />
      </div>
    </div>
  )
}
