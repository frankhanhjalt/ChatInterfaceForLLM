"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/chat/sidebar"
import { ChatArea } from "@/components/chat/chat-area"
import { useTheme } from "next-themes"
import { useAuth } from "@/components/auth/auth-provider"
import { useChat } from "@/hooks/use-chat"
import { apiClient } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { SunIcon, MoonIcon, LogOutIcon, MessageSquareIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Conversation {
  id: string
  title: string
  created_at: string
  updated_at: string
}

export default function ChatPage() {
  console.log("🏠 [ChatPage] Component rendering...")
  
  const { theme, setTheme } = useTheme()
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>()
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)
  const [conversationsLoaded, setConversationsLoaded] = useState(false)

  const { messages, sendMessage, clearMessages, setMessagesFromExternal, isLoading } = useChat({
    conversationId: currentConversationId,
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  console.log("🏠 [ChatPage] State:", { 
    user: !!user, 
    loading, 
    conversationsCount: conversations.length,
    currentConversationId,
    messagesCount: messages.length,
    isLoading
  })

  useEffect(() => {
    if (!loading && !user) {
      // Reset conversations loaded flag when user is not authenticated
      setConversationsLoaded(false)
      router.push("/auth/login")
    }
  }, [user, loading, router])

  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      console.log("📥 [loadMessages] Loading messages for conversation:", conversationId)
      const fetchedMessages = await apiClient.getMessages(conversationId)
      console.log("📥 [loadMessages] Fetched messages:", fetchedMessages.length)
      // Convert API messages to chat messages format
      const chatMessages = fetchedMessages.map((msg) => ({
        id: msg.id,
        role: msg.role as "user" | "assistant",
        content: msg.content,
        timestamp: msg.created_at,
      }))
      console.log("📥 [loadMessages] Converted chat messages:", chatMessages.length)
      // Update messages in the chat hook
      setMessagesFromExternal(chatMessages)
      console.log("✅ [loadMessages] Messages loaded successfully")
    } catch (error) {
      console.error("❌ [loadMessages] Failed to load messages:", error)
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      })
    }
  }, [setMessagesFromExternal])

  const loadConversations = async () => {
    try {
      console.log("[v0] Loading conversations for user:", user?.id)
      setIsLoadingConversations(true)
      const fetchedConversations = await apiClient.getConversations()
      console.log("[v0] Loaded conversations:", fetchedConversations.length)
      setConversations(fetchedConversations)

      // If no conversations exist, create a new one by default
      if (fetchedConversations.length === 0) {
        console.log("[v0] No conversations found, creating new chat by default")
        try {
          const newConversation = await apiClient.createConversation("New Chat")
          console.log("[v0] New conversation created by default:", newConversation.id)
          setConversations([newConversation])
          setCurrentConversationId(newConversation.id)
        } catch (error) {
          console.error("[v0] Failed to create default conversation:", error)
          toast({
            title: "Error",
            description: "Failed to create new chat",
            variant: "destructive",
          })
        }
      } else if (!currentConversationId) {
        // Select first conversation if none selected
        setCurrentConversationId(fetchedConversations[0].id)
      }
    } catch (error) {
      console.error("[v0] Failed to load conversations:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load conversations",
        variant: "destructive",
      })
    } finally {
      setIsLoadingConversations(false)
      setConversationsLoaded(true)
    }
  }

  // Load conversations only once when user is authenticated and conversations haven't been loaded yet
  useEffect(() => {
    if (user && !conversationsLoaded) {
      loadConversations()
    }
  }, [user, conversationsLoaded])

  useEffect(() => {
    console.log("🔄 [useEffect] currentConversationId changed:", currentConversationId)
    if (currentConversationId) {
      loadMessages(currentConversationId)
    } else {
      clearMessages()
    }
  }, [currentConversationId, clearMessages, loadMessages])

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth/login")
  }

  const handleNewChat = async () => {
    try {
      const newConversation = await apiClient.createConversation("New Chat")
      setConversations((prev) => [newConversation, ...prev])
      setCurrentConversationId(newConversation.id)
    } catch (error) {
      console.error("Failed to create conversation:", error)
      toast({
        title: "Error",
        description: "Failed to create new chat",
        variant: "destructive",
      })
    }
  }

  const handleConversationSelect = (id: string) => {
    console.log("🔄 [handleConversationSelect] Selecting conversation:", id)
    setCurrentConversationId(id)
  }

  const handleDeleteConversation = async (id: string) => {
    try {
      await apiClient.deleteConversation(id)
      setConversations((prev) => prev.filter((conv) => conv.id !== id))

      // If deleted conversation was selected, select another one
      if (currentConversationId === id) {
        const remainingConversations = conversations.filter((conv) => conv.id !== id)
        setCurrentConversationId(remainingConversations.length > 0 ? remainingConversations[0].id : undefined)
      }

      toast({
        title: "Success",
        description: "Conversation deleted",
      })
    } catch (error) {
      console.error("Failed to delete conversation:", error)
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive",
      })
    }
  }

  const handleUpdateConversationTitle = async (id: string, title: string) => {
    try {
      const updatedConversation = await apiClient.updateConversation(id, title)
      setConversations((prev) => prev.map((conv) => (conv.id === id ? updatedConversation : conv)))
      toast({
        title: "Success",
        description: "Conversation title updated",
      })
    } catch (error) {
      console.error("Failed to update conversation:", error)
      toast({
        title: "Error",
        description: "Failed to update conversation title",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAllConversations = async () => {
    try {
      await apiClient.deleteAllConversations()
      clearMessages()
      
      // Create a new default conversation after deleting all
      try {
        const newConversation = await apiClient.createConversation("New Chat")
        setConversations([newConversation])
        setCurrentConversationId(newConversation.id)
        toast({
          title: "Success",
          description: "All conversations deleted",
        })
      } catch (createError) {
        console.error("Failed to create default conversation after delete all:", createError)
        setConversations([])
        setCurrentConversationId(undefined)
        toast({
          title: "Warning",
          description: "Conversations deleted but failed to create new chat",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to delete all conversations:", error)
      toast({
        title: "Error",
        description: "Failed to delete all conversations",
        variant: "destructive",
      })
    }
  }

  const handleSendMessage = async (content: string) => {
    console.log("🚀 [handleSendMessage] Starting with content:", content)
    console.log("💬 [handleSendMessage] Current conversation ID:", currentConversationId)
    console.log("📝 [handleSendMessage] Current conversations count:", conversations.length)
    console.log("🔑 [handleSendMessage] User authenticated:", !!user)
    console.log("📱 [handleSendMessage] Messages state:", messages)
    
    // We should always have a conversation selected now due to default creation
    if (!currentConversationId) {
      console.error("❌ [handleSendMessage] No conversation selected - this shouldn't happen")
      toast({
        title: "Error",
        description: "No conversation selected",
        variant: "destructive",
      })
      return
    }

    console.log("📤 [handleSendMessage] Sending message to existing conversation...")
    try {
      await sendMessage(content)
      console.log("✅ [handleSendMessage] sendMessage completed successfully")
    } catch (error) {
      console.error("❌ [handleSendMessage] sendMessage failed:", error)
    }

    // Auto-generate title for new conversations
    const currentConv = conversations.find((c) => c.id === currentConversationId)
    if (currentConv && currentConv.title === "New Chat" && messages.length === 0) {
      const title = content.length > 50 ? content.substring(0, 50) + "..." : content
      await handleUpdateConversationTitle(currentConversationId!, title)
    }
  }

  if (loading || isLoadingConversations) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2 text-foreground">Loading...</h1>
          <p className="text-muted-foreground">{loading ? "Checking authentication..." : "Loading conversations..."}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="fixed inset-0 flex bg-background overflow-hidden">
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onConversationSelect={handleConversationSelect}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        onUpdateTitle={handleUpdateConversationTitle}
        onDeleteAllConversations={handleDeleteAllConversations}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Fixed at top */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center">
              <MessageSquareIcon className="h-4 w-4 text-secondary" />
            </div>
            <h1 className="text-lg font-semibold text-card-foreground">
              {conversations.find((c) => c.id === currentConversationId)?.title || "New Chat"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground font-medium">{user.email}</span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-card-foreground hover:bg-accent/50 transition-colors"
            >
              {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="text-card-foreground hover:bg-accent/50 transition-colors"
            >
              <LogOutIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Chat Area - Fixed height, no scrolling */}
        <div className="flex-1 overflow-hidden">
          <ChatArea 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading} 
            className="h-full" 
          />
        </div>
      </div>
    </div>
  )
}
