// ─────────────────────────────────────────────────────────────────────────────
// PrepMind AI — Shared TypeScript Types
// ─────────────────────────────────────────────────────────────────────────────

// ── Database rows ─────────────────────────────────────────────────────────────

export interface DBUser {
  id: string
  email: string
  full_name?: string
  is_pro: boolean
  payment_provider?: 'razorpay' | 'stripe' | null
  payment_id?: string
  pro_activated_at?: string
  created_at: string
  updated_at: string
}

export interface DBTest {
  id: string
  user_id: string
  title: string
  notes_content?: string
  questions: DBQuestion[]
  total_questions: number
  score: number | null
  completed_at: string | null
  created_at: string
}

export interface DBTestResult {
  id: string
  test_id: string
  user_id: string
  answers: Record<string, string>
  score: number
  total_questions: number
  time_taken: number
  analysis: TestAnalysis | null
  created_at: string
}

export interface DBSubscription {
  id: string
  user_id: string
  stripe_customer_id: string
  stripe_subscription_id: string
  plan: 'free' | 'pro'
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  current_period_end: string
  created_at: string
}

export interface DBUsage {
  id: string
  user_id: string
  date: string
  tests_generated: number
  created_at: string
}

export interface DBPayment {
  id: string
  user_id: string
  order_id: string
  payment_id?: string
  amount: number
  currency: string
  payment_provider: 'razorpay' | 'stripe'
  status: 'pending' | 'success' | 'failed'
  created_at: string
  updated_at: string
}

// ── Domain models ─────────────────────────────────────────────────────────────

export interface DBQuestion {
  id: string
  question: string
  options: string[]           // e.g. ["A) Option", "B) Option", ...]
  correct_answer: string      // matches one of options exactly
  topic?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  explanation?: string
}

export interface TestAnalysis {
  overall_performance: string
  score_percentage: number
  strong_topics: string[]
  weak_topics: string[]
  recommendations: string[]
  detailed_feedback: string
}

// ── API request / response shapes ─────────────────────────────────────────────

export interface GenerateQuestionsRequest {
  notes: string
  questionCount?: number
  userId: string
}

export interface GenerateQuestionsResponse {
  questions: DBQuestion[]
  count: number
}

export interface AnalyzeResultsRequest {
  testId: string
  userId: string
  questions: DBQuestion[]
  answers: Record<string, string>
  timeTaken?: number
}

export interface AnalyzeResultsResponse {
  score: number
  totalQuestions: number
  analysis: TestAnalysis
  resultId: string
}

export interface CreateOrderRequest  { userId: string }
export interface VerifyPaymentRequest {
  userId: string
  orderId: string
  paymentId: string
  signature?: string
}
export interface VerifyPaymentResponse {
  success: boolean
  message: string
  provider: 'razorpay' | 'stripe'
}

// ── UI helpers ────────────────────────────────────────────────────────────────

export type PlanType  = 'free' | 'pro'
export type DiffLevel = 'easy' | 'medium' | 'hard'

export interface DashboardStats {
  totalTests: number
  avgScore: number
  bestScore: number
  totalQuestions: number
}

export interface UsageStatus {
  usageToday: number
  limit: number
  isPro: boolean
  allowed: boolean
}
