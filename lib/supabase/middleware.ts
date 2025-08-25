import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("[Middleware] Missing Supabase environment variables")
      return supabaseResponse
    }
    
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
          },
        },
      },
    )

    // Add timeout to prevent hanging
    const authPromise = supabase.auth.getUser()
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Auth timeout')), 5000)
    )
    
    const {
      data: { user },
    } = await Promise.race([authPromise, timeoutPromise]) as any

    // Redirect unauthenticated users to login, except for auth pages
    if (!user && !request.nextUrl.pathname.startsWith("/auth") && request.nextUrl.pathname !== "/") {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }

    // Redirect authenticated users away from auth pages
    if (user && (request.nextUrl.pathname.startsWith("/auth") || request.nextUrl.pathname === "/")) {
      const url = request.nextUrl.clone()
      url.pathname = "/chat"
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch (error) {
    console.error("[Middleware] Auth error:", error)
    // On error, allow the request to continue without redirects
    return supabaseResponse
  }
}
