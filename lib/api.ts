interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface Conversation {
  id: string
  title: string
  created_at: string
  updated_at: string
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  created_at: string
}

export class ApiClient {
  private async request(endpoint: string, options: RequestInit = {}) {
    console.log("[Nalang.ai] Making API request to:", endpoint)

    try {
      const response = await fetch(endpoint, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      console.log("[Nalang.ai] Response status:", response.status, response.statusText)

      if (!response.ok) {
        let errorMessage = "Request failed"
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (parseError) {
          // If response is not JSON (like HTML error page), use status text
          errorMessage = `${response.status}: ${response.statusText}`
          console.log("[Nalang.ai] Non-JSON error response, likely HTML error page")
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log("[Nalang.ai] Response data:", data)
      return data
    } catch (error) {
      console.error("[Nalang.ai] API request failed:", error)
      throw error
    }
  }

  // Conversations
  async getConversations(): Promise<Conversation[]> {
    const data = await this.request("/api/conversations")
    return data.conversations
  }

  async createConversation(title?: string): Promise<Conversation> {
    const data = await this.request("/api/conversations", {
      method: "POST",
      body: JSON.stringify({ title }),
    })
    return data.conversation
  }

  async updateConversation(id: string, title: string): Promise<Conversation> {
    const data = await this.request(`/api/conversations/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title }),
    })
    return data.conversation
  }

  async deleteConversation(id: string): Promise<void> {
    await this.request(`/api/conversations/${id}`, {
      method: "DELETE",
    })
  }

  async deleteAllConversations(): Promise<void> {
    await this.request("/api/conversations", {
      method: "DELETE",
    })
  }

  // Messages
  async getMessages(conversationId: string): Promise<Message[]> {
    const data = await this.request(`/api/conversations/${conversationId}/messages`)
    return data.messages
  }

  async createMessage(conversationId: string, role: "user" | "assistant", content: string): Promise<Message> {
    const data = await this.request(`/api/conversations/${conversationId}/messages`, {
      method: "POST",
      body: JSON.stringify({ role, content }),
    })
    return data.message
  }

  // Chat streaming
  async streamChat(messages: ChatMessage[], conversationId?: string): Promise<ReadableStream> {
    console.log("🌐 [streamChat] Starting chat request with:", { messages, conversationId })
    
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages, conversationId }),
    })

    console.log("📡 [streamChat] Response received:", {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      ok: response.ok
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }))
      console.error("❌ [streamChat] Response not ok:", error)
      throw new Error(error.error || "Chat request failed")
    }

    if (!response.body) {
      console.error("❌ [streamChat] Response body is null")
      throw new Error("No response body")
    }

    console.log("✅ [streamChat] Returning response body stream")
    return response.body
  }
}

export const apiClient = new ApiClient()
