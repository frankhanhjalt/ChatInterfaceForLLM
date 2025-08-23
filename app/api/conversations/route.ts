import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("[Nalang.ai] GET /api/conversations - Starting request")
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("[Nalang.ai] Auth check - User:", user?.id, "Error:", authError)

    if (authError || !user) {
      console.log("[Nalang.ai] Authentication failed, returning 401")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[Nalang.ai] Fetching conversations for user:", user.id)
    const { data: conversations, error } = await supabase
      .from("conversations")
      .select("id, title, created_at, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("[Nalang.ai] Database error:", error)
      return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
    }

    console.log("[v0] Successfully fetched", conversations?.length || 0, "conversations")
    return NextResponse.json({ conversations: conversations || [] })
  } catch (error) {
    console.error("[v0] Conversations API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title } = await request.json()

    const { data: conversation, error } = await supabase
      .from("conversations")
      .insert({
        user_id: user.id,
        title: title || "New Chat",
      })
      .select("id, title, created_at, updated_at")
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 })
    }

    return NextResponse.json({ conversation })
  } catch (error) {
    console.error("Create conversation API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log("[Nalang.ai] DELETE /api/conversations - Starting request to delete all conversations")
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("[Nalang.ai] Auth check - User:", user?.id, "Error:", authError)

    if (authError || !user) {
      console.log("[Nalang.ai] Authentication failed, returning 401")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[Nalang.ai] Deleting all conversations for user:", user.id)
    
    // Delete all conversations for the user
    const { error } = await supabase
      .from("conversations")
      .delete()
      .eq("user_id", user.id)

    if (error) {
      console.error("[Nalang.ai] Database error:", error)
      return NextResponse.json({ error: "Failed to delete conversations" }, { status: 500 })
    }

    console.log("[Nalang.ai] Successfully deleted all conversations for user:", user.id)
    return NextResponse.json({ message: "All conversations deleted successfully" })
  } catch (error) {
    console.error("[Nalang.ai] Delete conversations API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
