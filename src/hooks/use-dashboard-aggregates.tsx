"use client"

import { useMemo } from "react"
import { Order } from "@/types"

interface DashboardAggregates {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  conversionRate: number
  revenueByChannel: Record<string, number>
  revenueByCity: Record<string, number>
  ordersByStatus: Record<string, number>
  revenueByMonth: Record<string, number>
  topCustomers: Array<{ customerId: string; totalSpent: number; orderCount: number }>
  recentOrders: Order[]
}

export function useDashboardAggregates(orders: Order[]): DashboardAggregates {
  return useMemo(() => {
    if (!orders || orders.length === 0) {
      return {
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        conversionRate: 0,
        revenueByChannel: {},
        revenueByCity: {},
        ordersByStatus: {},
        revenueByMonth: {},
        topCustomers: [],
        recentOrders: []
      }
    }

    // Basic metrics
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const totalOrders = orders.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Revenue by channel
    const revenueByChannel = orders.reduce((acc, order) => {
      acc[order.channel] = (acc[order.channel] || 0) + order.total
      return acc
    }, {} as Record<string, number>)

    // Revenue by city
    const revenueByCity = orders.reduce((acc, order) => {
      acc[order.city] = (acc[order.city] || 0) + order.total
      return acc
    }, {} as Record<string, number>)

    // Orders by status
    const ordersByStatus = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Revenue by month
    const revenueByMonth = orders.reduce((acc, order) => {
      const month = new Date(order.date).toISOString().slice(0, 7) // YYYY-MM format
      acc[month] = (acc[month] || 0) + order.total
      return acc
    }, {} as Record<string, number>)

    // Top customers
    const customerStats = orders.reduce((acc, order) => {
      if (!acc[order.customerId]) {
        acc[order.customerId] = { totalSpent: 0, orderCount: 0 }
      }
      acc[order.customerId].totalSpent += order.total
      acc[order.customerId].orderCount += 1
      return acc
    }, {} as Record<string, { totalSpent: number; orderCount: number }>)

    const topCustomers = Object.entries(customerStats)
      .map(([customerId, stats]) => ({ customerId, ...stats }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10)

    // Recent orders (last 10)
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)

    // Mock conversion rate (in real app, this would come from analytics)
    const conversionRate = totalOrders > 0 ? (totalOrders / (totalOrders * 1.2)) * 100 : 0

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      conversionRate,
      revenueByChannel,
      revenueByCity,
      ordersByStatus,
      revenueByMonth,
      topCustomers,
      recentOrders
    }
  }, [orders])
}
