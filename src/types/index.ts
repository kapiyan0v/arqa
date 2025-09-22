export interface Order {
  id: string
  date: string
  customerId: string
  city: string
  channel: 'Web' | 'Mobile' | 'Offline'
  status: 'New' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  total: number
  items: OrderItem[]
  comment?: string
}

export interface OrderItem {
  sku: string
  name: string
  qty: number
  price: number
}

export interface Customer {
  id: string
  name: string
  email: string
  city: string
  ltv: number
  ordersCount: number
}

export interface DashboardMetrics {
  revenue: number
  orders: number
  aov: number
  conversionRate: number
}

export interface FilterOptions {
  period: '7d' | '30d' | 'qtd' | 'ytd' | 'custom'
  startDate?: string
  endDate?: string
  channel?: string
  city?: string
}

export interface ChartData {
  date: string
  revenue: number
  orders: number
}

export type Theme = 'light' | 'dark'
export type Language = 'ru' | 'en'
export type UserRole = 'viewer' | 'admin'
