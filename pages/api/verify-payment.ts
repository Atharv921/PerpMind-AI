import type { NextApiRequest, NextApiResponse } from 'next'
import { getPaymentProvider } from '@/lib/payments'
import { supabaseAdmin } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { userId, orderId, paymentId, signature } = req.body
  if (!userId || !orderId || !paymentId) return res.status(400).json({ error: 'userId, orderId and paymentId are required' })

  try {
    const { data: { user }, error: authErr } = await supabaseAdmin.auth.admin.getUserById(userId)
    if (authErr || !user) return res.status(401).json({ error: 'Unauthorized' })

    const { data: pending, error: pendErr } = await supabaseAdmin
      .from('payments').select('*').eq('user_id', userId).eq('order_id', orderId).eq('status', 'pending').single() as any
    if (pendErr || !pending) return res.status(400).json({ error: 'No matching pending payment found' })

    const provider = getPaymentProvider()
    const result   = await provider.verifyPayment({ userId, orderId, paymentId, signature })

    if (!result.success) {
      await (supabaseAdmin.from('payments') as any).update({ status: 'failed' }).eq('order_id', orderId)
      return res.status(400).json({ error: result.error || 'Payment verification failed' })
    }

    await (supabaseAdmin.from('payments') as any).update({ status: 'success', payment_id: paymentId }).eq('order_id', orderId)

    await (supabaseAdmin.from('users') as any).upsert({
      id: userId, is_pro: true,
      payment_provider: result.provider, payment_id: paymentId,
      pro_activated_at: new Date().toISOString(),
    }, { onConflict: 'id' })

    await (supabaseAdmin.from('subscriptions') as any).upsert({
      user_id: userId, plan: 'pro', status: 'active',
      current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    }, { onConflict: 'user_id' })

    console.log(`[verify-payment] ✅ Pro activated for user ${userId} via ${result.provider}`)
    return res.status(200).json({ success: true, message: 'Pro plan activated!', provider: result.provider })
  } catch (err: any) {
    console.error('[verify-payment]', err)
    return res.status(500).json({ error: err.message || 'Verification failed' })
  }
}
