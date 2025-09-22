"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"
import { Order, FilterOptions } from "@/types"

// Dynamic imports for better bundle optimization
const OrdersTable = dynamic(() => import("@/components/orders/orders-table").then(mod => ({ default: mod.OrdersTable })), {
  loading: () => <div>Loading table...</div>
})

const OrderDetailsDialog = dynamic(() => import("@/components/orders/order-details-dialog").then(mod => ({ default: mod.OrderDetailsDialog })), {
  loading: () => <div>Loading dialog...</div>
})

interface OrdersClientProps {
  initialOrders: Order[]
  initialSearchTerm: string
  initialStatusFilter: string
  initialFilters: FilterOptions
}

export function OrdersClient({ 
  initialOrders, 
  initialSearchTerm, 
  initialStatusFilter, 
  initialFilters 
}: OrdersClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter)
  const [orders] = useState(initialOrders)

  // Sync search params with URL
  useEffect(() => {
    const urlSearchTerm = searchParams.get('search') || ""
    const urlStatusFilter = searchParams.get('status') || ""
    
    setSearchTerm(urlSearchTerm)
    setStatusFilter(urlStatusFilter)
  }, [searchParams])

  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
    updateURL({ search: term })
  }

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status)
    updateURL({ status })
  }

  const updateURL = (params: { search?: string; status?: string }) => {
    const newParams = new URLSearchParams(searchParams.toString())
    
    if (params.search !== undefined) {
      if (params.search) {
        newParams.set('search', params.search)
      } else {
        newParams.delete('search')
      }
    }
    
    if (params.status !== undefined) {
      if (params.status) {
        newParams.set('status', params.status)
      } else {
        newParams.delete('status')
      }
    }
    
    const queryString = newParams.toString()
    const newUrl = queryString ? `?${queryString}` : ''
    router.push(newUrl, { scroll: false })
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.city.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !statusFilter || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <>
      <OrdersTable 
        orders={filteredOrders}
        isLoading={false}
        onOrderClick={setSelectedOrder}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
      />

      {selectedOrder && (
        <OrderDetailsDialog
          order={selectedOrder}
          open={!!selectedOrder}
          onOpenChange={() => setSelectedOrder(null)}
        />
      )}
    </>
  )
}
