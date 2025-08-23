import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  let user: any = null
  
  try {
    // Debug environment variables
    if (process.env.NODE_ENV === 'development') {
      console.log("🔧 [Chat API] Environment check:")
      console.log("🔧 [Chat API] NODE_ENV:", process.env.NODE_ENV)
      console.log("🔧 [Chat API] OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY)
      console.log("🔧 [Chat API] OPENAI_API_KEY length:", process.env.OPENAI_API_KEY?.length || 0)
    }
    
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    user = authUser

    const { messages, conversationId } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 })
    }

    // Verify conversation belongs to user
    if (conversationId) {
      const { data: conversation, error: convError } = await supabase
        .from("conversations")
        .select("id")
        .eq("id", conversationId)
        .eq("user_id", user.id)
        .single()

      if (convError || !conversation) {
        return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
      }
    }

    // Log the request in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 [OpenAI Request] User:', user.email)
      console.log('📝 [OpenAI Request] Messages:', JSON.stringify(messages, null, 2))
      console.log('💬 [OpenAI Request] Conversation ID:', conversationId)
    }

    // Test OpenAI client
    if (process.env.NODE_ENV === 'development') {
      try {
        console.log('🧪 [OpenAI Request] Testing OpenAI client...')
        const testModel = openai("gpt-3.5-turbo")
        console.log('✅ [OpenAI Request] OpenAI client created successfully')
      } catch (error) {
        console.error('❌ [OpenAI Request] Failed to create OpenAI client:', error)
      }
    }

    // Create streaming response using OpenAI directly
    console.log('🤖 [OpenAI Request] Creating streaming response...')
    
    // Use OpenAI streaming with the actual user messages
    const result = await streamText({
      model: openai("gpt-3.5-turbo"),
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: 0.7,
    })
    
    console.log('✅ [OpenAI Response] Streaming response created successfully')
    
    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    
    // Enhanced error logging in development mode
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ [OpenAI Error] Details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
        user: user?.email || 'Unknown'
      })
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
