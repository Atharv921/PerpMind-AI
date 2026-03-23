import { supabaseAdmin } from '@/lib/supabase'

export const FREE_DAILY_LIMIT = 2

export async function isUserPro(userId: string): Promise<boolean> {
  const { data: userRow } = await supabaseAdmin.from('users').select('is_pro').eq('id', userId).single()
  if (userRow?.is_pro === true) return true
  const { data: sub } = await supabaseAdmin.from('subscriptions').select('plan, status').eq('user_id', userId).single()
  return sub?.plan === 'pro' && sub?.status === 'active'
}

export async function getDailyUsage(userId: string): Promise<number> {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabaseAdmin.from('usage').select('tests_generated').eq('user_id', userId).eq('date', today).single()
  return data?.tests_generated || 0
}

export async function incrementUsage(userId: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabaseAdmin.from('usage').select('id, tests_generated').eq('user_id', userId).eq('date', today).single()
  if (data) {
    await supabaseAdmin.from('usage').update({ tests_generated: data.tests_generated + 1 }).eq('id', data.id)
  } else {
    await supabaseAdmin.from('usage').insert({ user_id: userId, date: today, tests_generated: 1 })
  }
}

export async function canGenerateTest(userId: string): Promise<{
  allowed: boolean; isPro: boolean; usageToday: number; limit: number
}> {
  const [isPro, usageToday] = await Promise.all([isUserPro(userId), getDailyUsage(userId)])
  if (isPro) return { allowed: true, isPro: true, usageToday, limit: Infinity }
  return { allowed: usageToday < FREE_DAILY_LIMIT, isPro: false, usageToday, limit: FREE_DAILY_LIMIT }
}

export async function initializeUserRecord(userId: string): Promise<void> {
  await supabaseAdmin.from('users').upsert({ id: userId, is_pro: false }, { onConflict: 'id', ignoreDuplicates: true })
  const { data: existing } = await supabaseAdmin.from('subscriptions').select('id').eq('user_id', userId).single()
  if (!existing) {
    await supabaseAdmin.from('subscriptions').insert({
      user_id: userId, plan: 'free', status: 'active',
      stripe_customer_id: '', stripe_subscription_id: '',
      current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    })
  }
}

export const initializeUserSubscription = initializeUserRecord

export async function getUserProfile(userId: string) {
  const { data } = await supabaseAdmin.from('users').select('*').eq('id', userId).single()
  return data
}
