'use client'
import { useState } from 'react'

interface Props { userId: string; userEmail: string; userName?: string; userPhone?: string; onSuccess?: () => void; onError?: (msg: string) => void; className?: string; children?: React.ReactNode }
declare global { interface Window { Razorpay: any } }

type Step = 'idle' | 'creating' | 'paying' | 'verifying'
const stepLabels: Record<Step, string> = {
  idle: '⚡ Upgrade to Pro — ₹199', creating: 'Creating order...', paying: 'Opening checkout...', verifying: 'Verifying payment...',
}

function loadRazorpay(): Promise<boolean> {
  return new Promise(resolve => {
    if (window.Razorpay) { resolve(true); return }
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload  = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })
}

export default function UpgradeButton({ userId, userEmail, userName = '', userPhone = '', onSuccess, onError, className, children }: Props) {
  const [loading, setLoading] = useState(false)
  const [step, setStep]       = useState<Step>('idle')

  const handleUpgrade = async () => {
    setLoading(true); setStep('creating')
    try {
      const orderRes  = await fetch('/api/create-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId }) })
      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.error || 'Failed to create order')

      setStep('paying')
      const loaded = await loadRazorpay()
      if (!loaded) throw new Error('Failed to load Razorpay SDK. Check your connection.')

      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: orderData.metadata.key, amount: orderData.amount, currency: orderData.currency,
          name: orderData.metadata.name || 'PrepMind AI', description: orderData.metadata.description || 'Upgrade to Pro',
          order_id: orderData.orderId,
          prefill: { name: userName, email: userEmail, contact: userPhone },
          theme: { color: '#6366F1', backdrop_color: 'rgba(9,9,15,0.9)' },
          modal: { ondismiss: () => { setLoading(false); setStep('idle'); resolve() } },
          handler: async (resp: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
            setStep('verifying')
            try {
              const verRes  = await fetch('/api/verify-payment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, orderId: resp.razorpay_order_id, paymentId: resp.razorpay_payment_id, signature: resp.razorpay_signature }) })
              const verData = await verRes.json()
              if (!verRes.ok || !verData.success) throw new Error(verData.error || 'Verification failed')
              setStep('idle'); setLoading(false); onSuccess?.(); resolve()
            } catch (e: any) { reject(e) }
          },
        })
        rzp.on('payment.failed', (r: any) => reject(new Error(r.error?.description || 'Payment failed')))
        rzp.open()
      })
    } catch (err: any) {
      console.error('[UpgradeButton]', err.message)
      setLoading(false); setStep('idle')
      onError?.(err.message || 'Payment failed. Please try again.')
    }
  }

  return (
    <button onClick={handleUpgrade} disabled={loading}
      className={className || 'btn-primary w-full justify-center py-3.5 disabled:opacity-60 disabled:cursor-not-allowed'}>
      {loading
        ? <span className="inline-flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{stepLabels[step]}</span>
        : children || stepLabels.idle}
    </button>
  )
}
