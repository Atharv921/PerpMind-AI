import type { NextApiRequest, NextApiResponse } from 'next'
import { getPaymentProvider, PRO_AMOUNT, PRO_CURRENCY } from '@/lib/payments'
import { supabaseAdmin } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { userId } = req.body
  if (!userId) return res.status(400).json({ error: 'userId is required' })

  try {
    const { data: { user }, error: authErr } = await supabaseAdmin.auth.admin.getUserById(userId)
    if (authErr || !user) return res.status(401).json({ error: 'Unauthorized' })

    const { data: userRow } = await supabaseAdmin.from('users').select('is_pro').eq('id', userId).single()
    if (userRow?.is_pro) return res.status(400).json({ error: 'User is already on Pro plan' })

    const provider = getPaymentProvider()
    const order    = await provider.createOrder(userId, PRO_AMOUNT, PRO_CURRENCY)

    await supabaseAdmin.from('payments').insert({
      user_id: userId, order_id: order.orderId,
      amount: order.amount, currency: order.currency,
      payment_provider: order.provider, status: 'pending',
    })

    console.log(`[create-order] ${order.provider} order ${order.orderId} for user ${userId}`)
    return res.status(200).json(order)
  } catch (err: any) {
    console.error('[create-order]', err)
    return res.status(500).json({ error: err.message || 'Failed to create order' })
  }
}
