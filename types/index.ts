export interface Product {
  id: string
  name: string
  description: string
  price: number
  image?: string
  images?: string[]
  category: string
  categoryId?: string
  stock: number
  sku?: string
  isActive?: boolean
  weight?: number
  dimensions?: string
  brand?: string
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  birthDate: string
  avatar?: string
  isAdmin: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CartItem extends Product {
  quantity: number
}

export interface Order {
  id: string
  userId?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  products?: CartItem[]
  total: number
  paymentMethod: string
  installments: string
  address: string
  couponCode?: string
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "returned"
  trackingCode?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Coupon {
  id: string
  code: string
  discount: number
  type: "percentage" | "fixed"
  isActive: boolean
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  parentId?: string
  image?: string
  isActive: boolean
  sortOrder: number
  createdAt: Date
}

export interface Banner {
  id: string
  title?: string
  image: string
  link?: string
  isActive: boolean
  sortOrder: number
  createdAt: Date
}

export interface StockNotification {
  id: string
  productId: string
  customerEmail: string
  customerName?: string
  notified: boolean
  createdAt: Date
}

export interface ContactMessage {
  id: string
  name: string
  surname: string
  email: string
  whatsapp?: string
  message: string
  status: "new" | "read" | "replied"
  createdAt: Date
}

export interface SiteContent {
  id: string
  key: string
  value: string
  type: "text" | "textarea" | "image"
  label: string
  description?: string
  createdAt: Date
  updatedAt: Date
}
