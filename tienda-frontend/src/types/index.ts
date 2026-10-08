export interface User {
  id: number
  username: string
  email: string
  role: string
  firstName?: string
  lastName?: string
  phone?: string
  avatar?: string
  addresses?: Address[]
}

export interface Address {
  id: number
  label: string
  street: string
  city: string
  state: string
  zipCode: string
  country?: string
  type: 'home' | 'work' | 'other'
}

export interface Product {
  id: number
  name: string
  price: number
  description?: string
  category: string
  image?: string
  imageUrl?: string
  stock: number
  isActive?: boolean
  sku?: string
  brand?: string
  colors?: string[]
  sizes?: string[]
  isNew?: boolean
  isFeatured?: boolean
  isOnSale?: boolean
  isBestseller?: boolean
  rating?: number
  averageRating?: number
  reviewCount?: number
  createdAt?: string
}

export interface CartItem {
  id?: number
  productId: number
  name: string
  price: number
  quantity: number
  imageUrl?: string
  category?: string
}

export interface Order {
  id: number
  orderNumber: string
  status: string
  total: number
  shippingCost?: number
  tax?: number
  items: OrderItem[]
  shippingAddress?: string
  billingAddress?: string
  createdAt: string
  estimatedDelivery?: string
  trackingCode?: string
  shippingCarrier?: string
  actualDeliveryDate?: string
}

export interface OrderItem {
  id: number
  productId: number
  product?: Product
  name: string
  price: number
  quantity: number
  imageUrl?: string
}

export interface Review {
  id: number
  productId: number
  userId: number
  rating: number
  title: string
  comment: string
  isVerified: boolean
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export interface ApiResponse<T> {
  data?: T
  message?: string
  error?: string
  statusCode?: number
}