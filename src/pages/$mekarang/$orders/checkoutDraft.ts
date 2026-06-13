export type ShippingMethod = '宅配' | '其他'
export type PaymentMethod = '匯款' | '面交' | 'Line Pay'

export interface BuyerForm {
  name: string
  phone: string
  email: string
  note: string
}

export interface ReceiverForm {
  name: string
  phone: string
  address: string
  shippingMethod: ShippingMethod
  paymentMethod: PaymentMethod
}

export interface CheckoutDraft {
  couponCode: string
  buyer: BuyerForm
  receiver: ReceiverForm
}

export const EMPTY_BUYER: BuyerForm = {
  name: '',
  phone: '',
  email: '',
  note: '',
}

export const EMPTY_RECEIVER: ReceiverForm = {
  name: '',
  phone: '',
  address: '',
  shippingMethod: '宅配',
  paymentMethod: '匯款',
}

export const EMPTY_CHECKOUT_DRAFT: CheckoutDraft = {
  couponCode: '',
  buyer: EMPTY_BUYER,
  receiver: EMPTY_RECEIVER,
}

const CHECKOUT_DRAFT_STORAGE_KEY = 'mekarang_checkout_draft'

export const readCheckoutDraft = (): CheckoutDraft => {
  if (typeof window === 'undefined') {
    return EMPTY_CHECKOUT_DRAFT
  }

  try {
    const raw = window.sessionStorage.getItem(CHECKOUT_DRAFT_STORAGE_KEY)
    if (!raw) {
      return EMPTY_CHECKOUT_DRAFT
    }

    const parsed = JSON.parse(raw) as Partial<CheckoutDraft>

    return {
      couponCode: typeof parsed.couponCode === 'string' ? parsed.couponCode : '',
      buyer: {
        ...EMPTY_BUYER,
        ...(parsed.buyer ?? {}),
      },
      receiver: {
        ...EMPTY_RECEIVER,
        ...(parsed.receiver ?? {}),
      },
    }
  } catch {
    return EMPTY_CHECKOUT_DRAFT
  }
}

export const writeCheckoutDraft = (draft: CheckoutDraft) => {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.setItem(CHECKOUT_DRAFT_STORAGE_KEY, JSON.stringify(draft))
}

export const clearCheckoutDraft = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.removeItem(CHECKOUT_DRAFT_STORAGE_KEY)
}

export const toDeliveryMethodCode = (method: ShippingMethod): number => {
  return method === '宅配' ? 1 : 2
}

export const toPaymentMethodCode = (method: PaymentMethod): number => {
  if (method === '匯款') {
    return 1
  }
  if (method === '面交') {
    return 2
  }
  return 3
}
