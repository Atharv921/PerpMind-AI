import { RazorpayProvider } from './razorpay'
import { StripeProvider }   from './stripe'
import type { PaymentProvider, PaymentProviderName } from './types'

// ── THE ONE SWITCH POINT ─────────────────────────────────────────────────────
// To switch Razorpay → Stripe: set PAYMENT_PROVIDER=stripe in .env.local
// ─────────────────────────────────────────────────────────────────────────────
export function getActiveProviderName(): PaymentProviderName {
  return process.env.PAYMENT_PROVIDER?.toLowerCase() === 'stripe' ? 'stripe' : 'razorpay'
}

export function getPaymentProvider(): PaymentProvider {
  return getActiveProviderName() === 'stripe' ? new StripeProvider() : new RazorpayProvider()
}

export const PRO_AMOUNT        = 19900   // ₹199 in paise
export const PRO_CURRENCY      = 'INR'
export const PRO_DISPLAY_PRICE = '₹199'

export type { PaymentProvider, PaymentProviderName, CreateOrderResult, VerifyPaymentInput, VerifyPaymentResult } from './types'
