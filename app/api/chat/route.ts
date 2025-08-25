import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  let user: any = null
  
  try {
    // Debug environment variables
    if (process.env.NODE_ENV === 'development') {
      console.log("🔧 [Chat API] Environment check:")
      console.log("🔧 [Chat API] NODE_ENV:", process.env.NODE_ENV)
      console.log("🔧 [Chat API] NALANG_API_KEY exists:", !!process.env.NALANG_API_KEY)
      console.log("🔧 [Chat API] NALANG_MODEL:", process.env.NALANG_MODEL || 'nalang-xl-10')
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

    const { messages, conversationId, model: modelFromBody } = await request.json()

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
      console.log('🚀 [Nalang Request] User:', user.email)
      console.log('📝 [Nalang Request] Messages:', JSON.stringify(messages, null, 2))
      console.log('💬 [Nalang Request] Conversation ID:', conversationId)
    }

    const apiKey = process.env.NALANG_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "NALANG_API_KEY is not configured" }, { status: 500 })
    }

    const model = (typeof modelFromBody === 'string' && modelFromBody.trim()) ? modelFromBody : (process.env.NALANG_MODEL || 'nalang-xl-10')

    // Build nalang request body
    const requestBody = {
      model,
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      stream: true,
      temperature: 0.7,
      max_tokens: 800,
      top_p: 0.35,
      repetition_penalty: 1.05,
    }

    // Call nalang streaming API
    console.log('🤖 [Nalang Request] Creating streaming response...')
    const nalangResponse = await fetch('https://www.gpt4novel.com/api/xiaoshuoai/ext/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!nalangResponse.ok || !nalangResponse.body) {
      const errorText = await nalangResponse.text().catch(() => '')
      return NextResponse.json({ error: `Upstream error ${nalangResponse.status}: ${errorText || nalangResponse.statusText}` }, { status: 502 })
    }

    // Transform nalang SSE lines (data: {...}\n) into plain text chunks for the client
    const upstream = nalangResponse.body
    const textEncoder = new TextEncoder()
    const textDecoder = new TextDecoder()

    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        const reader = upstream.getReader()
        let buffer = ''

        const processLine = (line: string) => {
          const trimmed = line.trim()
          if (!trimmed) return
          if (!trimmed.startsWith('data: ')) return
          const payload = trimmed.slice(6).trim()
          if (!payload || payload === '[DONE]') return
          try {
            const json = JSON.parse(payload)
            if (json.completed) {
              controller.close()
              return
            }
            const delta = json?.choices?.[0]?.delta?.content
            if (typeof delta === 'string' && delta.length > 0) {
              controller.enqueue(textEncoder.encode(delta))
            }
          } catch (e) {
            // Ignore non-JSON keepalive lines
          }
        }

        const pump = (): any => {
          reader.read().then(({ done, value }) => {
            if (done) {
              if (buffer) {
                processLine(buffer)
              }
              controller.close()
              return
            }
            buffer += textDecoder.decode(value, { stream: true })
            let newlineIndex: number
            while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
              const line = buffer.slice(0, newlineIndex)
              buffer = buffer.slice(newlineIndex + 1)
              processLine(line)
            }
            pump()
          }).catch((err) => {
            controller.error(err)
          })
        }

        pump()
      },
      cancel() {
        try {
          upstream.cancel()
        } catch {}
      }
    })

    console.log('✅ [Nalang Response] Streaming response created successfully')

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)
    
    // Enhanced error logging in development mode
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ [Nalang Error] Details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
        user: user?.email || 'Unknown'
      })
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
