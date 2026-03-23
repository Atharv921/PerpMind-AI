export type PaymentProviderName = 'razorpay' | 'stripe'

export interface CreateOrderResult {
  orderId: string; amount: number; currency: string
  provider: PaymentProviderName; metadata: Record<string, string>
}
export interface VerifyPaymentInput {
  orderId: string; paymentId: string; signature?: string; userId: string
}
export interface VerifyPaymentResult {
  success: boolean; paymentId: string; provider: PaymentProviderName; error?: string
}
export interface PaymentProvider {
  readonly name: PaymentProviderName
  createOrder(userId: string, amount: number, currency: string): Promise<CreateOrderResult>
  verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult>
}
