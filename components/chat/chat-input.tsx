"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SendIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
  placeholder?: string
  className?: string
}

export function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = "Type your message...",
  className,
}: ChatInputProps) {
  const [message, setMessage] = useState("")

  console.log("🎨 [ChatInput] Component rendered with:", { disabled, placeholder, message })

  const handleSubmit = (e: React.FormEvent) => {
    console.log("📝 [ChatInput] Form submit event triggered!")
    e.preventDefault()
    console.log("📝 [ChatInput] Form submitted with message:", message)
    console.log("📝 [ChatInput] Message trimmed:", message.trim())
    console.log("📝 [ChatInput] Disabled state:", disabled)
    
    if (message.trim() && !disabled) {
      console.log("✅ [ChatInput] Calling onSendMessage with:", message.trim())
      onSendMessage(message.trim())
      setMessage("")
      console.log("✅ [ChatInput] Message sent and input cleared")
    } else {
      console.log("❌ [ChatInput] Form submission blocked:", { 
        hasMessage: !!message.trim(), 
        isDisabled: disabled 
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      console.log("⌨️ [ChatInput] Enter key pressed (without shift)")
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log("✏️ [ChatInput] Input changed:", e.target.value)
    setMessage(e.target.value)
  }

  return (
    <div className={cn("border-t bg-background/80 backdrop-blur-sm", className)}>
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="p-4">
          <div className="relative">
            {/* Input Container */}
            <div className="relative flex items-end gap-3 p-3 bg-card border border-border rounded-xl shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-ring focus-within:border-ring focus-within:shadow-lg">
              {/* Textarea */}
              <Textarea
                value={message}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                className={cn(
                  "min-h-[60px] max-h-[200px] resize-none border-0 bg-transparent",
                  "text-foreground placeholder:text-muted-foreground/60",
                  "focus:ring-0 focus:outline-none focus:border-0",
                  "text-base leading-relaxed",
                  "flex-1"
                )}
                rows={1}
              />
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Send Button */}
                <Button
                  type="submit"
                  disabled={disabled || !message.trim()}
                  className={cn(
                    "h-9 w-9 transition-all duration-200",
                    message.trim() && !disabled
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transform hover:scale-105"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  <SendIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Character count and tips */}
            <div className="flex items-center justify-between mt-2 px-1">
              <div className="text-xs text-muted-foreground/60">
                Press Enter to send, Shift+Enter for new line
              </div>
              {message.length > 0 && (
                <div className="text-xs text-muted-foreground/60">
                  {message.length} characters
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
