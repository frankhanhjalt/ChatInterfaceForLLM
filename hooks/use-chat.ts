"use client"

import { useState, useCallback } from "react"
import { apiClient } from "@/lib/api"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

interface UseChatOptions {
  conversationId?: string
  onError?: (error: Error) => void
}

export function useChat({ conversationId, onError }: UseChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = useCallback(
    async (content: string) => {
      console.log("🎯 [useChat] sendMessage called with:", { content, conversationId, isLoading })
      
      if (!content.trim() || isLoading || !conversationId) {
        console.log("❌ [useChat] sendMessage early return:", { 
          hasContent: !!content.trim(), 
          isLoading, 
          hasConversationId: !!conversationId 
        })
        return
      }

      console.log("✅ [useChat] Proceeding with message send...")
      
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content: content.trim(),
        timestamp: new Date().toISOString(),
      }

      console.log("👤 [useChat] Created user message:", userMessage)

      setMessages((prev) => {
        console.log("➕ [useChat] Adding user message to state")
        const newMessages = [...prev, userMessage]
        return newMessages
      })

      setIsLoading(true)

      try {
        console.log("💾 [useChat] Saving user message to database...")
        // Save user message to database (only once)
        await apiClient.createMessage(conversationId, "user", content.trim())
        console.log("✅ [useChat] User message saved to database successfully")

        // Prepare messages for AI
        const chatMessages = [...messages, userMessage].map((msg) => ({
          role: msg.role,
          content: msg.content,
        }))

        console.log("🤖 [useChat] Calling OpenAI API with messages:", chatMessages)
        
        // Get the stream and start processing
        const stream = await apiClient.streamChat(chatMessages, conversationId)
        const reader = stream.getReader()
        const decoder = new TextDecoder()

        console.log("📡 [useChat] Processing streaming response...")
        let chunkCount = 0
        
        // Create the assistant message that will be updated with streaming content
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "",
          timestamp: new Date().toISOString(),
        }

        console.log("🤖 [useChat] Created assistant message:", assistantMessage)

        try {
          // Add the empty assistant message to start
          setMessages((prev) => {
            console.log("➕ [useChat] Adding assistant message to state")
            const newMessages = [...prev, assistantMessage]
            console.log("➕ [useChat] New messages state:", newMessages)
            return newMessages
          })
          
          while (true) {
            const { done, value } = await reader.read()
            if (done) {
              console.log("✅ [useChat] Stream completed, total chunks processed:", chunkCount)
              break
            }

            chunkCount++
            const chunk = decoder.decode(value)
            console.log(`📦 [useChat] Chunk ${chunkCount}:`, chunk)
            
            // For AI SDK streamText, chunks are plain text, not JSON
            if (chunk.trim()) {
              console.log(`🔄 [useChat] Updating message ${assistantMessage.id} with chunk: "${chunk}"`)
              // Update the message with the new text chunk
              setMessages((prev) => {
                const updatedMessages = prev.map((msg) => 
                  msg.id === assistantMessage.id 
                    ? { ...msg, content: msg.content + chunk }
                    : msg
                )
                console.log(`🔄 [useChat] Updated messages state:`, updatedMessages)
                return updatedMessages
              })
            }
          }
        } finally {
          // Always close the reader
          reader.releaseLock()
        }

        // Save the complete assistant message to the database after streaming (only once)
        setMessages((prev) => {
          const currentMessage = prev.find(msg => msg.id === assistantMessage.id)
          if (currentMessage && currentMessage.content) {
            console.log("💾 [useChat] Saving complete assistant message to database (only once):", currentMessage.content)
            
            // Save to database (only once)
            apiClient.createMessage(conversationId, "assistant", currentMessage.content)
              .then(() => console.log("✅ [useChat] Assistant message saved to database successfully"))
              .catch(error => console.error("❌ [useChat] Failed to save assistant message:", error))
          }
          return prev
        })
      } catch (error) {
        console.error("❌ [useChat] Chat error:", error)
        onError?.(error instanceof Error ? error : new Error("Unknown error"))

        // Remove the failed message
        setMessages((prev) => prev.slice(0, -1))
      } finally {
        setIsLoading(false)
      }
    },
    [messages, conversationId, isLoading, onError],
  )

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  const setMessagesFromExternal = useCallback((newMessages: ChatMessage[]) => {
    console.log("🔄 [useChat] setMessagesFromExternal called with:", newMessages.length, "messages")
    setMessages(newMessages)
  }, [])

  const loadMessages = useCallback(
    async (convId: string) => {
      try {
        const fetchedMessages = await apiClient.getMessages(convId)
        const chatMessages = fetchedMessages.map((msg) => ({
          id: msg.id,
          role: msg.role as "user" | "assistant",
          content: msg.content,
          timestamp: msg.created_at,
        }))
        setMessages(chatMessages)
      } catch (error) {
        console.error("Failed to load messages:", error)
        onError?.(error instanceof Error ? error : new Error("Failed to load messages"))
      }
    },
    [onError],
  )

  return {
    messages,
    sendMessage,
    clearMessages,
    setMessagesFromExternal,
    loadMessages,
    isLoading,
  }
}
