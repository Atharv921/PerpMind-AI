import Razorpay from 'razorpay'
import crypto from 'crypto'
import type { PaymentProvider, CreateOrderResult, VerifyPaymentInput, VerifyPaymentResult } from './types'

let _client: Razorpay | null = null

function getClient(): Razorpay {
  if (_client) return _client
  const keyId     = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set.')
  _client = new Razorpay({ key_id: keyId, key_secret: keySecret })
  return _client
}

export class RazorpayProvider implements PaymentProvider {
  readonly name = 'razorpay' as const

  async createOrder(userId: string, amount: number, currency = 'INR'): Promise<CreateOrderResult> {
    const client = getClient()
    const order  = await client.orders.create({
      amount, currency,
      receipt: `prepmind_${userId}_${Date.now()}`,
      notes:   { user_id: userId, product: 'PrepMind AI Pro' },
    })
    return {
      orderId:  order.id,
      amount:   order.amount as number,
      currency: order.currency,
      provider: 'razorpay',
      metadata: {
        key:         process.env.RAZORPAY_KEY_ID!,
        name:        'PrepMind AI',
        description: 'Upgrade to Pro — Unlimited Tests',
        order_id:    order.id,
      },
    }
  }

  async verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult> {
    try {
      const { orderId, paymentId, signature } = input
      if (!signature) return { success: false, paymentId, provider: 'razorpay', error: 'Missing signature' }
      const expected = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(`${orderId}|${paymentId}`)
        .digest('hex')
      if (expected !== signature) return { success: false, paymentId, provider: 'razorpay', error: 'Signature verification failed' }
      return { success: true, paymentId, provider: 'razorpay' }
    } catch (err: any) {
      return { success: false, paymentId: input.paymentId, provider: 'razorpay', error: err.message }
    }
  }
}
