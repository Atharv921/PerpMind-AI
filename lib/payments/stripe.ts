// Stripe Provider — PLACEHOLDER (NOT ACTIVE)
// To activate: set PAYMENT_PROVIDER=stripe in .env.local, then fill in createOrder()
import type { PaymentProvider, CreateOrderResult, VerifyPaymentInput, VerifyPaymentResult } from './types'

export class StripeProvider implements PaymentProvider {
  readonly name = 'stripe' as const

  async createOrder(userId: string, amount: number, currency: string): Promise<CreateOrderResult> {
    // TODO: uncomment when activating Stripe
    // const stripe  = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })
    // const session = await stripe.checkout.sessions.create({
    //   mode: 'payment',
    //   line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID!, quantity: 1 }],
    //   success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
    //   cancel_url:  `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    //   metadata: { user_id: userId },
    // })
    // return { orderId: session.id, amount, currency, provider: 'stripe', metadata: { checkoutUrl: session.url! } }
    throw new Error('Stripe is not active yet. Set PAYMENT_PROVIDER=stripe and implement createOrder().')
  }

  async verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult> {
    throw new Error('Stripe uses webhooks for verification.')
  }
}
