import { createClient } from '@supabase/supabase-js'
import { createBrowserClient as createSSRBrowserClient } from '@supabase/ssr'

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
const supabaseService = process.env.SUPABASE_SERVICE_ROLE_KEY

// Lazily create clients only when env vars are available
let supabaseAdminClient: ReturnType<typeof createClient> | null = null
let supabaseBrowserClient: ReturnType<typeof createSSRBrowserClient> | null = null

export function getSupabaseAdmin() {
  if (!supabaseUrl || !supabaseService) {
    throw new Error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  }
  if (!supabaseAdminClient) {
    supabaseAdminClient = createClient(supabaseUrl, supabaseService, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }
  return supabaseAdminClient
}

export function createBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY')
  }
  if (!supabaseBrowserClient) {
    supabaseBrowserClient = createSSRBrowserClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseBrowserClient
}

// Export admin client
export const supabaseAdmin = new Proxy({} as ReturnType<typeof createClient>, {
  get: () => getSupabaseAdmin(),
})

// ── Types ──────────────────────────────────────────────────────────────────────
export interface UserProfile {
  id: string; email: string; full_name?: string
  is_pro: boolean; payment_provider?: 'razorpay' | 'stripe' | null
  payment_id?: string; pro_activated_at?: string
  created_at: string; updated_at: string
}
export interface Question {
  id: string; question: string; options: string[]
  correct_answer: string; topic?: string
  difficulty?: 'easy' | 'medium' | 'hard'; explanation?: string
}
export interface ResultAnalysis {
  overall_performance: string; score_percentage: number
  strong_topics: string[]; weak_topics: string[]
  recommendations: string[]; detailed_feedback: string
}
export interface Payment {
  id: string; user_id: string; order_id: string; payment_id?: string
  amount: number; currency: string; payment_provider: 'razorpay' | 'stripe'
  status: 'pending' | 'success' | 'failed'; created_at: string; updated_at: string
}
