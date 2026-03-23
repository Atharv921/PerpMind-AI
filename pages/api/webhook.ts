import type { NextApiRequest, NextApiResponse } from 'next'

export const config = { api: { bodyParser: false } }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const provider = process.env.PAYMENT_PROVIDER || 'razorpay'

  if (provider === 'razorpay') {
    // Razorpay uses direct verify-payment flow — no webhook needed
    return res.status(200).json({ message: 'Razorpay uses direct verification.' })
  }

  if (provider === 'stripe') {
    // TODO when activating Stripe:
    // const sig = req.headers['stripe-signature']
    // const event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!)
    // handle checkout.session.completed → set users.is_pro = true
    return res.status(501).json({ error: 'Stripe webhook not yet implemented' })
  }

  return res.status(400).json({ error: 'Unknown payment provider' })
}
