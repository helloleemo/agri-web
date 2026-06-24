/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { cartService, type CartItemInput } from '@/api/cart'

export interface CartItem {
  id: string
  name: string
  description: string
  unit_id: string
  unit: string
  unitPrice: number
  quantity: number
  availableStock?: number
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
  isLoadingServerCart: boolean
}

const CART_STORAGE_KEY = 'mekarang_cart_items'
const UUID_PATTERN = /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi

const extractUnitIdFromCartItemId = (cartItemId: string): string | null => {
  const matches = cartItemId.match(UUID_PATTERN)
  if (!matches || matches.length < 2) {
    return null
  }
  return matches[1]
}

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

    return parsed
      .map((item) => {
        if (!item || typeof item !== 'object') {
          return null
        }

        const candidate = item as Partial<CartItem>
        if (
          typeof candidate.id !== 'string' ||
          typeof candidate.name !== 'string' ||
          typeof candidate.quantity !== 'number'
        ) {
          return null
        }

        const unitId =
          typeof candidate.unit_id === 'string' && candidate.unit_id
            ? candidate.unit_id
            : extractUnitIdFromCartItemId(candidate.id)

        if (!unitId) {
          return null
        }

        return {
          ...candidate,
          unit_id: unitId,
          availableStock:
            typeof candidate.availableStock === 'number' &&
            Number.isFinite(candidate.availableStock)
              ? Math.max(0, Math.floor(candidate.availableStock))
              : undefined,
        } as CartItem
      })
      .filter((item): item is CartItem => item !== null)
  } catch {
    return []
  }
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user } = useAuth()
  const [items, setItems] = useState<CartItem[]>(() => readStoredItems())
  const [isLoadingServerCart, setIsLoadingServerCart] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)

  // Persist local items to localStorage
  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  // Sync with server when user logs in
  useEffect(() => {
    if (!isAuthenticated || !user || !hasInitialized) return

    const syncCartToServer = async () => {
      try {
        setIsLoadingServerCart(true)
        const payload: CartItemInput[] = items.map((item) => ({
          product_id: item.id.split('-')[0], // extract product_id from composite id
          unit_id: item.unit_id,
          quantity: item.quantity,
        }))

        await cartService.syncCart(payload)
      } catch (error) {
        console.error('Failed to sync cart to server:', error)
      } finally {
        setIsLoadingServerCart(false)
      }
    }

    syncCartToServer()
  }, [isAuthenticated, user, hasInitialized, items])

  // Mark as initialized after first render
  useEffect(() => {
    setHasInitialized(true)
  }, [])

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((current) => current.id === item.id)
      if (existingIndex === -1) {
        const normalizedQuantity = Math.max(1, Math.floor(item.quantity))
        const maxQuantity =
          typeof item.availableStock === 'number'
            ? Math.max(0, Math.floor(item.availableStock))
            : Number.POSITIVE_INFINITY

        return [
          ...prev,
          {
            ...item,
            quantity: Math.min(normalizedQuantity, maxQuantity),
          },
        ]
      }

      return prev.map((current, index) => {
        if (index !== existingIndex) {
          return current
        }

        const nextAvailableStock =
          typeof item.availableStock === 'number'
            ? Math.max(0, Math.floor(item.availableStock))
            : current.availableStock
        const maxQuantity =
          typeof nextAvailableStock === 'number'
            ? Math.max(1, nextAvailableStock)
            : Number.POSITIVE_INFINITY

        return {
          ...current,
          availableStock: nextAvailableStock,
          quantity: Math.min(current.quantity + item.quantity, maxQuantity),
        }
      })
    })
  }

  const replaceWithSingleItem = (item: CartItem) => {
    const maxQuantity =
      typeof item.availableStock === 'number'
        ? Math.max(1, Math.floor(item.availableStock))
        : Number.POSITIVE_INFINITY

    setItems([
      {
        ...item,
        quantity: Math.min(Math.max(1, Math.floor(item.quantity)), maxQuantity),
      },
    ])
  }

  const updateItemQuantity = (id: string, nextQuantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                typeof item.availableStock === 'number'
                  ? Math.max(
                      1,
                      Math.min(nextQuantity, Math.max(1, Math.floor(item.availableStock))),
                    )
                  : Math.max(1, nextQuantity),
            }
          : item,
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
      isLoadingServerCart,
    }),
    [items, totalQuantity, isLoadingServerCart],
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
