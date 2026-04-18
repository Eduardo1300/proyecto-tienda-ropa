import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartAPI } from '../api'
import type { CartItem, Product } from '../types'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const discount = ref(0)
  const discountPercent = ref(0)

  const itemCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  
  const subtotal = computed(() => items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0))
  
  const discountAmount = computed(() => subtotal.value * (discountPercent.value / 100))
  
  const tax = computed(() => (subtotal.value - discountAmount.value) * 0.18)
  
  const shipping = computed(() => (subtotal.value - discountAmount.value) > 100 ? 0 : 10)
  
  const total = computed(() => subtotal.value - discountAmount.value + tax.value + shipping.value)

  const fetchCart = async () => {
    isLoading.value = true
    try {
      const response = await cartAPI.get()
      items.value = response.data || []
    } catch (err) {
      console.error('Error fetching cart:', err)
    } finally {
      isLoading.value = false
    }
  }

  const addItem = (product: Product, quantity: number = 1) => {
    const existingItem = items.value.find(item => item.productId === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({
        id: Date.now(),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        category: product.category,
        imageUrl: product.image || product.imageUrl || ''
      })
    }
  }

  const updateQuantity = async (itemId: number, quantity: number) => {
    const item = items.value.find(i => i.id === itemId)
    if (!item) return

    if (quantity <= 0) {
      await removeItem(itemId)
      return
    }

    try {
      await cartAPI.update(itemId, quantity)
      item.quantity = quantity
    } catch (err) {
      console.error('Error updating quantity:', err)
    }
  }

  const removeItem = async (itemId: number) => {
    try {
      await cartAPI.remove(itemId)
      items.value = items.value.filter(item => item.id !== itemId)
    } catch (err) {
      console.error('Error removing item:', err)
    }
  }

  const clearCart = async () => {
    try {
      await cartAPI.clear()
      items.value = []
      discount.value = 0
      discountPercent.value = 0
    } catch (err) {
      console.error('Error clearing cart:', err)
    }
  }

  const applyDiscount = (percent: number) => {
    discountPercent.value = percent
  }

  return {
    items,
    isLoading,
    error,
    itemCount,
    subtotal,
    discount,
    discountPercent,
    discountAmount,
    tax,
    shipping,
    total,
    fetchCart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    applyDiscount
  }
})