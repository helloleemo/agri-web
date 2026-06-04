/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  description: string
  unit: string
  unitPrice: number
  quantity: number
  image: string
}

interface CartContextValue {
  items: CartItem[]
  totalQuantity: number
  addItem: (item: CartItem) => void
  replaceWithSingleItem: (item: CartItem) => void
  updateItemQuantity: (id: string, nextQuantity: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
}

const CART_STORAGE_KEY = 'mekarang_cart_items'

const readStoredItems = (): CartItem[] => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(
      (item): item is CartItem =>
        Boolean(item) &&
        typeof item === 'object' &&
        typeof (item as CartItem).id === 'string' &&
        typeof (item as CartItem).name === 'string' &&
        typeof (item as CartItem).quantity === 'number',
    )
  } catch {
    return []
  }
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => readStoredItems())

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((current) => current.id === item.id)
      if (existingIndex === -1) {
        return [...prev, item]
      }

      return prev.map((current, index) =>
        index === existingIndex
          ? {
              ...current,
              quantity: current.quantity + item.quantity,
            }
          : current,
      )
    })
  }

  const replaceWithSingleItem = (item: CartItem) => {
    setItems([item])
  }

  const updateItemQuantity = (id: string, nextQuantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, nextQuantity) } : item,
      ),
    )
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setItems([])
  }

  const totalQuantity = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])

  const value = useMemo(
    () => ({
      items,
      totalQuantity,
      addItem,
      replaceWithSingleItem,
      updateItemQuantity,
      removeItem,
      clearCart,
    }),
    [items, totalQuantity],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
