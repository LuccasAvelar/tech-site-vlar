export interface User {
  id: number
  name: string
  email: string
  phone?: string
  birthDate?: string
  isAdmin: boolean
  createdAt?: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  images?: string[]
  category: string
  categoryId?: number
  stock: number
  sku?: string
  isActive: boolean
  weight?: number
  dimensions?: string
  brand?: string
  createdAt?: string
  updatedAt?: string
}

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

export interface Order {
  id: number
  userId?: number
  customerName: string
  customerEmail: string
  customerPhone: string
  products: CartItem[]
  total: number
  paymentMethod: string
  installments?: string
  address: string
  couponCode?: string
  status: string
  trackingCode?: string
  notes?: string
  createdAt: string
  updatedAt?: string
}

export interface Category {
  id: number
  name: string
  slug: string
  parentId?: number
  image?: string
  isActive: boolean
  sortOrder: number
  createdAt: string
}

export interface Banner {
  id: number
  title?: string
  image: string
  link?: string
  isActive: boolean
  sortOrder: number
  createdAt: string
}

export interface SiteContent {
  id: number
  key: string
  value: string
  type: string
  label: string
  description?: string
  createdAt: string
  updatedAt?: string
}

export interface ContactMessage {
  id: number
  name: string
  surname: string
  email: string
  whatsapp?: string
  message: string
  status: string
  createdAt: string
}
