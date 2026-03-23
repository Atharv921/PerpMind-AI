import { createClient } from '@/utils/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'

const protectedRoutes = ['/dashboard', '/upload', '/test', '/result']
const authRoutes = ['/login', '/signup']

export async function middleware(req: NextRequest) {
  const { supabase, response } = createClient(req)
  
  // Refresh session to keep auth state up to date
  const { data: { user } } = await supabase.auth.getUser()
  const pathname = req.nextUrl.pathname

  if (protectedRoutes.some(r => pathname.startsWith(r))) {
    if (!user) {
      const url = new URL('/login', req.url)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
  }

  if (authRoutes.includes(pathname) && user) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/upload/:path*', '/test/:path*', '/result/:path*', '/login', '/signup'],
}
