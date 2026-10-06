import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from './cart'

describe('Cart Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should have empty initial state', () => {
    const cart = useCartStore()
    expect(cart.items).toHaveLength(0)
    expect(cart.itemCount).toBe(0)
    expect(cart.subtotal).toBe(0)
  })

  it('should add item to cart', () => {
    const cart = useCartStore()
    const mockProduct = {
      id: 1,
      name: 'Test Product',
      price: 100,
      image: 'test.jpg'
    }
    
    cart.addItem(mockProduct, 2)
    
    expect(cart.items).toHaveLength(1)
    expect(cart.items[0].product.id).toBe(1)
    expect(cart.items[0].quantity).toBe(2)
  })

  it('should update item quantity', () => {
    const cart = useCartStore()
    const mockProduct = {
      id: 1,
      name: 'Test Product',
      price: 100,
      image: 'test.jpg'
    }
    
    cart.addItem(mockProduct, 1)
    cart.updateQuantity(1, 5)
    
    expect(cart.items[0].quantity).toBe(5)
  })

  it('should remove item from cart', () => {
    const cart = useCartStore()
    const mockProduct = {
      id: 1,
      name: 'Test Product',
      price: 100,
      image: 'test.jpg'
    }
    
    cart.addItem(mockProduct, 1)
    cart.removeItem(1)
    
    expect(cart.items).toHaveLength(0)
  })

  it('should calculate subtotal correctly', () => {
    const cart = useCartStore()
    
    cart.addItem({ id: 1, name: 'Product 1', price: 100, image: '' }, 2)
    cart.addItem({ id: 2, name: 'Product 2', price: 50, image: '' }, 3)
    
    expect(cart.subtotal).toBe(350) // (100*2) + (50*3)
  })

  it('should clear cart', () => {
    const cart = useCartStore()
    
    cart.addItem({ id: 1, name: 'Product 1', price: 100, image: '' }, 2)
    cart.addItem({ id: 2, name: 'Product 2', price: 50, image: '' }, 3)
    cart.clearCart()
    
    expect(cart.items).toHaveLength(0)
    expect(cart.subtotal).toBe(0)
  })

  it('should apply promo code discount', () => {
    const cart = useCartStore()
    
    cart.addItem({ id: 1, name: 'Product 1', price: 100, image: '' }, 1)
    cart.applyPromoCode('TEST20', 20)
    
    expect(cart.discount).toBe(20)
    expect(cart.total).toBe(80)
  })
})