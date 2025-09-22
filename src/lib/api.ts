import { Order, Customer, FilterOptions, DashboardMetrics, ChartData } from "@/types"
import ordersData from "@/data/orders.json"
import customersData from "@/data/customers.json"

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const api = {
  async getOrders(filters?: FilterOptions): Promise<Order[]> {
    await delay(300) // Simulate network delay
    
    let filteredOrders = ordersData.orders as Order[]

    if (filters) {
      if (filters.channel) {
        filteredOrders = filteredOrders.filter(order => order.channel === filters.channel)
      }
      
      if (filters.city) {
        filteredOrders = filteredOrders.filter(order => order.city === filters.city)
      }

      if (filters.period) {
        const now = new Date()
        // Ensure startDate is always initialized to a safe default
        let startDate: Date = new Date(0)

        switch (filters.period) {
          case '7d':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            break
          case '30d':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            break
          case 'qtd':
            const quarter = Math.floor(now.getMonth() / 3)
            startDate = new Date(now.getFullYear(), quarter * 3, 1)
            break
          case 'ytd':
            startDate = new Date(now.getFullYear(), 0, 1)
            break
          case 'custom':
            if (filters.startDate && filters.endDate) {
              startDate = new Date(filters.startDate)
              const endDate = new Date(filters.endDate)
              filteredOrders = filteredOrders.filter(order => {
                const orderDate = new Date(order.date)
                return orderDate >= startDate && orderDate <= endDate
              })
              return filteredOrders
            }
            break
        }

        if (filters.period !== 'custom') {
          filteredOrders = filteredOrders.filter(order => {
            const orderDate = new Date(order.date)
            return orderDate >= startDate!
          })
        }
      }
    }

    return filteredOrders
  },

  async getCustomers(filters?: { city?: string; search?: string }): Promise<Customer[]> {
    await delay(200)
    
    let filteredCustomers = customersData.customers as Customer[]

    if (filters?.city) {
      filteredCustomers = filteredCustomers.filter(customer => customer.city === filters.city)
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      filteredCustomers = filteredCustomers.filter(customer => 
        customer.name.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower)
      )
    }

    return filteredCustomers
  },

  async getDashboardMetrics(filters?: FilterOptions): Promise<DashboardMetrics> {
    await delay(200)
    
    const orders = await this.getOrders(filters)
    
    const revenue = orders.reduce((sum, order) => sum + order.total, 0)
    const ordersCount = orders.length
    const aov = ordersCount > 0 ? revenue / ordersCount : 0
    const conversionRate = ordersCount > 0 ? (ordersCount / (ordersCount * 1.2)) * 100 : 0 // Mock conversion rate

    return {
      revenue,
      orders: ordersCount,
      aov,
      conversionRate
    }
  },

  async getChartData(filters?: FilterOptions): Promise<ChartData[]> {
    await delay(200)
    
    const orders = await this.getOrders(filters)
    
    // Group by date
    const groupedData = orders.reduce((acc, order) => {
      const date = order.date
      if (!acc[date]) {
        acc[date] = { date, revenue: 0, orders: 0 }
      }
      acc[date].revenue += order.total
      acc[date].orders += 1
      return acc
    }, {} as Record<string, ChartData>)

    return Object.values(groupedData).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    await delay(300)
    
    const orderIndex = ordersData.orders.findIndex(order => order.id === orderId)
    if (orderIndex === -1) {
      throw new Error('Order not found')
    }
    
    ordersData.orders[orderIndex].status = status
    return ordersData.orders[orderIndex] as Order
  },

  async exportToCSV(filters?: FilterOptions): Promise<string> {
    await delay(500)
    
    const orders = await this.getOrders(filters)
    
    const headers = ['Date', 'Order ID', 'Customer', 'City', 'Channel', 'Status', 'Total']
    const rows = orders.map(order => [
      order.date,
      order.id,
      order.customerId,
      order.city,
      order.channel,
      order.status,
      order.total.toString()
    ])
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')
    
    return csvContent
  }
}
